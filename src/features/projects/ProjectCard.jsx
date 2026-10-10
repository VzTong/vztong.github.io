import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * ProjectCard Component
 * 
 * Reusable summary card for quick project listing or alternative grid view.
 * 
 * @param {Object} props.project - The project object
 * @param {Function} props.onSelect - Callback when clicked
 */
export default function ProjectCard({ project, onSelect }) {
  const { i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'

  const title = project.title?.[currentLang] || project.title?.vi || ''
  const summary = project.summary?.[currentLang] || project.summary?.vi || ''

  return (
    <div
      onClick={onSelect}
      className="p-6 rounded-2xl border border-brand-border dark:border-brand-border-dark
        bg-brand-card dark:bg-brand-card-dark
        shadow-sm hover:shadow-brand-glow hover:border-brand-accent dark:hover:border-brand-accent-dark
        transition-all duration-300 flex flex-col justify-between cursor-pointer group"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-semibold ${
              project.type === 'gallery'
                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}
          >
            type: {project.type}
          </span>
          <span className="text-[11px] font-mono text-brand-muted dark:text-brand-muted-dark">
            #{project.id}
          </span>
        </div>

        <h3 className="text-lg font-bold text-brand-text dark:text-white group-hover:text-brand-accent dark:group-hover:text-brand-accent-dark transition-colors">
          {title}
        </h3>

        <p className="text-xs text-brand-muted dark:text-brand-muted-dark line-clamp-3 leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-brand-border/60 dark:border-brand-border-dark/60 flex flex-wrap gap-1.5">
        {project.technologies?.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {tech}
          </span>
        ))}
        {project.technologies?.length > 4 && (
          <span className="text-[10px] font-mono text-brand-muted dark:text-brand-muted-dark self-center">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>
    </div>
  )
}
