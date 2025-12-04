import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, Calendar } from 'lucide-react'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const projects = [
    {
      title: 'Yot Ecommerce',
      period: 'January 2025 - October 2025',
      description: 'Improved search, workflows, and notifications using Meilisearch, Ragic DB, and Twilio. Added product management features with secure OAuth2 authentication. Created background jobs that fetch data from third-party suppliers and automatically update product information.',
      technologies: ['Ragic DB', 'Next.js', 'Laravel', 'PostgreSQL', 'Meilisearch'],
      link: 'https://fuse.systems',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Remodely',
      period: 'October 2024 - December 2025',
      description: 'Built service booking & dashboard modules, and created flow to design bathroom and interiors. Developed comprehensive service management system with intuitive user interface and seamless booking experience.',
      technologies: ['React.js', 'Node.js', 'MySQL', 'REST API'],
      link: 'https://remodely.com',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Service Points',
      period: 'October 2023 - October 2024',
      description: 'Built and integrated chatbot functionalities with custom conversational flows using prompt engineering. Developed real-time chat features using WebSockets and CKEditor. Resolved multiple front-end design issues and developed performance charts showing 7-day page load trends.',
      technologies: ['Laravel', 'Node.js', 'MongoDB', 'MySQL', 'CKEditor', 'Shopify', 'FastAPI'],
      link: 'https://app.servicepoints.nl',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="projects" className="section-shell" ref={ref}>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative glass-panel border-white/5 overflow-hidden hover:border-blue-500/50 transition-all"
            >
              {/* Gradient header with animation */}
              <motion.div
                className={`h-3 bg-gradient-to-r ${project.gradient}`}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              />

              <div className="p-6 relative">
                {/* Project title and period */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>{project.period}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-400">
                  <span className="inline-flex items-center gap-1 text-blue-300">
                    <ExternalLink size={12} />
                    Case study
                  </span>
                  <span className="h-px flex-1 bg-white/10"></span>
                  <span>{project.period}</span>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs border border-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.link ? (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.08, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                    >
                      <ExternalLink size={16} />
                      <span>View Project</span>
                    </motion.a>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.08, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <ExternalLink size={16} />
                      <span>Coming Soon</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/80 text-gray-300 rounded-lg text-sm border border-gray-700 hover:border-blue-500 hover:bg-gray-700/80 hover:text-white transition-all"
                  >
                    <Github size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>

              {/* Corner glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* View more projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/Kshitijkb28"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <Github size={20} />
            <span>View More on GitHub</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
