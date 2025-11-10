import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Palette, Server, Database, Cloud } from 'lucide-react'

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const skillCategories = [
    {
      icon: Code2,
      title: 'Languages',
      skills: ['PHP', 'Python', 'JavaScript', 'C++'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Frontend',
      skills: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'React'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Server,
      title: 'Backend',
      skills: ['Laravel', 'Node.js', 'FastAPI', 'Flask', 'Django'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      title: 'Database',
      skills: ['MySQL', 'MongoDB', 'PostgreSQL'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Cloud,
      title: 'Cloud',
      skills: ['AWS S3 Bucket'],
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="skills" className="py-20 px-4 bg-gray-900/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
            >
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${category.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-blue-500/50 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-300">Other Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['WebSockets', 'CKEditor', 'Shopify', 'OAuth2', 'Electron', 'REST APIs', 'Git', 'Prompt Engineering'].map((tech, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium hover:border-blue-500 transition-all"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
