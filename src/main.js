// import './style.css'; // Moved to index.html to prevent FOUC
import { translations } from './translations.js';
import $ from 'jquery';

const getLanguage = () => {
    const path = window.location.pathname;
    return path.startsWith('/en') ? 'en' : 'de';
};

const currentLang = getLanguage();

const updateContent = (lang) => {
    const t = translations[lang];

    // Navigation
    $('[data-i18n="nav.home"]').text(t.nav.home);
    $('[data-i18n="nav.services"]').text(t.nav.services);
    $('[data-i18n="nav.about"]').text(t.nav.about);
    $('[data-i18n="nav.contact"]').text(t.nav.contact);
    $('[data-i18n="nav.lang_toggle"]').text(t.nav.lang_toggle);

    // Hero
    $('[data-i18n="hero.title"]').text(t.hero.title);
    $('[data-i18n="hero.subtitle"]').text(t.hero.subtitle);
    $('[data-i18n="hero.cta"]').text(t.hero.cta);

    // Services
    $('[data-i18n="services.title"]').text(t.services.title);
    const servicesHtml = t.services.items.map(item => `
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-xl font-bold mb-2 text-nord-blue">${item.title}</h3>
            <p class="text-gray-600">${item.desc}</p>
        </div>
    `).join('');
    $('#services-grid').html(servicesHtml);

    // About
    $('[data-i18n="about.title"]').text(t.about.title);
    $('[data-i18n="about.desc"]').text(t.about.desc);

    // Contact
    $('[data-i18n="contact.title"]').text(t.contact.title);
    $('[data-i18n="contact.desc"]').text(t.contact.desc);
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
        type: 'slide',
        autoplay: true,
        interval: 5000,
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
            navbar.classList.add("bg-primary", "shadow-lg");
            navbar.classList.remove("bg-transparent", "py-4");
            navbar.classList.add("py-2");
        } else {
            navbar.classList.remove("bg-primary", "shadow-lg");
            navbar.classList.add("bg-transparent", "py-4");
            navbar.classList.remove("py-2");
        }
    });

    // Mobile Menu Toggle
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");

    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });
});
