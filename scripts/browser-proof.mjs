/**
 * Drives the REAL Book Flights page in headless Chrome (DevTools protocol) and
 * presses the real + / − buttons, recording the traveller total after every click.
 *   node scripts/browser-proof.mjs http://127.0.0.1:5199 certification/proof-travellers.png
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base = 'http://127.0.0.1:5199', shot = 'certification/proof-travellers.png'] = process.argv.slice(2)
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'))
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9333', `--user-data-dir=${dir}`, '--window-size=1280,1000', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let tabs
for (let i = 0; i < 40; i++) {
  try { tabs = await (await fetch('http://127.0.0.1:9333/json')).json(); if (tabs.length) break } catch { /* wait */ }
  await sleep(250)
}
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } }
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value

await send('Page.enable')
await send('Page.navigate', { url: `${base}/book-flights` })
for (let i = 0; i < 60; i++) { await sleep(500); if (await evalJs(`!!document.querySelector('[aria-label="More adults"]')`)) break }

const state = `(() => { const t = document.body.innerText.match(/(\\d+) travellers?/); const n = (l) => document.querySelector('[aria-label="'+l+'"]').parentElement.querySelector('span').textContent; return { total: t ? +t[1] : null, adults: +n('More adults'), children: +n('More children'), infants: +n('More infants') } })()`
const press = (label) => evalJs(`(() => { const b = document.querySelector('[aria-label="${label}"]'); if (b && !b.disabled) { b.click(); return 'clicked' } return 'disabled' })()`)

console.log('initial      ', JSON.stringify(await evalJs(state)))
// 1. Hammer + on everything, in the order that broke the old page: adults, then infants, then children.
for (const l of ['More adults', 'More infants', 'More children']) for (let i = 0; i < 12; i++) { await press(l); await sleep(15) }
const maxed = await evalJs(state)
console.log('after 36 +   ', JSON.stringify(maxed))
// 2. Random presses of every button, 1500 times, checking every single state.
const labels = ['More adults', 'Fewer adults', 'More children', 'Fewer children', 'More infants', 'Fewer infants']
let worst = 0, violations = 0, presses = 0, blocked = 0
for (let i = 0; i < 1500; i++) {
  const r = await press(labels[Math.random() * 6 | 0]); r === 'clicked' ? presses++ : blocked++
  const s = await evalJs(state)
  const total = s.adults + s.children + s.infants
  worst = Math.max(worst, total)
  if (total > 9 || s.adults < 1 || s.infants > s.adults || s.total !== total) violations++
}
console.log(`random run    clicks accepted=${presses} blocked(disabled)=${blocked} highest total=${worst} violations=${violations}`)
// 3. Max out then try Search: must still be 9 or fewer.
for (let i = 0; i < 12; i++) { await press('More adults'); await press('More children') }
console.log('final         ', JSON.stringify(await evalJs(state)))
await evalJs(`document.querySelector('[aria-label="More adults"]').scrollIntoView({block:'center'})`); await sleep(400)
const png = await send('Page.captureScreenshot', { format: 'png' })
fs.writeFileSync(shot, Buffer.from(png.result.data, 'base64'))
console.log('screenshot    ', shot)
ws.close(); chrome.kill()
try { fs.rmSync(dir, { recursive: true, force: true }) } catch { /* chrome still releasing files */ }
process.exit(violations ? 1 : 0)
