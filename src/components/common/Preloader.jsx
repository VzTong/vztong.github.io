/**
 * ============================================================================
 * Preloader — Cinematic Portfolio Entrance
 * ============================================================================
 *
 * DESIGN
 * ------
 * Dark canvas, emerald light beam, split-panel reveal.
 *
 * LIFECYCLE
 * ---------
 * 1. Chờ window load.
 * 2. Giữ màn hình chờ trong thời gian tối thiểu.
 * 3. Kích hoạt class "loaded" để chạy animation kết thúc.
 * 4. Unmount sau khi hiệu ứng reveal hoàn tất.
 *
 * ACCESSIBILITY
 * --------------
 * Tôn trọng prefers-reduced-motion trong CSS.
 *
 * ============================================================================
 */

import { useEffect, useState } from "react";

import "../../assets/preloader.css";

/** Thời gian chờ trước khi bắt đầu reveal (ms) */
const SHOW_MS = 1000;

/** Thời gian dành cho hiệu ứng reveal (ms) */
const EXIT_MS = 850;

export default function Preloader() {
  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------

  /** Kích hoạt hiệu ứng kết thúc */
  const [loaded, setLoaded] = useState(false);

  /** Gỡ Preloader khỏi DOM */
  const [hide, setHide] = useState(false);

  // --------------------------------------------------------------------------
  // LIFECYCLE
  // --------------------------------------------------------------------------

  useEffect(() => {
    let showTimer;
    let hideTimer;
    let cancelled = false;

    /**
     * Bắt đầu chu trình kết thúc sau khi tài nguyên trang đã tải xong.
     */
    const finishLoading = () => {
      showTimer = window.setTimeout(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      }, SHOW_MS);

      hideTimer = window.setTimeout(() => {
        if (!cancelled) {
          setHide(true);
        }
      }, SHOW_MS + EXIT_MS);
    };

    // Không bỏ lỡ sự kiện load nếu trang đã tải xong trước khi mount.
    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    // Dọn listener và timer khi component unmount.
    return () => {
      cancelled = true;

      window.removeEventListener("load", finishLoading);

      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  if (hide) return null;

  return (
    <div
      id="preloader"
      className={loaded ? "loaded" : ""}
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
    >
      <div className="line" aria-hidden="true" />

      <div className="preloader-logo" aria-hidden="true">
        <div className="preloader-logo-half preloader-logo-left">
          <img src="https://vytong.pages.dev/favicon.png" alt="" />
        </div>

        <div className="preloader-logo-half preloader-logo-right">
          <img src="https://vytong.pages.dev/favicon.png" alt="" />
        </div>
      </div>
    </div>
  );
}
