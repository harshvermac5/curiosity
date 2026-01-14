// ---------- Color Helpers ----------
function getRandomDarkHexColor() {
    const r = Math.floor(Math.random() * 128);
    const g = Math.floor(Math.random() * 128);
    const b = Math.floor(Math.random() * 128);
    return (
        '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0')
    );
}

function getRandomLightHexColor() {
    const r = Math.floor(128 + Math.random() * 128);
    const g = Math.floor(128 + Math.random() * 128);
    const b = Math.floor(128 + Math.random() * 128);
    return (
        '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0')
    );
}

// ---------- Contrast Calculation (WCAG) ----------
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function luminance({ r, g, b }) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(hex1, hex2) {
    const l1 = luminance(hexToRgb(hex1));
    const l2 = luminance(hexToRgb(hex2));
    const bright = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    return (bright + 0.05) / (dark + 0.05);
}

// ---------- Cookies ----------
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
}

// ---------- Gradient Generator ----------
function generateRandomGradient(mode = 'dark') {
    let color1, color2, contrastValue;

    const colorFn =
        mode === 'light'
            ? getRandomLightHexColor
            : getRandomDarkHexColor;

    do {
        color1 = colorFn();
        color2 = colorFn();
        contrastValue = contrast(color1, color2);
    } while (contrastValue < 1.4);

    return `linear-gradient(135deg, ${color1}, ${color2})`;
}

// ---------- Text Color ----------
function applyTextColor(mode) {
    document.body.style.color =
        mode === 'light' ? '#111' : '#f5f5f5';
}

// ---------- Radio Logic ----------
const radios = document.querySelectorAll('input[name="themeMode"]');

// Load saved mode
const savedMode = getCookie('themeMode') || 'dark';

// Apply saved state
radios.forEach(radio => {
    radio.checked = radio.value === savedMode;
});

document.body.style.background = generateRandomGradient(savedMode);
applyTextColor(savedMode);

// Listen for changes
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (!radio.checked) return;

        const mode = radio.value;
        setCookie('themeMode', mode);
        document.body.style.background = generateRandomGradient(mode);
        applyTextColor(mode);
    });
});
