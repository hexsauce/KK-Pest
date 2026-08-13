/* ==========================================================================
   home.js — index.html ONLY.
   Contains the single-page routing that hides/shows <section> elements.
   Must NOT load on blog pages: it would hide their content.
   ========================================================================== */

// GA4 virtual pageviews for this single-page site.
// null = initial load, which gtag's automatic page_view already covers.
let lastReportedPath = null;

function reportPageView(pageId) {
    const path = '/' + pageId;

    if (lastReportedPath === null) {
        lastReportedPath = path;   // skip: auto page_view already fired
        return;
    }

    if (path === lastReportedPath) {
        return;                    // same section, don't double count
    }

    lastReportedPath = path;

    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            'send_to': GA_IDS,
            'page_title': document.title + ' | ' + pageId,
            'page_location': window.location.origin + window.location.pathname + '#' + pageId,
            'page_path': path
        });
    }
}

// Page Navigation + browser back/forward state
function getCurrentPageId() {
    const visibleSection = document.querySelector('section:not(.hidden)');
    return visibleSection ? visibleSection.id : 'home';
}

function getPageStateFromHash() {
    const hash = window.location.hash.substring(1);

    if (!hash) {
        return { page: 'home', scrollY: 0 };
    }

    if (hash.startsWith('services/')) {
        const serviceId = hash.split('/')[1];
        return { page: 'services', serviceId: serviceId || null };
    }

    const hashElement = document.getElementById(hash);

    if (hashElement && hashElement.tagName && hashElement.tagName.toLowerCase() === 'section') {
        return { page: hash, scrollY: 0 };
    }

    if (hashElement && hashElement.closest && hashElement.closest('#services')) {
        return { page: 'services', serviceId: hash };
    }

    return { page: 'home', scrollY: 0 };
}

function setVisiblePage(pageId, options = {}) {
    const scrollY = options.scrollY;
    const scrollToTop = options.scrollToTop !== false;

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        reportPageView(pageId);
        window.requestAnimationFrame(() => {
            if (typeof scrollY === 'number') {
                window.scrollTo(0, scrollY);
            } else if (scrollToTop) {
                window.scrollTo(0, 0);
            }
        });
    }

    closeMenu();
}

function saveCurrentHistoryState() {
    const currentPage = getCurrentPageId();
    const currentHash = window.location.hash || `#${currentPage}`;
    history.replaceState({ page: currentPage, scrollY: window.scrollY }, '', currentHash);
}

function showPage(pageId, options = {}) {
    const shouldPushState = options.pushState !== false;
    const scrollY = typeof options.scrollY === 'number' ? options.scrollY : 0;

    if (shouldPushState) {
        saveCurrentHistoryState();
        history.pushState({ page: pageId, scrollY }, '', `#${pageId}`);
    }

    setVisiblePage(pageId, { scrollY });
}

function scrollToServiceTarget(serviceId, shouldHighlight = true) {
    window.setTimeout(() => {
        const target = document.getElementById(serviceId);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (shouldHighlight) {
            target.classList.add('service-scroll-highlight');

            window.setTimeout(() => {
                target.classList.remove('service-scroll-highlight');
            }, 1600);
        }
    }, 80);
}

function showService(serviceId) {
    saveCurrentHistoryState();
    setVisiblePage('services', { scrollToTop: false });

    history.pushState({ page: 'services', serviceId }, '', `#services/${serviceId}`);
    scrollToServiceTarget(serviceId, true);
}

function applyNavigationState(state) {
    const targetState = state || getPageStateFromHash();

    setVisiblePage(targetState.page || 'home', {
        scrollY: typeof targetState.scrollY === 'number' ? targetState.scrollY : undefined,
        scrollToTop: !targetState.serviceId
    });

    if (targetState.serviceId) {
        scrollToServiceTarget(targetState.serviceId, false);
    }
}

// Send WhatsApp Message
function sendWhatsApp() {
    const pestType = document.getElementById('pestType').value;
    const severity = document.getElementById('severity').value;
    const propertyType = document.getElementById('propertyType').value;
    const location = document.getElementById('location').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const details = document.getElementById('details').value;

    // Validation
    if (!location || !name || !phone) {
        alert(currentLang === "en" ? "Please fill in all required fields" : "Sila isi semua medan yang diperlukan");
        return;
    }

    // Construct message
    const message = `
🦟 *KK PEST CONTROL - Service Request*

*Pest Problem:* ${pestType}
*Severity:* ${severity}
*Property Type:* ${propertyType}
*Location:* ${location}

*Customer Details:*
Name: ${name}
Phone: ${phone}

${details ? `*Additional Details:*
${details}` : ''}

---
Please provide a quote for this service. Thank you!
    `.trim();

    // Track conversion and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    openWhatsApp(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, LEAD_VALUES[pestType]);
}



// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Handle initial URL state or show home
    const initialState = getPageStateFromHash();
    history.replaceState(initialState, '', window.location.hash || '#home');
    applyNavigationState(initialState);

    // Add smooth scroll behavior
    document.querySelectorAll('a[onclick^="showPage"]').forEach(link => {
        link.style.cursor = 'pointer';
    });
});
