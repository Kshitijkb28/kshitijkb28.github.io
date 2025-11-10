import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/Kshitijkb28',
      label: 'GitHub'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/in/Kshitij Bhardwaj',
      label: 'LinkedIn'
    },
    {
      icon: Mail,
      href: 'mailto:Kshitijbhardwajkb28@gmail.com',
      label: 'Email'
    }
  ]

  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              Made with <Heart size={16} className="text-red-500 animate-pulse" /> by
              <span className="text-gradient font-semibold">Kshitij Bhardwaj</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              © {currentYear} All rights reserved.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              >
                <link.icon size={20} className="text-gray-400 hover:text-blue-400 transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Back to top */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <motion.a
            href="#home"
            whileHover={{ y: -3 }}
            className="inline-block text-gray-400 hover:text-blue-400 transition-colors text-sm"
          >
            Back to top ↑
          </motion.a>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
