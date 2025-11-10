import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Mail, Phone } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl md:text-2xl text-blue-400 font-semibold mb-2">
                Hello, I'm
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-gradient">Kshitij Bhardwaj</span>
              </h1>
              <h3 className="text-2xl md:text-3xl text-gray-300 mb-6">
                Full Stack Developer
              </h3>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 leading-relaxed max-w-xl"
            >
              Dedicated and result-oriented developer with an entrepreneurial mindset and 
              professional aptitude in Computer Science. Analytical, innovative, goal-oriented, 
              and self-motivated professional providing clients a never-before experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 text-center"
              >
                Get In Touch
              </a>
              <a
                href="#projects"
                className="px-8 py-3 border-2 border-blue-500 rounded-lg font-semibold hover:bg-blue-500/10 transition-all duration-300 text-center"
              >
                View Projects
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <a
                href="mailto:Kshitijbhardwajkb28@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Mail size={20} />
                <span>Kshitijbhardwajkb28@gmail.com</span>
              </a>
              <a
                href="tel:+919729916844"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Phone size={20} />
                <span>+91 9729916844</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Animated illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Animated circles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
              />
              
              {/* Center content */}
              <div className="relative z-10 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">Available for work</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1/2"></div>
                    <div className="h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="text-gray-400" size={32} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
