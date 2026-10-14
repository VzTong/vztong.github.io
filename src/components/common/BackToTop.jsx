import { useEffect, useState } from "react";

/**
 * BackToTop
 *
 * SUMMARY:
 * - Hiển thị nút quay về đầu trang khi người dùng cuộn xuống quá 280px.
 * - Hiển thị vòng tròn progress biểu thị tỷ lệ scroll của trang.
 * - Sử dụng animation tối giản: fade, slide và icon dịch chuyển nhẹ.
 * - Không scale khi hover/click, giữ kích thước nút ổn định.
 * - Hỗ trợ keyboard focus và prefers-reduced-motion.
 *
 * DESIGN DIRECTION:
 * - Dark editorial / precision UI.
 * - Nền charcoal, border mờ, accent lavender.
 * - Không dùng glow mạnh hoặc animation trang trí liên tục.
 */
export default function BackToTop() {
  // ============================================================
  // STATE
  // ============================================================

  // Quyết định nút có xuất hiện trên màn hình hay không.
  const [visible, setVisible] = useState(false);

  // Tiến trình scroll trong khoảng 0 → 1.
  // 0 = đang ở đầu trang.
  // 1 = đã cuộn đến cuối trang.
  const [progress, setProgress] = useState(0);

  // ============================================================
  // SCROLL TRACKING
  // ============================================================

  useEffect(() => {
    // Dùng để giới hạn mỗi thời điểm chỉ có một callback
    // requestAnimationFrame đang chờ thực thi.
    let ticking = false;

    const updateScroll = () => {
      // Bỏ qua các sự kiện scroll trùng trong cùng một frame.
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        // Tổng chiều cao có thể cuộn của document.
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;

        // Khoảng cách đã cuộn từ đầu trang.
        const current = window.scrollY;

        // Chỉ hiển thị nút sau khi cuộn quá 280px.
        const nextVisible = current > 280;

        // Tính tỷ lệ scroll, giới hạn trong khoảng 0 → 1.
        const nextProgress =
          scrollable > 0 ? Math.min(Math.max(current / scrollable, 0), 1) : 0;

        // Chỉ cập nhật state khi giá trị thực sự thay đổi.
        setVisible((previous) =>
          previous === nextVisible ? previous : nextVisible,
        );

        setProgress((previous) =>
          previous === nextProgress ? previous : nextProgress,
        );

        // Cho phép xử lý frame tiếp theo.
        ticking = false;
      });
    };

    // Đồng bộ trạng thái ngay khi component được mount.
    updateScroll();

    // passive: true giúp trình duyệt không phải chờ handler
    // quyết định có preventDefault hay không.
    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    // Cleanup listener khi component bị unmount.
    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  // ============================================================
  // ACTION
  // ============================================================

  /**
   * Cuộn mượt về đầu trang.
   *
   * Lưu ý:
   * - behavior: "smooth" sử dụng cơ chế smooth scroll của trình duyệt.
   * - Nếu CSS toàn trang đặt scroll-behavior: smooth thì có thể
   *   bỏ thuộc tính này khỏi CSS để tránh cấu hình chồng chéo.
   */
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // PROGRESS RING
  // ============================================================

  // Bán kính của vòng tròn SVG.
  const radius = 21;

  // Chu vi đường tròn: 2πr.
  // SVG dùng chu vi này để tính độ dài nét vẽ.
  const circumference = 2 * Math.PI * radius;

  // Khi progress = 0, offset = circumference:
  // gần như toàn bộ đường progress bị ẩn.
  //
  // Khi progress = 1, offset = 0:
  // toàn bộ vòng progress được hiển thị.
  const offset = circumference * (1 - progress);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`
      group fixed z-[9998]
      bottom-[5.5rem] right-5
      w-12 h-12
      flex items-center justify-center
      rounded-full

      /* Brand: Obsidian */
      bg-brand-card-dark
      text-brand-text-dark
      border border-brand-border-dark

      /* Controlled motion: no scaling */
      transition-[opacity,translate,background-color,border-color,box-shadow]
      duration-300
      ease-[cubic-bezier(0.22,1,0.36,1)]
      motion-reduce:transition-none

      /* Hover: restrained green surface */
      hover:bg-sub-700
      hover:border-main-600
      hover:-translate-y-[3px]

      /* Subtle depth, not a permanent neon glow */
      hover:shadow-[0_4px_20px_rgba(24,210,110,0.08)]

      active:translate-y-0

      /* Keyboard accessibility */
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-main-500
      focus-visible:ring-offset-2
      focus-visible:ring-offset-brand-bg-dark

      ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }
    `}
    >
      {/* Scroll progress ring */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        {/* Neutral track */}
        <circle
          cx="24"
          cy="24"
          r="21"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        {/* Brand green progress */}
        <circle
          cx="24"
          cy="24"
          r="21"
          stroke="#18D26E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 24 24)"
          className="
          transition-[stroke-dashoffset]
          duration-150 ease-linear
          motion-reduce:transition-none
        "
        />
      </svg>

      {/* Arrow icon */}
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="
        relative z-10
        transition-transform duration-300 ease-out
        group-hover:-translate-y-0.5
        motion-reduce:transition-none
      "
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
