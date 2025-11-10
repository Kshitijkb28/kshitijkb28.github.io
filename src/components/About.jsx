import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Award, Briefcase } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Briefcase, label: 'Experience', value: '1+ Years' },
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

  return (
    <section id="about" className="py-20 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-3xl font-bold text-gradient mb-2">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
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
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
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
