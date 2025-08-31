"use client"

import { motion } from "framer-motion"

type Project = {
  titleEn: string
  titleAr: string
  thumb: string
}

interface ProjectCardProps {
  project: Project
  index: number
  isRTL: boolean
  language: string
  onClick: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isRTL, language, onClick }) => {
  const title = isRTL ? project.titleAr : project.titleEn

  return (
    <div
      className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="relative w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${project.thumb})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {title}
            </h3>
            <div className="flex items-center gap-4 text-white/80">
              <span className="text-sm md:text-base font-medium">
                {language === 'ar' ? 'اضغط للعرض' : 'Click to view'}
              </span>
              <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white text-gray-900 shadow-md flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <span className="font-bold text-lg">
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
