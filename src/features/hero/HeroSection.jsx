import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { scrollToElement } from "../../utils/helpers";
import Typed from "typed.js";
import DocumentsModal from "../../components/common/DocumentsModal";
import pic5 from "../../assets/images/pic5.jpg";

/**
 * HeroSection — Clean Editorial + Portrait
 *
 * Chức năng:
 * - Background: nebula + ánh sáng xanh + ảnh chân dung + starfield + overlay.
 * - GSAP entrance animation cho nội dung Hero.
 * - Typed.js luân phiên 3 câu ngắn (cho phép xuống dòng tự nhiên).
 * - Hỗ trợ tiếng Việt / tiếng Anh.
 * - CTA khám phá dự án và mở CV / bảng điểm.
 * - Scroll indicator hỗ trợ chuột và bàn phím.
 * - Tôn trọng prefers-reduced-motion.
 * - Chống bôi đen + anti-scrape nhẹ (select-none + chặn copy/contextmenu).
 */
export default function HeroSection({ onExploreClick }) {
  // ===========================================================================
  // 1. LANGUAGE, STATE & REFS
  // ===========================================================================

  const { i18n } = useTranslation("portfolio");
  const currentLang = i18n.language === "en" ? "en" : "vi";

  // Điều khiển modal CV và bảng điểm.
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Ref quản lý phạm vi GSAP và các phần tử cần animation.
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Ref riêng cho Typed.js, không dùng chung với GSAP.
  const typedElementRef = useRef(null);

  // ===========================================================================
  // 2. HERO COPY
  // ===========================================================================

  // Nhãn vai trò phía trên tên.
  const roleText =
    currentLang === "vi" ? "LẬP TRÌNH VIÊN PHẦN MỀM" : "SOFTWARE ENGINEER";

  const heroHeading =
    currentLang === "vi" ? "TỐNG NHÃ VY" : "TONG NHA VY";

  const tagline =
    currentLang === "vi"
      ? "Code ban ngày, debug ban đêm. "
      : "Code by day, debug by night. ";

  const typedStrings =
    currentLang === "vi"
      ? ["Xây dựng với .NET", "Khám phá AI － Full-stack", "Lại debug nữa..."]
      : [
          "Building with .NET",
          "Exploring AI － full-stack",
          "Debugging... again",
        ];

  const lifestyleLine =
    currentLang === "vi"
      ? "Và vẫn mơ về chuyến đi tiếp theo."
      : "And still dreaming of the next getaway.";

  const technicalSignature =
    ".NET BACKEND · CLEAN ARCHITECTURE · CQRS · gRPC · AI INTEGRATION";

  // ===========================================================================
  // 3. GSAP ENTRANCE ANIMATION
  // ===========================================================================

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Lấy các phần tử con trực tiếp của khối nội dung.
      const elements = contentRef.current?.children
        ? Array.from(contentRef.current.children)
        : [];

      // Cho nội dung xuất hiện tuần tự.
      if (elements.length > 0) {
        if (prefersReducedMotion) {
          gsap.set(elements, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              delay: 0.08,
            },
          );
        }
      }

      // Hiệu ứng xuất hiện và chuyển động nhẹ cho scroll indicator.
      if (scrollIndicatorRef.current) {
        if (prefersReducedMotion) {
          gsap.set(scrollIndicatorRef.current, {
            opacity: 1,
            y: 0,
          });
        } else {
          gsap.fromTo(
            scrollIndicatorRef.current,
            { opacity: 0, y: -8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.55,
              ease: "power2.out",
            },
          );

          gsap.to(scrollIndicatorRef.current, {
            y: 6,
            repeat: -1,
            yoyo: true,
            duration: 1.1,
            ease: "power1.inOut",
            delay: 1.3,
          });
        }
      }
    }, heroRef);

    // Dọn dẹp animation khi component unmount.
    return () => ctx.revert();
  }, []);

  // ===========================================================================
  // 4. TYPED.JS ANIMATION
  // ===========================================================================

  useEffect(() => {
    // Không khởi tạo Typed.js nếu chưa có phần tử đích.
    if (!typedElementRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Nếu người dùng giảm chuyển động, chỉ hiển thị câu đầu tiên.
    if (prefersReducedMotion) {
      typedElementRef.current.textContent = typedStrings[0];
      return;
    }

    // Khởi tạo Typed.js với 3 câu theo ngôn ngữ hiện tại.
    const typed = new Typed(typedElementRef.current, {
      strings: typedStrings,

      // Tốc độ gõ từng ký tự, tính bằng mili giây.
      typeSpeed: 52,

      // Tốc độ xóa từng ký tự.
      backSpeed: 28,

      // Thời gian giữ câu hoàn chỉnh trước khi xóa.
      backDelay: 1600,

      // Thời gian chờ trước khi bắt đầu.
      startDelay: 180,

      // Lặp lại danh sách câu.
      loop: true,

      // Hiển thị con trỏ đánh máy.
      showCursor: true,
      cursorChar: "|",

      // Chỉ xóa phần khác biệt giữa các câu khi có thể.
      smartBackspace: true,
    });

    // Hủy instance cũ khi unmount hoặc đổi ngôn ngữ.
    return () => typed.destroy();
  }, [currentLang]);

  // ===========================================================================
  // 5. INTERACTION HANDLERS
  // ===========================================================================

  // Cuộn tới phần About hoặc gọi callback từ component cha.
  const handleScrollDown = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }

    scrollToElement("about", 80);
  };

  // Hỗ trợ phím Enter và Space cho scroll indicator.
  const handleScrollIndicatorKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleScrollDown();
    }
  };

  // Chặn copy / cut / context menu trên vùng text chính (anti-scrape nhẹ).
  const preventCopy = (e) => {
    e.preventDefault();
    return false;
  };

  // ===========================================================================
  // 6. RENDER
  // ===========================================================================

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-slate-950 text-white"
    >
      {/* BACKGROUND 1: Nebula gradient tạo chiều sâu. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-main-900/30 via-slate-950 to-black" />

      {/* Ánh sáng xanh khuếch tán. */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-main-600/10 blur-[150px] sm:h-[600px] sm:w-[600px]" />

      {/* BACKGROUND 2: Ảnh chân dung làm lớp nền cá nhân. */}
      <div
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          backgroundImage: `url("${pic5}")`,
          backgroundSize: "cover",
          backgroundPosition: "top right",
          backgroundRepeat: "no-repeat",
          opacity: 0.22,
          mixBlendMode: "luminosity",
        }}
        aria-hidden="true"
      />

      {/* BACKGROUND 4: Overlay tối để chữ dễ đọc. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent"
        aria-hidden="true"
      />

      {/* BACKGROUND 5: Starfield dạng chấm nhỏ. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:28px_28px] opacity-15"
        aria-hidden="true"
      />

      {/* Khoảng trống tránh navbar. */}
      <div className="relative z-10 h-16 w-full sm:h-20" />

      {/* HERO CONTENT: GSAP sẽ animate các phần tử con trực tiếp. */}
      {/* select-none + chặn copy để chống bôi đen / scrape nhẹ. */}
      <div
        ref={contentRef}
        className="relative z-10 my-auto flex w-full max-w-5xl select-none flex-col items-start px-5 pb-24 sm:px-8 sm:pb-28 md:px-12 lg:px-16"
        onCopy={preventCopy}
        onCut={preventCopy}
        onContextMenu={preventCopy}
      >
        {/* Vai trò nghề nghiệp. */}
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-main-400 sm:mb-5 sm:text-sm sm:tracking-[0.3em] md:text-base">
          {roleText}
        </p>

        {/* Tên chính của portfolio. */}
        <h1 className="max-w-full break-words text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]">
          {heroHeading}
        </h1>

        {/* Đường kẻ accent mỏng dưới tên. */}
        <div className="mt-6 h-px w-16 bg-main-500 sm:mt-7 sm:w-20" />

        {/* Tagline cố định + Typed.js (cho phép xuống dòng tự nhiên). */}
        <div className="mt-7 max-w-2xl sm:mt-8">
          <p className="text-sm font-light leading-relaxed text-slate-300 sm:text-base md:text-lg">
            <span>{tagline}</span>
            <span
              className="font-mono font-medium text-main-400"
              aria-label={typedStrings.join(", ")}
            >
              <span ref={typedElementRef} />
            </span>
          </p>
        </div>

        {/* Lifestyle: tách riêng để tạo nhịp đọc. */}
        <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-slate-500 sm:mt-5 sm:text-base">
          {lifestyleLine}
        </p>

        {/* Tech stack: giữ nguyên nội dung chuyên môn. */}
        <p className="mt-6 max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-slate-600 sm:mt-7 sm:text-[11px] sm:tracking-[0.2em]">
          {technicalSignature}
        </p>

        {/* ACTION BUTTONS: Khám phá dự án và mở tài liệu. */}
        {/* Không có select-auto → nút cũng dính select-none từ cha */}
        <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
          {/* CTA chính: cuộn tới phần dự án / About. */}
          <button
            type="button"
            onClick={handleScrollDown}
            className="group flex cursor-pointer items-center gap-2 rounded-xl bg-main-600 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-main-600/30 transition-all hover:bg-main-500 hover:shadow-main-500/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-6 sm:py-3 sm:text-sm"
          >
            <span>
              {currentLang === "vi" ? "KHÁM PHÁ DỰ ÁN" : "EXPLORE PROJECTS"}
            </span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </button>

          {/* CTA phụ: mở modal CV và bảng điểm. */}
          <button
            type="button"
            onClick={() => setIsDocsModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-main-500/40 bg-slate-900/80 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-main-300 shadow-[0_0_20px_rgba(24,210,110,0.12)] backdrop-blur-md transition-all hover:border-main-400 hover:bg-slate-800 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-6 sm:py-3 sm:text-sm"
          >
            {/* Icon tải tài liệu SVG inline. */}
            <svg
              className="h-4 w-4 shrink-0 text-main-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            <span>
              {currentLang === "vi"
                ? "TẢI CV & BẢNG ĐIỂM"
                : "RESUME & TRANSCRIPT"}
            </span>
          </button>
        </div>
      </div>

      {/* SCROLL INDICATOR: Hiển thị ở giữa cạnh dưới Hero. */}
      <div
        ref={scrollIndicatorRef}
        onClick={handleScrollDown}
        onKeyDown={handleScrollIndicatorKeyDown}
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 cursor-pointer p-2 text-slate-500 transition-colors hover:text-main-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-400 sm:bottom-8"
        role="button"
        tabIndex={0}
        aria-label={
          currentLang === "vi" ? "Cuộn xuống nội dung" : "Scroll to content"
        }
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em]">
            SCROLL
          </span>

          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Modal CV và bảng điểm. */}
      <DocumentsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </section>
  );
}