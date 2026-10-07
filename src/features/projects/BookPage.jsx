import React from 'react'

/**
 * BookPage Component
 * 
 * Reusable page wrapper for individual pages inside HTMLFlipBook.
 * Wrapped with React.forwardRef as required by StPageFlip.
 */
const BookPage = React.forwardRef(
  (
    {
      children,
      pageNumber,
      isCover = false,
      isBackCover = false,
      side = 'right',
      className = '',
      ...rest
    },
    ref
  ) => {
    if (isCover || isBackCover) {
      return (
        <div
          ref={ref}
          className={`relative h-full w-full overflow-hidden select-none ${className}`}
          {...rest}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={`relative h-full w-full overflow-hidden flex flex-col justify-between
          bg-brand-card dark:bg-brand-card-dark
          text-brand-text dark:text-brand-text-dark
          border border-brand-border/80 dark:border-brand-border-dark/80
          shadow-md transition-colors duration-200
          ${side === 'left' ? 'rounded-l-lg' : 'rounded-r-lg'}
          ${className}`}
        {...rest}
      >
        {/* Book spine lighting & shadow gradient overlay */}
        {side === 'left' && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10
              bg-gradient-to-l from-black/15 via-black/5 to-transparent
              dark:from-black/40 dark:via-black/15 dark:to-transparent"
          />
        )}
        {side === 'right' && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10
              bg-gradient-to-r from-black/15 via-black/5 to-transparent
              dark:from-black/40 dark:via-black/15 dark:to-transparent"
          />
        )}

        {/* Paper texture subtle top gradient for depth */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-4 z-10
            bg-gradient-to-b from-black/[0.03] to-transparent
            dark:from-white/[0.02] dark:to-transparent"
        />

        {/* Page Inner Content Container */}
        <div className="relative z-0 flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar">
          {children}
        </div>

        {/* Page Footer (Page number & branding) */}
        <div
          className="relative z-0 px-6 py-3 border-t border-brand-border/60 dark:border-brand-border-dark/60
            flex items-center justify-between text-xs font-mono text-brand-muted dark:text-brand-muted-dark
            bg-brand-bg/40 dark:bg-brand-bg-dark/40 select-none"
        >
          {side === 'left' ? (
            <>
              <span className="font-semibold text-brand-accent dark:text-brand-accent-dark">
                {pageNumber}
              </span>
              <span className="opacity-70 tracking-wider uppercase text-[10px]">
                Portfolio / Projects
              </span>
            </>
          ) : (
            <>
              <span className="opacity-70 tracking-wider uppercase text-[10px]">
                Dương Đoàn Thuận
              </span>
              <span className="font-semibold text-brand-accent dark:text-brand-accent-dark">
                {pageNumber}
              </span>
            </>
          )}
        </div>
      </div>
    )
  }
)

BookPage.displayName = 'BookPage'

export default BookPage
