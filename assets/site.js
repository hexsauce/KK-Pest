/* ==========================================================================
   site.js — shared across EVERY page (index + all blog pages)
   Loaded before any page-specific script.
   ========================================================================== */

// --- Configuration -------------------------------------------------------
const WHATSAPP_NUMBER = "60163587488";

// GA4 properties that should receive events.
// 1st = KK Pest Control's own property, 2nd = client's property.
const GA_IDS = ['G-P07L6XGL5R', 'G-FW1VK1QK3N'];

// Default language the site renders in on first paint.
// This MUST match <html lang="..."> and the <title> / meta description
// language, or search engines get conflicting signals about the page.
// Change to 'my' only if you also change those.
const DEFAULT_LANG = 'en';

let currentLang = DEFAULT_LANG;


// --- Conversion tracking -------------------------------------------------
// Expected value of ONE WhatsApp lead for each service:
//     average job value  ×  % of chats that become paying jobs
// These are estimates — replace with real numbers from the business.
const LEAD_VALUES = {
    'Termite Control': 400,
    'Bed Bug Treatment': 200,
    'Bird Control': 250,
    'Rodent Control': 150,
    'Cockroach Treatment': 120,
    'General Pest Control': 120,
    'Mosquito Fogging': 100
};

// Used by the float button / hero CTA, where the service is unknown.
const DEFAULT_LEAD_VALUE = 150;

function gtag_report_conversion(leadValue) {
    const value = typeof leadValue === 'number' ? leadValue : DEFAULT_LEAD_VALUE;

    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'send_to': 'AW-18171589737/3-M9CISs-rocEOno8dhD',
            'value': value,
            'currency': 'MYR'
        });
        gtag('event', 'whatsapp_click', {
            'send_to': GA_IDS,
            'value': value,
            'currency': 'MYR'
        });
    }
}

function openWhatsApp(url, leadValue) {
    gtag_report_conversion(leadValue);
    window.open(url, '_blank');
}


// --- Mobile menu ---------------------------------------------------------
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const icon = document.getElementById('menuIcon');

    if (!nav || !icon) return;

    nav.classList.toggle('active');
    icon.textContent = nav.classList.contains('active') ? '✕' : '☰';
}

function closeMenu() {
    const nav = document.getElementById('mainNav');
    const icon = document.getElementById('menuIcon');

    if (!nav || !icon) return;

    nav.classList.remove('active');
    icon.textContent = '☰';
}


// --- Language ------------------------------------------------------------
// applyLang() RENDERS the current language. It does not flip it.
// The old code called toggleLang() on load, which silently flipped the whole
// site into Malay while <title>, meta description and <html lang> stayed
// English — so crawlers saw a Malay page declared as English.
function applyLang() {
    const btn = document.getElementById('langBtn');

    if (btn) {
        btn.textContent = currentLang.toUpperCase();
    }

    document.querySelectorAll('.t').forEach(element => {
        const translation = element.getAttribute(`data-${currentLang}`);

        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    document.querySelectorAll('option').forEach(option => {
        const translation = option.getAttribute(`data-${currentLang}`);

        if (translation) {
            option.textContent = translation;
        }
    });
}

function toggleLang() {
    currentLang = currentLang === 'en' ? 'my' : 'en';
    applyLang();
}


document.addEventListener('DOMContentLoaded', function () {
    applyLang();
});


/* ==========================================================================
   IMAGE LIGHTBOX
   Shared by service images and article images. The markup is built on demand,
   so no page needs to include the lightbox HTML itself.
   ========================================================================== */

const ZOOMABLE_SELECTOR = '#services .service-detail-image, .article-hero, .prose figure img';

function ensureLightboxMarkup() {
    let lightbox = document.getElementById('imageLightbox');

    if (lightbox) {
        return lightbox;
    }

    lightbox = document.createElement('div');
    lightbox.id = 'imageLightbox';
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML =
        '<button class="image-lightbox-close" type="button" aria-label="Close image preview">&times;</button>' +
        '<div class="image-lightbox-content">' +
        '<img id="imageLightboxImg" class="image-lightbox-img" src="" alt="">' +
        '</div>';

    lightbox.addEventListener('click', function (event) {
        handleLightboxBackdropClick(event);
    });

    lightbox.querySelector('.image-lightbox-close').addEventListener('click', function () {
        closeImageLightbox();
    });

    document.body.appendChild(lightbox);

    return lightbox;
}

function openImageLightbox(img) {
    const lightbox = ensureLightboxMarkup();
    const lightboxImg = document.getElementById('imageLightboxImg');

    if (!lightbox || !lightboxImg || !img || !img.src) {
        return;
    }

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || 'Image preview';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
}

function closeImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('imageLightboxImg');

    if (!lightbox || !lightboxImg) {
        return;
    }

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    setTimeout(function () {
        if (!lightbox.classList.contains('active')) {
            lightboxImg.src = '';
            lightboxImg.alt = '';
        }
    }, 200);
}

function handleLightboxBackdropClick(event) {
    if (event.target.id === 'imageLightbox' || event.target.classList.contains('image-lightbox-content')) {
        closeImageLightbox();
    }
}

function initImageLightbox() {
    const images = document.querySelectorAll(ZOOMABLE_SELECTOR);

    if (images.length === 0) {
        return;
    }

    ensureLightboxMarkup();

    images.forEach(function (img) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Open full screen image');

        img.addEventListener('click', function () {
            openImageLightbox(img);
        });

        img.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openImageLightbox(img);
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeImageLightbox();
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    initImageLightbox();
});
