'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface OverlayDrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  ctaLabel?: string
  onCta?: () => void
}

// Utility: find focusable elements inside a container
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ]
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors.join(',')))
  return nodes.filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1 && !el.getAttribute('aria-hidden'))
}

export default function OverlayDrawer({
  isOpen,
  onClose,
  title = 'SmartWatchPro Sandbox',
  ctaLabel = 'Visit Our Website',
  onCta
}: OverlayDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [onClose]
  )

  // Focus trap and initial focus
  useEffect(() => {
    const drawerEl = drawerRef.current
    if (!drawerEl) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusables = getFocusableElements(drawerEl)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (active === first || !drawerEl.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    if (isOpen) {
      lastFocusedRef.current = (document.activeElement as HTMLElement) || null
      document.addEventListener('keydown', handleKeyDown)
      drawerEl.addEventListener('keydown', onKeyDown)
      // Lock background scroll
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Move focus inside
      setTimeout(() => {
        const focusables = getFocusableElements(drawerEl)
        ;(focusables[0] || drawerEl).focus()
      }, 0)

      // Cleanup on close
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        drawerEl.removeEventListener('keydown', onKeyDown)
        document.body.style.overflow = previousOverflow
        if (lastFocusedRef.current) {
          lastFocusedRef.current.focus()
        }
      }
    }
  }, [isOpen, handleKeyDown])

  // Render nothing on server
  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <section
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-drawer-title"
        id="overlay-drawer"
        tabIndex={-1}
        className={`fixed top-0 right-0 h-full z-50 bg-[#121212] text-white shadow-2xl border-l border-[#D4AF37]/20 w-full sm:w-[35vw] max-w-full p-6 sm:p-8 transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        style={{ boxShadow: '0 0 24px rgba(212,175,55,0.15)' }}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 id="overlay-drawer-title" className="text-2xl font-bold tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="ml-4 text-[#D4AF37] hover:text-[#FFD700] focus:outline-none focus-visible:outline-none rounded"
            aria-label="Close overlay"
            style={{
              outline: 'none',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div className="text-[#AAAAAA] mb-6 leading-relaxed space-y-4">
          <p>SmartWatchPro isn’t a real product, but this interactive showcase is.</p>
          <p>
            It serves as our sandbox — a fictional smart watch concept designed to demonstrate the
            fusion of brand storytelling with cutting-edge 3D interactions.
          </p>
        </div>

        <p className="mb-8">Ready to elevate your web experience?</p>

        <button
          className="bg-[#D4AF37] text-[#0E0E0E] px-6 py-3 rounded-full font-semibold hover:bg-[#FFD700] transition-colors duration-300 focus:outline-none focus-visible:outline-none"
          onClick={() => {
            if (onCta) onCta()
            else {
              // Default CTA action placeholder
              window.open('https://www.smitherytech.com/', '_blank', 'noopener,noreferrer')
            }
          }}
        >
          {ctaLabel}
        </button>
      </section>
    </>
  , document.body)
}


