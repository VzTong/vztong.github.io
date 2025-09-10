// Multi-language functionality with single flag
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'us';
        this.translations = {};
        this.flags = {
            us: 'https://flagcdn.com/w20/us.png',
            vn: 'https://flagcdn.com/w20/vn.png'
        };
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.initializeSingleFlag();
        this.applyLanguage(this.currentLanguage);
        this.bindEvents();
    }

    async loadTranslations() {
        try {
            // Check if we're on a portfolio detail page
            const isPortfolioDetail = window.location.pathname.includes('portfolio-detail');
            const jsonPath = isPortfolioDetail ? '../js/languages.json' : 'js/languages.json';

            const response = await fetch(jsonPath);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    initializeSingleFlag() {
        const currentFlag = document.getElementById('currentFlag');
        if (currentFlag) {
            // Check if we need to adjust path for portfolio detail pages
            const isPortfolioDetail = window.location.pathname.includes('portfolio-detail');

            if (isPortfolioDetail) {
                // For portfolio detail pages, use relative path to flag images
                this.flags = {
                    us: 'https://flagcdn.com/w20/us.png',
                    vn: 'https://flagcdn.com/w20/vn.png'
                };
            }

            currentFlag.src = this.flags[this.currentLanguage];
            currentFlag.alt = this.currentLanguage.toUpperCase();
        } else {
            console.error('currentFlag element not found!');
        }
    }

    bindEvents() {
        const langToggle = document.querySelector('.lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.switchLanguage();
            });
        } else {
            console.error('Language toggle element not found!');
        }
    }

    switchLanguage() {
        const newLanguage = this.currentLanguage === 'us' ? 'vn' : 'us';

        // Add switching animation
        const langToggle = document.querySelector('.lang-toggle');
        langToggle.classList.add('switching');

        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }

        setTimeout(() => {
            this.currentLanguage = newLanguage;
            localStorage.setItem('language', newLanguage);

            // Update flag
            const currentFlag = document.getElementById('currentFlag');
            currentFlag.src = this.flags[newLanguage];
            currentFlag.alt = newLanguage.toUpperCase();

            // Apply translations
            this.applyLanguage(newLanguage);

            // Remove animation class
            langToggle.classList.remove('switching');
        }, 300);
    }

    applyLanguage(lang) {
        const t = this.translations[lang];

        if (!t) {
            console.error('No translations found for language:', lang);
            return;
        }

        // Update navigation
        this.updateNavigation(t.nav);

        // Update hero section
        this.updateHeroSection(t.hero);

        // Update about section
        this.updateAboutSection(t.about);

        // Update resume section
        this.updateResumeSection(t.resume);

        // Update portfolio section
        this.updatePortfolioSection(t.portfolio);

        // Update contact section
        this.updateContactSection(t.contact);

        // Update buttons
        this.updateButtons(t.buttons);

        // Update CV Modal
        this.updateCVModal(t.cvModal);

        // Update portfolio details if on portfolio detail page
        this.updatePortfolioDetails();
    }

    updateNavigation(nav) {
        const navLinks = document.querySelectorAll('#navbar .nav-link');
        const navTexts = ['home', 'about', 'resume', 'portfolio', 'contact'];

        navLinks.forEach((link, index) => {
            if (nav[navTexts[index]]) {
                link.textContent = nav[navTexts[index]];
            }
        });
    }

    updateHeroSection(hero) {
        // Update title
        const title = document.querySelector('#header h1 a');
        if (title && hero.title) {
            title.textContent = hero.title;
        }

        // Update typed text (cần restart typed.js)
        if (hero.subtitle) {
            this.updateTypedText(hero.subtitle);
        }
    }

    updateTypedText(subtitle) {
        const typedElement = document.querySelector('.typed');
        if (typedElement && window.Typed) {
            try {
                // Update the data attribute
                typedElement.setAttribute('data-typed-items', subtitle);

                // Destroy existing instance if exists
                if (window.typedInstance) {
                    window.typedInstance.destroy();
                }

                // Clear existing content
                typedElement.innerHTML = '';

                // Create new instance with translated text
                window.typedInstance = new Typed('.typed', {
                    strings: subtitle.split(', '),
                    loop: true,
                    typeSpeed: 100,
                    backSpeed: 50,
                    backDelay: 2000,
                });
            } catch (error) {
                console.error('Error updating typed text:', error);
                // Fallback: just update the text content
                typedElement.textContent = subtitle.split(', ')[0];
            }
        } else {
            // Fallback if Typed.js not available
            if (typedElement) {
                typedElement.textContent = subtitle.split(', ')[0];
            }
        }
    }

    updateAboutSection(about) {
        // Update section titles
        const aboutSpan = document.querySelector('#about .section-title span');
        const aboutTitle = document.querySelector('#about .section-title h2');
        const aboutSubtitle = document.querySelector('#about .section-title p');

        if (aboutSpan) aboutSpan.textContent = about.title;
        if (aboutTitle) aboutTitle.textContent = about.title;
        if (aboutSubtitle) aboutSubtitle.textContent = about.subtitle;

        // Update main description (h3)
        const description = document.querySelector('#about .content h3');
        if (description && about.description) {
            description.textContent = about.description;
        }

        // Update slogan in avatar
        const slogan = document.querySelector('.slogan i');
        if (slogan && about.slogan) {
            slogan.textContent = `"${about.slogan}"`;
        }

        // Update the main paragraph - split into two parts
        const mainParagraphs = document.querySelectorAll('#about .content p');
        if (mainParagraphs.length >= 1 && about.trying) {
            // First paragraph
            const firstP = mainParagraphs[0];
            if (firstP && !firstP.querySelector('.btn-cv')) {
                firstP.textContent = about.trying;
            }
        }

        if (mainParagraphs.length >= 2 && about.travel) {
            // Second paragraph (with <br> tags)
            const secondP = mainParagraphs[1];
            if (secondP) {
                secondP.innerHTML = about.travel;
            }
        }

        // Update personal info labels and values
        if (about.personalInfo) {
            // Update all personal info labels
            const personalLabels = document.querySelectorAll('#about ul li strong');
            personalLabels.forEach(label => {
                const text = label.textContent.toLowerCase();
                if (text.includes('birthday') || text.includes('sinh nhật')) {
                    label.textContent = about.personalInfo.birthday;
                } else if (text.includes('website')) {
                    label.textContent = about.personalInfo.website;
                } else if (text.includes('phone') || text.includes('số điện thoại')) {
                    label.textContent = about.personalInfo.phone;
                } else if (text.includes('address') || text.includes('địa chỉ')) {
                    label.textContent = about.personalInfo.address;
                } else if (text.includes('age') || text.includes('tuổi')) {
                    label.textContent = about.personalInfo.age;
                } else if (text.includes('degree') || text.includes('bằng cấp')) {
                    label.textContent = about.personalInfo.degree;
                } else if (text.includes('email')) {
                    label.textContent = about.personalInfo.email;
                } else if (text.includes('freelance') || text.includes('status') || text.includes('hiện tại')) {
                    label.textContent = about.personalInfo.freelance;
                }
            });

            // Update specific values
            const birthdayValue = document.getElementById('birthday-value');
            if (birthdayValue && about.personalInfo.birthdayValue) {
                birthdayValue.textContent = about.personalInfo.birthdayValue;
            }

            const addressValue = document.getElementById('address-value');
            if (addressValue && about.personalInfo.addressValue) {
                const flag = addressValue.querySelector('img');
                addressValue.innerHTML = about.personalInfo.addressValue;
                if (flag) {
                    addressValue.appendChild(document.createTextNode('\n                    '));
                    addressValue.appendChild(flag);
                }
            }

            const freelanceValue = document.getElementById('freelance-value');
            if (freelanceValue && about.personalInfo.freelanceValue) {
                freelanceValue.textContent = about.personalInfo.freelanceValue;
            }

            const degreeValue = document.getElementById('degree-value');
            if (degreeValue && about.personalInfo.degreeValue) {
                degreeValue.textContent = about.personalInfo.degreeValue;
            }
        }
    }

    updateResumeSection(resume) {
        const resumeSpan = document.querySelector('#resume .section-title span');
        const resumeTitle = document.querySelector('#resume .section-title h2');
        const resumeSubtitle = document.querySelector('#resume .section-title p');

        if (resumeSpan) resumeSpan.textContent = resume.title;
        if (resumeTitle) resumeTitle.textContent = resume.title;
        if (resumeSubtitle) resumeSubtitle.textContent = resume.subtitle;

        // Update resume section titles
        const resumeTitles = document.querySelectorAll('.resume-title');
        resumeTitles.forEach(title => {
            const text = title.textContent.toLowerCase();
            if (text.includes('summary') || text.includes('tóm tắt')) {
                title.textContent = resume.summary;
            } else if (text.includes('education') || text.includes('học vấn')) {
                title.textContent = resume.education;
            } else if (text.includes('work') || text.includes('experience') || text.includes('kinh nghiệm')) {
                title.textContent = resume.experience;
            } else if (text.includes('open to work') || text.includes('sẵn sàng')) {
                title.textContent = resume.openToWork;
            }
        });

        // Update summary text
        const summaryText = document.querySelector('.resume-item p em');
        if (summaryText && resume.summaryText) {
            summaryText.textContent = resume.summaryText;
        }

        // Update education description
        const educationDesc = document.querySelectorAll('.resume-item p');
        educationDesc.forEach(p => {
            const text = p.textContent.toLowerCase();
            if (text.includes('information technology') || text.includes('công nghệ thông tin')) {
                p.textContent = resume.educationText;
            }
        });

        // Update company name
        const companyName = document.querySelector('.resume-item em');
        if (companyName && resume.company && companyName.textContent.includes('365')) {
            companyName.textContent = resume.company;
        }

        // Update job description
        const jobDesc = document.querySelectorAll('.resume-item p');
        jobDesc.forEach(p => {
            const text = p.textContent.toLowerCase();
            if (text.includes('internship') || text.includes('thực tập')) {
                p.textContent = resume.jobDescription;
            }
        });

        // Update achievements list
        const achievementsList = document.querySelector('.resume-item ul');
        if (achievementsList && resume.achievements) {
            achievementsList.innerHTML = '';
            resume.achievements.forEach(achievement => {
                const li = document.createElement('li');
                li.textContent = achievement;
                achievementsList.appendChild(li);
            });
        }

        // Update "Open to Work" content
        const openToWorkList = document.querySelectorAll('.resume-item ul');
        if (openToWorkList.length > 1 && resume.openToWorkText) {
            const lastList = openToWorkList[openToWorkList.length - 1];
            lastList.innerHTML = '';
            resume.openToWorkText.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                lastList.appendChild(li);
            });
        }
    }

    updatePortfolioSection(portfolio) {
        const portfolioSpan = document.querySelector('#portfolio .section-title span');
        const portfolioTitle = document.querySelector('#portfolio .section-title h2');
        const portfolioSubtitle = document.querySelector('#portfolio .section-title p');

        if (portfolioSpan) portfolioSpan.textContent = portfolio.title;
        if (portfolioTitle) portfolioTitle.textContent = portfolio.title;
        if (portfolioSubtitle) portfolioSubtitle.textContent = portfolio.subtitle;

        // Update filter buttons
        const filters = document.querySelectorAll('#portfolio-flters li');
        filters.forEach(filter => {
            const filterAttr = filter.getAttribute('data-filter');
            if (filterAttr === '*') {
                filter.textContent = portfolio.all;
            } else if (filterAttr === '.filter-web') {
                filter.textContent = portfolio.web;
            } else if (filterAttr === '.filter-game') {
                filter.textContent = portfolio.game;
            }
        });

        // Update portfolio item titles
        const portfolioTitles = document.querySelectorAll('.portfolio-info h4');
        portfolioTitles.forEach(title => {
            const text = title.textContent.toLowerCase();
            if (text.includes('booking') || text.includes('đặt phòng')) {
                title.textContent = portfolio.bookingTitle;
            }
        });
    }

    // Method for updating portfolio detail pages
    updatePortfolioDetails() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getNestedTranslation(key);

            if (translation) {
                if (element.tagName.toLowerCase() === 'ul' && key.includes('contributionList')) {
                    // Handle contribution lists specially
                    if (Array.isArray(translation)) {
                        element.innerHTML = translation.map(item => `<li>${item}</li>`).join('');
                    }
                } else if (key.includes('moreInfo') && translation.includes('<br/>')) {
                    // Handle HTML content with line breaks
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    // Helper method to get nested translations
    getNestedTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return null;
            }
        }

        return translation;
    }

    updateContactSection(contact) {
        const contactSpan = document.querySelector('#contact .section-title span');
        const contactTitle = document.querySelector('#contact .section-title h2');
        const contactSubtitle = document.querySelector('#contact .section-title p');

        if (contactSpan) contactSpan.textContent = contact.title;
        if (contactTitle) contactTitle.textContent = contact.title;
        if (contactSubtitle) contactSubtitle.textContent = contact.subtitle;

        // Update info box titles
        const infoBoxes = document.querySelectorAll('.info-box h3');
        infoBoxes.forEach(box => {
            const text = box.textContent.toLowerCase();
            if (text.includes('address') || text.includes('địa chỉ')) {
                box.textContent = contact.address;
            } else if (text.includes('social') || text.includes('mạng xã hội')) {
                box.textContent = contact.social;
            } else if (text.includes('email')) {
                box.textContent = contact.email;
            } else if (text.includes('call') || text.includes('gọi')) {
                box.textContent = contact.call;
            }
        });
    }

    updateButtons(buttons) {
        // Update download CV button
        const downloadBtn = document.querySelector('.btn-cv .btn-text');
        if (downloadBtn && buttons.downloadCV) {
            downloadBtn.textContent = buttons.downloadCV;
        }

        // Update back to top button (nếu có text)
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn && buttons.backToTop) {
            backToTopBtn.setAttribute('title', buttons.backToTop);
        }
    }

    updateCVModal(cvModal) {
        if (!cvModal) return;

        // Update modal title
        const modalTitle = document.querySelector('#printOptionsModal h2');
        if (modalTitle) modalTitle.textContent = cvModal.title;

        // Update language section title
        const languageTitle = document.querySelector('.cv-option-group h3');
        if (languageTitle) languageTitle.textContent = cvModal.language;

        // Update language option buttons
        const englishOption = document.querySelector('.cv-option-btn[data-lang="us"] span');
        if (englishOption) englishOption.textContent = cvModal.englishOption;

        const vietnameseOption = document.querySelector('.cv-option-btn[data-lang="vn"] span');
        if (vietnameseOption) vietnameseOption.textContent = cvModal.vietnameseOption;

        // Update action buttons
        const previewBtn = document.querySelector('#previewCVBtn .btn-text');
        if (previewBtn) previewBtn.textContent = cvModal.previewCV;

        const downloadBtn = document.querySelector('#downloadCVBtn .btn-text');
        if (downloadBtn) downloadBtn.textContent = cvModal.downloadCV;
    }
}

// Global fallback function for manual testing
window.manualLanguageSwitch = function() {
    const currentFlag = document.getElementById('currentFlag');
    if (currentFlag) {
        const isUS = currentFlag.src.includes('us.png');
        const newLang = isUS ? 'vn' : 'us';
        currentFlag.src = `https://flagcdn.com/w20/${newLang}.png`;
        currentFlag.alt = newLang.toUpperCase();
        localStorage.setItem('language', newLang);
        console.log('Language switched to:', newLang);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for all elements to be fully rendered
    setTimeout(() => {
        try {
            new LanguageSwitcher();
        } catch (error) {
            console.error('Error creating LanguageSwitcher:', error);
            // Fallback initialization
            initSimpleLanguageSwitcher();
        }
    }, 500);
});

// Simple fallback language switcher
function initSimpleLanguageSwitcher() {
    const langToggle = document.querySelector('.lang-toggle');
    const currentFlag = document.getElementById('currentFlag');

    if (!langToggle || !currentFlag) return;

    // Get current language from localStorage or default to 'us'
    let currentLang = localStorage.getItem('language') || 'us';

    // Set initial flag
    currentFlag.src = currentLang === 'us' ? 'https://flagcdn.com/w20/us.png' : 'https://flagcdn.com/w20/vn.png';
    currentFlag.alt = currentLang.toUpperCase();

    // Add click event
    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'us' ? 'vn' : 'us';
        currentFlag.src = currentLang === 'us' ? 'https://flagcdn.com/w20/us.png' : 'https://flagcdn.com/w20/vn.png';
        currentFlag.alt = currentLang.toUpperCase();
        localStorage.setItem('language', currentLang);

        // Try to apply translations if available
        try {
            const switcher = new LanguageSwitcher();
            switcher.currentLanguage = currentLang;
            switcher.loadTranslations().then(() => {
                switcher.applyLanguage(currentLang);
            });
        } catch (error) {
            console.warn('Advanced language switching not available:', error);
        }
    });
}