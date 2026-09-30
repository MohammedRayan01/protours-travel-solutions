/* ============================================================
   GSAP setup — registered once, imported everywhere.
   ============================================================ */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP)

/** Shared easing so every animation on the site feels related. */
export const EASE = 'power3.out'
export const EASE_EXPO = 'expo.out'

/** True when the visitor has asked the OS to reduce motion. */
export const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Standard ScrollTrigger config for "animate once as it enters".
 * Keeps start/toggle values consistent across the whole site.
 */
export const enterTrigger = (trigger, extra = {}) => ({
  trigger,
  start: 'top 82%',
  toggleActions: 'play none none none',
  ...extra,
})

/** True on devices with a real hovering mouse — gates cursor-driven effects. */
export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP }
