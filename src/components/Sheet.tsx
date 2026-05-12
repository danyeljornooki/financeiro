"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { ReactNode, useEffect } from "react"

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Sheet({ isOpen, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#0f0f23] border-l border-white/5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}