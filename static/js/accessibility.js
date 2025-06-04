// Gestion du thème et de l'accessibilité
document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs
    const themeToggle = document.getElementById('theme-toggle');
    const fontToggle = document.getElementById('font-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const fontIcon = fontToggle.querySelector('i');

    // Restaurer les préférences
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('dyslexic') === 'true';

    // Appliquer les préférences initiales
    document.body.dataset.theme = savedTheme;
    document.body.dataset.dyslexic = savedFont;

    // Mettre à jour les icônes
    updateThemeIcon(savedTheme === 'dark');
    updateFontIcon(savedFont);

    // Gestionnaire de thème
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.dataset.theme === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);

        // Émettre un événement pour les autres scripts
        window.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: newTheme }
        }));
    });

    // Gestionnaire de police
    fontToggle.addEventListener('click', () => {
        const isDyslexic = document.body.dataset.dyslexic === 'true';
        const newState = !isDyslexic;

        document.body.dataset.dyslexic = newState;
        localStorage.setItem('dyslexic', newState);
        updateFontIcon(newState);

        // Émettre un événement pour les autres scripts
        window.dispatchEvent(new CustomEvent('fontChange', {
            detail: { dyslexic: newState }
        }));
    });

    // Mettre à jour les icônes
    function updateThemeIcon(isDark) {
        themeIcon.classList.remove('bi-sun-fill', 'bi-moon-fill', 'bi-moon-stars-fill');
        themeIcon.classList.add(isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill');
        themeToggle.title = isDark ? 'Passer en mode clair' : 'Passer en mode sombre';

        // Update button text if it exists
        const buttonText = themeToggle.querySelector('span');
        if (buttonText) {
            buttonText.textContent = isDark ? 'Mode clair' : 'Mode sombre';
        }
    }

    function updateFontIcon(isDyslexic) {
        fontIcon.classList.remove('bi-type', 'bi-type-bold', 'bi-fonts');
        fontIcon.classList.add(isDyslexic ? 'bi-type-bold' : 'bi-fonts');
        fontToggle.title = isDyslexic ? 'Police standard' : 'Police dyslexique';

        // Update button text if it exists
        const buttonText = fontToggle.querySelector('span');
        if (buttonText) {
            buttonText.textContent = isDyslexic ? 'Police standard' : 'Police dyslexique';
        }
    }

    // Initialize tooltips if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    }

    // Gestion des préférences système
    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
        if (!localStorage.getItem('theme')) {
            document.body.dataset.theme = e.matches ? 'dark' : 'light';
            updateThemeIcon(e.matches);
        }
    });

    // Skip to content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Aller au contenu principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
});
