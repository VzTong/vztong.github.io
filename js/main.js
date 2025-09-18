/**
 * Template Name: Personal
 * Updated: Sep 18 2023 with Bootstrap v5.3.2
 * Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
(function () {
  "use strict";

  /**
   * Thay đổi theme
   */
  document.querySelector(".theme-btn").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  })
  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("loaded");
      }, 1000);
      setTimeout(() => {
        preloader.remove();
      }, 2000);
    });
  }

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);

    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Modal event listeners
   */
  window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('printOptionsModal');

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePrintOptions();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closePrintOptions();
      }
    });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      if (modal.classList.contains('show')) {
        setTimeout(() => {
          // Recalculate modal position if needed
          modal.scrollTop = 0;
        }, 100);
      }
    });
  });

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * header type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    window.typedInstance = new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    "#navbar .nav-link",
    function (e) {
      let section = select(this.hash);
      if (section) {
        e.preventDefault();

        let navbar = select("#navbar");
        let header = select("#header");
        let sections = select("section", true);
        let navlinks = select("#navbar .nav-link", true);

        navlinks.forEach((item) => {
          item.classList.remove("active");
        });

        this.classList.add("active");

        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }

        if (this.hash == "#header") {
          header.classList.remove("header-top");
          sections.forEach((item) => {
            item.classList.remove("section-show");
          });
          return;
        }

        if (!header.classList.contains("header-top")) {
          header.classList.add("header-top");
          setTimeout(function () {
            sections.forEach((item) => {
              item.classList.remove("section-show");
            });
            section.classList.add("section-show");
          }, 350);
        } else {
          sections.forEach((item) => {
            item.classList.remove("section-show");
          });
          section.classList.add("section-show");
        }

        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash);

      if (initial_nav) {
        let header = select("#header");
        let navlinks = select("#navbar .nav-link", true);

        header.classList.add("header-top");

        navlinks.forEach((item) => {
          if (item.getAttribute("href") == window.location.hash) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });

        setTimeout(function () {
          initial_nav.classList.add("section-show");
        }, 350);

        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Skills animation
   */
  let skillsContent = select(".skills-content");
  var animatedText = document.getElementById("animatedText");
  if (skillsContent) {
    new Waypoint({
      // element: skillsContent,
      // offset: "80%",
      // handler: function (direction) {
      //   let progress = select(".progress .progress-bar", true);
      //   progress.forEach((el) => {
      //     el.style.width = el.getAttribute("aria-valuenow") + "%";
      //   });
      // },
      element: animatedText,
      handler: function (direction) {
        if (direction === "down") {
          animatedText.classList.add("show");
        }
      },
      offset: "80%",
    });
  }

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: ".portfolio-details-lightbox",
    width: "90%",
    height: "90vh",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

// function cho đếm vô hạn với scroll trigger
function initInfinityCounter(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const start = Number(el.dataset.start ?? 0);
  const rawEnd = (el.dataset.end ?? '').toString().trim().toLowerCase();
  const duration = Math.max(100, Number(el.dataset.duration ?? 1500)); // ms

  // Nếu data-end đặt "infty" hoặc "∞" => sẽ hiển thị vô hạn sau khi đếm
  const toInfinity = (rawEnd === 'infty' || rawEnd === '∞');

  // Giá trị hiển thị tạm thời (nếu bạn muốn nhìn thấy đếm)
  // Bạn có thể thay displayMax thành một số lớn hơn nếu muốn
  const displayMax = Number(el.dataset.displaymax ?? 520);

  // Set initial value
  el.textContent = start.toLocaleString();

  // Easing (smooth)
  function easeOutQuad(t) { return t*(2-t); }

  function animateCount(from, to, ms, onUpdate, onComplete) {
    const startTime = performance.now();
    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / ms);
      const eased = easeOutQuad(t);
      const value = Math.floor(from + (to - from) * eased);
      onUpdate(value);
      if (t < 1) requestAnimationFrame(frame);
      else onComplete && onComplete();
    }
    requestAnimationFrame(frame);
  }

  function startAnimation() {
    // Prevent multiple animations
    if (el.classList.contains('animated')) return;
    el.classList.add('animated');

    // Hành vi khi muốn vô cực: đếm từ start -> displayMax trong `duration`, sau đó chuyển sang "∞"
    if (toInfinity) {
      el.classList.add('counting');
      const endValue = Math.max(displayMax, start + 1);

      animateCount(start, endValue, duration, (v) => {
        el.textContent = v.toLocaleString(); // format có dấu phân cách hàng nghìn
      }, () => {
        // small fade then show infinity
        el.classList.add('fading');
        setTimeout(() => {
          // show infinity symbol với hiệu ứng
          el.innerHTML = '<span class="infty-symbol" title="vô cực">∞</span>';
          el.classList.remove('counting','fading');
        }, 200);
      });

      // optional: nếu muốn lặp (đếm lại rồi ∞) bỏ comment phần sau
      // setInterval(() => { /* có thể lặp lại animateCount nếu cần */ }, duration + 1500);
    } else {
      // Nếu không phải "infty", đếm tới số bình thường (dùng data-end numeric)
      const endNum = Number(el.dataset.end ?? displayMax);
      animateCount(start, endNum, duration, (v) => {
        el.textContent = v.toLocaleString();
      });
    }
  }

  // Create Intersection Observer to trigger animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
        observer.unobserve(entry.target); // Stop observing after animation starts
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start slightly before element comes into view
  });

  observer.observe(el);
}

// Initialize all infinity counters
initInfinityCounter('working-hours-infty');
initInfinityCounter('coffee-cups-infty');

})();

// CV Modal State
let selectedLanguage = '';

function closePrintOptions() {
  const modal = document.getElementById('printOptionsModal');
  modal.classList.add('hide');

  // Re-enable body scroll
  document.body.style.overflow = '';
  document.body.style.position = '';

  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('show', 'hide');
    // Reset selections
    resetCVSelections();
  }, 300);
}

function printCV() {
  const modal = document.getElementById('printOptionsModal');
  modal.style.display = 'block';

  // Prevent body scroll on mobile
  if (window.innerWidth <= 768) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // Focus trap for accessibility
  const firstButton = modal.querySelector('.cv-option-btn');
  if (firstButton) {
    firstButton.focus();
  }
}

function selectLanguage(language) {
  selectedLanguage = language;

  // Haptic feedback on mobile
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }

  // Update UI
  document.querySelectorAll('.cv-option-btn[data-lang]').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.querySelector(`[data-lang="${language}"]`).classList.add('selected');

  // Check if download button should be enabled
  updateDownloadButton();
}

function updateDownloadButton() {
  const downloadBtn = document.getElementById('downloadCVBtn');
  const previewBtn = document.getElementById('previewCVBtn');

  if (selectedLanguage) {
    // Enable both buttons
    downloadBtn.disabled = false;
    previewBtn.disabled = false;

    // Get current language from LanguageSwitcher
    const currentLang = localStorage.getItem('language') || 'us';
    const isVietnamese = currentLang === 'vn';

    // Dynamic text based on current website language
    const langText = selectedLanguage === 'us' ?
      (isVietnamese ? 'Tiếng Anh' : 'English') :
      (isVietnamese ? 'Tiếng Việt' : 'Vietnamese');

    const downloadText = isVietnamese ? 'Tải CV' : 'Download CV';
    const previewText = isVietnamese ? 'Xem trước CV' : 'Preview CV';

    downloadBtn.querySelector('.btn-text').textContent = `${downloadText} ${langText}`;
    previewBtn.querySelector('.btn-text').textContent = `${previewText} ${langText}`;
  } else {
    // Disable both buttons
    downloadBtn.disabled = true;
    previewBtn.disabled = true;

    // Reset button text based on current language
    const currentLang = localStorage.getItem('language') || 'us';
    const isVietnamese = currentLang === 'vn';

    downloadBtn.querySelector('.btn-text').textContent = isVietnamese ? 'Tải CV' : 'Download CV';
    previewBtn.querySelector('.btn-text').textContent = isVietnamese ? 'Xem trước CV' : 'Preview CV';
  }
}

function previewSelectedCV() {
  if (!selectedLanguage) {
    // Dynamic alert message based on current language
    const currentLang = localStorage.getItem('language') || 'us';
    const alertMessage = currentLang === 'vn' ? 'Vui lòng chọn ngôn ngữ' : 'Please select a language';
    alert(alertMessage);
    return;
  }

  // Show loading state
  const previewBtn = document.getElementById('previewCVBtn');
  const originalText = previewBtn.querySelector('.btn-text').textContent;

  // Dynamic loading text
  const currentLang = localStorage.getItem('language') || 'us';
  const loadingText = currentLang === 'vn' ? 'Đang mở...' : 'Opening...';

  previewBtn.querySelector('.btn-text').textContent = loadingText;
  previewBtn.disabled = true;

  let url = '';
  const langFolder = selectedLanguage === 'us' ? 'us' : 'vn';
  const langCode = selectedLanguage === 'us' ? 'US' : 'VN';

  // Fixed position for all CVs
  const position = 'Fresher';

  url = `CV/${langFolder}/CV_TongNhaVy_${position}_${langCode}.pdf`;

  // Open PDF in new tab for preview
  window.open(url, '_blank');

  // Reset button state
  setTimeout(() => {
    previewBtn.querySelector('.btn-text').textContent = originalText;
    previewBtn.disabled = false;
  }, 1000);
}

function downloadSelectedCV() {
  if (!selectedLanguage) {
    // Dynamic alert message based on current language
    const currentLang = localStorage.getItem('language') || 'us';
    const alertMessage = currentLang === 'vn' ? 'Vui lòng chọn ngôn ngữ' : 'Please select a language';
    alert(alertMessage);
    return;
  }

  // Show loading state
  const downloadBtn = document.getElementById('downloadCVBtn');
  const originalText = downloadBtn.querySelector('.btn-text').textContent;

  // Dynamic loading text
  const currentLang = localStorage.getItem('language') || 'us';
  const loadingText = currentLang === 'vn' ? 'Đang tải...' : 'Downloading...';

  downloadBtn.querySelector('.btn-text').textContent = loadingText;
  downloadBtn.disabled = true;

  // Haptic feedback on mobile
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }

  let url = '';
  const langFolder = selectedLanguage === 'us' ? 'us' : 'vn';
  const langCode = selectedLanguage === 'us' ? 'US' : 'VN';

  // Fixed position for all CVs
  const position = 'Fresher';

  url = `CV/${langFolder}/CV_TongNhaVy_${position}_${langCode}.pdf`;

  // Create a temporary anchor element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV_TongNhaVy_${position}_${langCode}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Reset button state and close modal
  setTimeout(() => {
    downloadBtn.querySelector('.btn-text').textContent = originalText;
    downloadBtn.disabled = false;
    closePrintOptions();
  }, 1500);
}function resetCVSelections() {
  selectedLanguage = '';

  // Remove all selected classes
  document.querySelectorAll('.cv-option-btn').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Reset download button
  updateDownloadButton();
}