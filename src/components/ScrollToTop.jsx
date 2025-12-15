import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)

      if (scrollTop > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Progress ring using conic gradient */}
          <div
            className="relative w-16 h-16 rounded-full p-1"
            style={{
              background: `conic-gradient(
                from 0deg,
                #22d3ee 0%,
                #10b981 ${scrollProgress * 0.5}%,
                #34d399 ${scrollProgress}%,
                rgba(255, 255, 255, 0.15) ${scrollProgress}%,
                rgba(255, 255, 255, 0.15) 100%
              )`,
            }}
          >
            {/* Inner button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop




