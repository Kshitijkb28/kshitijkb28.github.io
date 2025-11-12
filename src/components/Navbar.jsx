import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Github, Linkedin } from 'lucide-react'

const Navbar = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-gray-950/70 backdrop-blur-xl' : 'py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-panel border-white/5 flex items-center justify-between h-16 px-4 sm:px-6 rounded-2xl">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-lg font-semibold tracking-[0.35em] uppercase text-gray-200"
            whileHover={{ scale: 1.03 }}
          >
            KB
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
            <div className="flex items-center space-x-4 ml-4">
              <motion.a
                href="https://github.com/Kshitijkb28"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-gray-300 hover:text-white"
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/Kshitij Bhardwaj"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-gray-300 hover:text-white"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-blue-500/60 rounded-full text-sm font-semibold text-white hover:bg-blue-500/10 transition-all"
              >
                Hire me
              </motion.a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center space-x-4 px-3 py-2">
              <a
                href="https://github.com/Kshitijkb28"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/Kshitij Bhardwaj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#contact"
                className="flex-1 text-center px-4 py-2 bg-blue-500/10 border border-blue-500/40 rounded-xl text-white font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Hire me
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
