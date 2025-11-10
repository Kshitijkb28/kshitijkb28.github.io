import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, ExternalLink, Calendar } from 'lucide-react'

const Certifications = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const certifications = [
    {
      title: 'Python With Data Science',
      issuer: 'IBM',
      date: 'March 28, 2022',
      link: 'https://drive.google.com/file/d/15KVWs_HgFoJfGpYSNjhESIKVbYDA-o4T/view?usp=sharing',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Data Structures and Algorithms',
      issuer: 'Smart IT Services',
      date: 'May 31, 2023',
      link: 'https://drive.google.com/file/d/17xgEYeu9aP2uoB3E_R0fWOXo7lPc_iiW/view?usp=sharing',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section id="certifications" className="py-20 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Certifications</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cert.color} p-2.5 group-hover:scale-110 transition-transform`}>
                    <Award className="w-full h-full text-white" />
                  </div>
                  <motion.a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <ExternalLink size={18} className="text-blue-400" />
                  </motion.a>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {cert.title}
                </h3>

                <p className="text-gray-300 font-semibold mb-3">{cert.issuer}</p>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar size={14} />
                  <span>{cert.date}</span>
                </div>
              </div>

              {/* Decorative corner */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cert.color} opacity-10 blur-2xl`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Certifications
