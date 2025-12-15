import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Mail, Phone, Sparkles, Code, Rocket, Shield, Cpu } from 'lucide-react'

const Hero = () => {
  const heroStats = [
    { label: 'Experience', value: '2 yrs 3 mos', detail: 'Full-stack product work' },
    { label: 'Projects', value: '10+', detail: 'End-to-end deliveries' },
    { label: 'Certifications', value: '2+', detail: 'IBM & Smart IT' },
  ]

  const techPills = ['React', 'Next.js', 'Laravel', 'Node.js', 'PostgreSQL', 'Meilisearch']

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 overflow-hidden w-full max-w-full">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Available for opportunities</span>
              </motion.div>
              <h2 className="text-xl md:text-2xl text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block"
                >
                  👋
                </motion.span>
                Hello, I'm
              </h2>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
                  Kshitij Bhardwaj
                </span>
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <Code className="text-purple-400" size={28} />
                <h3 className="text-2xl md:text-3xl text-gray-300">
                  Full Stack Developer
                </h3>
                <Rocket className="text-pink-400" size={28} />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 leading-relaxed max-w-xl"
            >
              Dedicated and results-oriented Full-Stack Web Developer with 2 years and 3 months of hands-on
              experience. Possesses an entrepreneurial mindset and strong professional aptitude in the field of
              Computer Science. Analytical, innovative, and goal-driven, with the ability to deliver high-quality
              solutions and provide clients with a never-before experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl font-semibold transition-all duration-300 text-center relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Get In Touch
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-500 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 text-center backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Rocket size={20} />
                View Projects
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6"
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="glass-panel border-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {techPills.map((tech) => (
                <motion.span
                  key={tech}
                  whileHover={{ y: -3 }}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 bg-white/5"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 pt-2 text-sm text-gray-400"
            >
              <a
                href="mailto:Kshitijbhardwajkb28@gmail.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors overflow-hidden"
              >
                <Mail size={18} className="flex-shrink-0" />
                <span className="break-all">Kshitijbhardwajkb28@gmail.com</span>
              </a>
              <a
                href="tel:+919729916844"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors overflow-hidden"
              >
                <Phone size={18} className="flex-shrink-0" />
                <span className="break-all">+91 9729916844</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Animated illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/10 blur-3xl" />
              <div className="glass-panel border-white/5 p-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Current Availability</p>
                    <p className="text-lg text-white font-semibold">Taking new projects</p>
                  </div>
                  <motion.span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield size={16} /> Reliable partner
                  </motion.span>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Code, label: 'Frontend', gradient: 'from-blue-500 to-cyan-500', value: 'React + Tailwind' },
                    { icon: Rocket, label: 'Backend', gradient: 'from-purple-500 to-pink-500', value: 'Laravel + Node.js' }
                  ].map((item, index) => (
                    <div key={item.label} className="relative p-4 rounded-2xl border border-white/5 bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                          <item.icon className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="text-gray-300 text-sm">{item.label}</p>
                          <p className="font-semibold text-white">{item.value}</p>
                        </div>
                      </div>
                      <motion.div
                        className="absolute bottom-3 left-4 right-4 h-1 rounded-full bg-white/10 overflow-hidden"
                      >
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/5 pt-6">
                  <p className="text-sm text-gray-400 mb-3">Recent Focus</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Prompt Engineering', 'Chatbots', 'Realtime apps', 'Automation'].map((focus) => (
                      <motion.span
                        key={focus}
                        whileHover={{ y: -2 }}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300"
                      >
                        {focus}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute -right-8 -bottom-8 glass-panel border-white/5 p-5 space-y-2 w-40"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Cpu size={20} className="text-blue-400" />
                <p className="text-sm text-gray-400">Stack depth</p>
                <p className="text-lg font-semibold text-white">Frontend ↔ Backend</p>
              </motion.div>
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
