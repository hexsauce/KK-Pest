// Configuration
const WHATSAPP_NUMBER = "60163587488";
let currentLang = "en";

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const icon = document.getElementById('menuIcon');
    nav.classList.toggle('active');
    icon.textContent = nav.classList.contains('active') ? '✕' : '☰';
}

function closeMenu() {
    const nav = document.getElementById('mainNav');
    const icon = document.getElementById('menuIcon');
    nav.classList.remove('active');
    icon.textContent = '☰';
}

// Language Toggle
function toggleLang() {
    currentLang = currentLang === "en" ? "my" : "en";
    document.getElementById("langBtn").textContent = currentLang.toUpperCase();

    // Update all translatable elements
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

    // Update select options
    document.querySelectorAll('option').forEach(option => {
        const translation = option.getAttribute(`data-${currentLang}`);
        if (translation) {
            option.textContent = translation;
        }
    });
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

    // Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize language
    toggleLang();
});
