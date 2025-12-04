import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Award, Briefcase } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Briefcase, label: 'Experience', value: '2 yrs 3 mos' },
    { icon: Award, label: 'Projects', value: '10+' },
    { icon: GraduationCap, label: 'Certifications', value: '2+' },
  ]

  const education = [
    {
      degree: 'Bachelor of Technology',
      field: 'Computer Science',
      institution: 'Panipat Institute of Engineering and Technology',
      period: '2019 - 2023',
      score: '70%'
    },
    {
      degree: '12th Grade',
      field: 'Non Medical',
      institution: 'Hindu Vidya Peeth',
      period: '2018 - 2019',
      score: '64%'
    }
  ]

  const focusAreas = [
    {
      title: 'Product-Driven',
      description: 'Blend of engineering depth and product thinking to ship features that move business metrics.',
      accent: 'from-blue-500/40 via-cyan-500/20 to-transparent'
    },
    {
      title: 'Systems Mindset',
      description: 'Comfortable moving between frontend polish, backend design, and cloud infrastructure decisions.',
      accent: 'from-purple-500/40 via-pink-500/20 to-transparent'
    },
    {
      title: 'Quality Loop',
      description: 'Bias for automation, accessibility, and maintainable patterns that keep iteration fast.',
      accent: 'from-emerald-500/40 via-teal-500/20 to-transparent'
    }
  ]

  return (
    <section id="about" className="section-shell" ref={ref}>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08, y: -8 }}
              className="relative glass-panel p-8 text-center overflow-hidden group transition-all hover:-translate-y-1"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4 shadow-lg"
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3
                  className="text-4xl font-bold text-gradient mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Focus cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              whileHover={{ y: -6 }}
              className="group relative h-full rounded-2xl border border-white/5 bg-gray-900/50 p-6 overflow-hidden"
            >
              <span className="text-sm uppercase tracking-[0.2em] text-gray-400">Focus</span>
              <h3 className="mt-3 text-xl font-semibold text-white">{area.title}</h3>
              <p className="mt-3 text-gray-400 leading-relaxed">{area.description}</p>
              <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r ${area.accent} opacity-0 transition-opacity group-hover:opacity-30`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold mb-8 text-center">
            <GraduationCap className="inline-block mr-2 mb-1" size={32} />
            Education
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="glass-panel p-6 hover:border-blue-500/60 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-blue-400 mb-1">{edu.degree}</h4>
                    <p className="text-gray-300">{edu.field}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {edu.score}
                  </span>
                </div>
                <p className="text-gray-400 mb-2">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.period}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
