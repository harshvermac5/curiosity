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

function generateRandomGradient(mode = 'dark') {
    let color1, color2, contrastValue;

    const colorFn =
        mode === 'light' ? getRandomLightHexColor : getRandomDarkHexColor;

    do {
        color1 = colorFn();
        color2 = colorFn();
        contrastValue = contrast(color1, color2);
    } while (contrastValue < 0.4);

    return `linear-gradient(135deg, ${color1}, ${color2})`;
}

function applyTextColor(mode) {
    document.body.style.color =
        mode === 'light' ? '#111' : '#f5f5f5';
}

// --- Radio logic ---
const radios = document.querySelectorAll('input[name="themeMode"]');

// Load saved mode
const savedMode = getCookie('themeMode') || 'dark';

// Apply saved state
radios.forEach(radio => {
    radio.checked = radio.value === savedMode;
});

document.body.style.background = generateRandomGradient(savedMode); applyTextColor(savedMode);

// Listen for changes
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (!radio.checked) return;

        const mode = radio.value;
        setCookie('themeMode', mode);
        document.body.style.background = generateRandomGradient(mode); applyTextColor(savedMode);
    });
});
