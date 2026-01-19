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

    // Also bind mobile toggle
    $('#lang-toggle-mobile').on('click', (e) => {
        e.preventDefault();
        const newLang = currentLang === 'de' ? 'en' : 'de';
        if (newLang === 'en') {
            window.location.href = '/en';
        } else {
            window.location.href = '/';
        }
    });

    // Mobile Menu Toggle
    $('#mobile-menu-btn').on('click', () => {
        $('#mobile-menu').toggleClass('hidden');
    });
});
