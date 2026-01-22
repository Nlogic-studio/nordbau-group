// import './style.css'; // Moved to index.html to prevent FOUC
import { translations } from './translations.js';
import $ from 'jquery';

const getLanguage = () => {
    const path = window.location.pathname;
    return path.startsWith('/en') ? 'en' : 'de';
};

const currentLang = getLanguage();

// Contact Form Logic
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Loading state
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        // Simulate sending
        setTimeout(() => {
            contactForm.classList.add('hidden');
            document.getElementById('contact-success').classList.remove('hidden');
        }, 1500);
    });
}

const resolveTranslation = (key, translations) => {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations);
};

const updateContent = (lang) => {
    const t = translations[lang];

    // Generic handler for all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = resolveTranslation(key, t);
        if (translation) {
            // Handle placeholders for inputs if needed, otherwise text
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // For inputs, we prefer direct value assignment or placeholders if we had them
                // But strictly speaking, our stricture uses labels.
            } else {
                element.innerHTML = translation;
            }
        }
    });

    // Special handling for dynamic/complex HTML updates if strictly necessary
    // (Services grid is now static HTML with i18n tags, so no JS generation needed!)

    // Contact Form Success Message (if hidden/shown dynamically needs refresh? handled by generic above)
};

$(document).ready(() => {
    AOS.init();

    // Initialize Splide Carousel
    new Splide('#project-carousel', {
        type: 'loop',
        perPage: 3,
        gap: '2rem',
        autoplay: false,
        arrows: true,
        pagination: true,
        breakpoints: {
            1024: {
                perPage: 2,
            },
            768: {
                perPage: 1,
            },
        },
    }).mount();

    // Smooth Scrolling for Anchor Links (Navigation, Hero, Footer)
    $('.scroll-to').on('click', function (e) {
        // Prevent default anchor click behavior
        e.preventDefault();

        // Get target from data-scrollto attribute
        var targetId = $(this).data('scrollto');
        var targetSection = $('#' + targetId);

        // Ensure target exists
        if (targetSection.length) {
            // Mobile Menu handling: Close if open
            if (!$('#mobile-menu').hasClass('hidden')) {
                $('#mobile-menu').addClass('hidden');
            }

            // Using jQuery's animate() method to add smooth page scroll
            $('html, body').animate({
                scrollTop: targetSection.offset().top - 80 // Adjust for fixed header height
            }, 800);
        }
    });

    // Project Card Details Toggle
    $(document).on('click', '.project-card', function () {
        // Remove active class from all other cards
        $('.project-card').not(this).removeClass('details-active');
        // Toggle on clicked card
        $(this).toggleClass('details-active');
    });

    $(document).on('click', '.hide-details-btn', function (e) {
        e.stopPropagation(); // Prevent triggering the card click
        $(this).closest('.project-card').removeClass('details-active');
    });

    // Initialize Testimonial Carousel
    new Splide('#testimonial-carousel', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 3000,
        arrows: false,
        pagination: true,
    }).mount();

    updateContent(currentLang);

    $('#lang-toggle').on('click', (e) => {
        e.preventDefault();
        const newLang = currentLang === 'de' ? 'en' : 'de';
        if (newLang === 'en') {
            window.location.href = '/en';
        } else {
            window.location.href = '/';
        }
    });

    // Navbar Transition
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("bg-primary/95", "shadow-lg", "backdrop-blur-md");
            navbar.classList.remove("bg-transparent", "py-4", "backdrop-blur-sm");
            navbar.classList.add("py-2");
        } else {
            navbar.classList.remove("bg-primary/95", "shadow-lg", "backdrop-blur-md");
            navbar.classList.add("bg-transparent", "py-4", "backdrop-blur-sm");
            navbar.classList.remove("py-2");
        }
    });

    // Mobile Menu Toggle
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");

    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });

    // News/Article Modal Logic
    const modal = document.getElementById('article-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');

    const openModal = (index) => {
        const t = translations[currentLang];
        // Ensure news items exist
        if (t.news && t.news.items && t.news.items[index]) {
            const item = t.news.items[index];
            modalTitle.textContent = item.title;
            modalDate.textContent = item.date;
            // Use full_content from translations, fallback to desc if missing (safety check)
            modalContent.innerHTML = item.full_content || item.desc;

            // Update close button text
            if (t.news.close_modal) {
                closeModalBtn.textContent = t.news.close_modal;
            }

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Prevent background scrolling
        }
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };

    // Event Delegation for dynamically added buttons (though currently static)
    document.addEventListener('click', (e) => {
        // Check if clicked element is or is inside .read-more-btn
        const btn = e.target.closest('.read-more-btn');
        if (btn) {
            e.preventDefault();
            const index = btn.getAttribute('data-index');
            openModal(index);
        }
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    // Close on Escape header
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
