import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const experience = {
    company: 'Mind2web LLP',
    position: 'Associate Software Developer',
    period: 'August 2023 - October 2025',
    location: 'Remote',
    responsibilities: [
      'Configured and deployed projects on servers, ensuring smooth setup and optimal performance',
      'Enhanced platform scalability and performance by fixing critical bugs and optimizing backend code',
      'Set up Linux-based servers, configured environments (Apache/Nginx, PHP, Node.js), and deployed multiple projects with proper security, monitoring, and performance optimization'
    ],
    technologies: ['Laravel', 'Node.js', 'MySQL', 'MongoDB', 'PostgreSQL', 'React', 'Next.js', 'Meilisearch', 'Linux', 'Apache', 'Nginx']
  }

  return (
    <section id="experience" className="section-shell" ref={ref}>
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Professional <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-purple-500/30 to-transparent"></div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative pl-12 md:pl-20 pb-8"
            >
              {/* Timeline dot */}
              <div className="absolute left-3 md:left-6 top-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-gray-950 shadow-lg shadow-blue-500/40"></div>

              <div className="glass-panel border-white/5 p-6 md:p-8 hover:border-blue-500/50 transition-all">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">
                      {experience.position}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Briefcase size={18} />
                      <span className="font-semibold">{experience.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2 md:mt-0">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={16} />
                      <span>{experience.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={16} />
                      <span>{experience.location}</span>
                    </div>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-200 mb-3">Key Responsibilities:</h4>
                  <ul className="space-y-2">
                    {experience.responsibilities.map((responsibility, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3 text-gray-400"
                      >
                        <span className="text-blue-400 mt-1">▹</span>
                        <span>{responsibility}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-200 mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:border-blue-500 transition-colors"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience
