import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * CoverPage Component
 * 
 * Renders the front or back hardcover of the 3D flipbook.
 * Wrapped with React.forwardRef for StPageFlip compatibility.
 */
const CoverPage = React.forwardRef(
  (
    {
      isBack = false,
      data,
      onOpenBook,
      ...rest
    },
    ref
  ) => {
    const { t } = useTranslation('portfolio')

    if (isBack) {
      return (
        <div
          ref={ref}
          className="relative h-full w-full bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950
            text-slate-100 p-8 flex flex-col justify-between items-center text-center
            border-l-4 border-blue-600 shadow-2xl rounded-r-xl select-none"
          {...rest}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 pt-4">
            <span className="inline-block px-3 py-1 text-xs font-mono tracking-widest text-blue-400 bg-blue-950/60 rounded-full border border-blue-800/60 uppercase">
              End of Showcase
            </span>
          </div>

          <div className="relative z-10 space-y-4 max-w-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              {t('contact.title', 'Liên hệ & Hợp tác')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('about.bio')}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={data?.contact?.github || 'https://github.com/ayana0409'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-medium text-slate-200 bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub @ayana0409
              </a>
            </div>
          </div>

          <div className="relative z-10 pb-4 text-[11px] font-mono text-slate-500">
            © {new Date().getFullYear()} {data?.about?.name || 'Dương Đoàn Thuận'}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className="relative h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950
          text-slate-100 p-8 flex flex-col justify-between items-center text-center
          border-r-4 border-blue-600 shadow-2xl rounded-l-xl select-none"
        {...rest}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="absolute inset-4 border border-blue-500/20 rounded-lg pointer-events-none" />

        <div className="relative z-10 pt-4 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center shadow-brand-glow">
            <span className="font-mono font-black text-blue-400 text-base tracking-tighter">
              &lt;/&gt;
            </span>
          </div>
          <span className="text-[11px] font-mono tracking-widest text-blue-400 uppercase font-semibold">
            Interactive Project Book
          </span>
        </div>

        <div className="relative z-10 space-y-4 max-w-sm">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {data?.about?.name || 'Dương Đoàn Thuận'}
            </h1>
            <p className="text-blue-400 font-mono text-sm tracking-wide">
              {t('about.role', 'Backend Developer')}
            </p>
          </div>

          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto" />

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {t('about.bio')}
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {(
              Array.isArray(data?.about?.skills)
                ? data.about.skills
                : data?.about?.skills?.backend?.items || ['C#', '.NET', 'ReactJS', 'SQL Server', 'Docker']
            )
              .slice(0, 5)
              .map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/80 border border-blue-700/50 text-blue-300 rounded"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        <div className="relative z-10 pb-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onOpenBook}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs
              shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60
              transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('ui.buttons.nextPage', 'Mở sách / Lật trang')}</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-[10px] font-mono text-slate-400">
            Click / Kéo góc để lật trang
          </span>
        </div>
      </div>
    )
  }
)

CoverPage.displayName = 'CoverPage'

export default CoverPage
