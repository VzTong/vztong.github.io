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
    new Typed(".typed", {
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
})();

// CV Modal State
let selectedLanguage = '';
let selectedCVType = '';

function closePrintOptions() {
  const modal = document.getElementById('printOptionsModal');
  modal.classList.add('hide');
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
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function selectLanguage(language) {
  selectedLanguage = language;

  // Update UI
  document.querySelectorAll('.cv-option-btn[data-lang]').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.querySelector(`[data-lang="${language}"]`).classList.add('selected');

  // Check if download button should be enabled
  updateDownloadButton();
}

function selectCVType(cvType) {
  selectedCVType = cvType;

  // Update UI
  document.querySelectorAll('.cv-option-btn[data-type]').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.querySelector(`[data-type="${cvType}"]`).classList.add('selected');

  // Check if download button should be enabled
  updateDownloadButton();
}

function updateDownloadButton() {
  const downloadBtn = document.getElementById('downloadCVBtn');
  const previewBtn = document.getElementById('previewCVBtn');

  if (selectedLanguage && selectedCVType) {
    // Enable both buttons
    downloadBtn.disabled = false;
    previewBtn.disabled = false;

    // Update button text
    const cvTypeText = selectedCVType.charAt(0).toUpperCase() + selectedCVType.slice(1);
    downloadBtn.querySelector('.btn-text').textContent = `Download ${cvTypeText} CV`;
    previewBtn.querySelector('.btn-text').textContent = `Preview ${cvTypeText} CV`;
  } else {
    // Disable both buttons
    downloadBtn.disabled = true;
    previewBtn.disabled = true;

    // Reset button text
    downloadBtn.querySelector('.btn-text').textContent = 'Download CV';
    previewBtn.querySelector('.btn-text').textContent = 'Preview CV';
  }
}

function previewSelectedCV() {
  if (!selectedLanguage || !selectedCVType) {
    alert('Please select both language and CV type');
    return;
  }

  let url = '';
  const langFolder = selectedLanguage === 'en' ? 'en' : 'vi';
  const cvType = selectedCVType.charAt(0).toUpperCase() + selectedCVType.slice(1);
  const langCode = selectedLanguage === 'en' ? 'EN' : 'VI';

  url = `CV/${langFolder}/CV_TongNhaVy_${cvType}_${langCode}.pdf`;

  // Open PDF in new tab for preview
  window.open(url, '_blank');
}

function downloadSelectedCV() {
  if (!selectedLanguage || !selectedCVType) {
    alert('Please select both language and CV type');
    return;
  }

  let url = '';
  const langFolder = selectedLanguage === 'en' ? 'en' : 'vi';
  const cvType = selectedCVType.charAt(0).toUpperCase() + selectedCVType.slice(1);
  const langCode = selectedLanguage === 'en' ? 'EN' : 'VI';

  url = `CV/${langFolder}/CV_TongNhaVy_${cvType}_${langCode}.pdf`;

  // Create a temporary anchor element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV_TongNhaVy_${cvType}_${langCode}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Close the modal
  closePrintOptions();
}

function resetCVSelections() {
  selectedLanguage = '';
  selectedCVType = '';

  // Remove all selected classes
  document.querySelectorAll('.cv-option-btn').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Reset download button
  updateDownloadButton();
}

function printCVWithLanguage(language) {
  let url = '';
  if (language === 'en') {
    url = 'CV_TongNhaVy_FresherBackend_EN.pdf';
  } else if (language === 'vi') {
    url = 'CV_TongNhaVy_FresherBackend_VI.pdf';
  }

  // Open a new window for printing
  var printWindow = window.open(url, '_blank');

  // Close the document after printing
  printWindow.document.close();

  // Print the window
  printWindow.print();

  // Close the modal
  closePrintOptions();
}