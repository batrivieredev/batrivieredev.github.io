#!/bin/bash

# Parcourir tous les fichiers HTML récursivement
find . -name "*.html" -not -name "header.html" -not -name "footer.html" -not -name "template.html" | while read file; do
    echo "Mise à jour de $file"

    # Corriger l'ID du header
    sed -i '' 's/id="header"/id="header-placeholder"/' "$file"

    # Ajouter le footer placeholder s'il n'existe pas déjà
    if ! grep -q "footer-placeholder" "$file"; then
        sed -i '' 's/<div id="header-placeholder"><\/div>/<div id="header-placeholder"><\/div>\n    <div id="footer-placeholder"><\/div>/' "$file"
    fi

    # Supprimer tout footer HTML statique
    sed -i '' '/<footer class=/,/<\/footer>/d' "$file"

    # Mettre à jour la section des scripts
    sed -i '' '/<script/,/<\/body>/c\
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><\/script>\
    <script src="/static/js/accessibility.js"><\/script>\
    <script>\
        // Charger le header\
        fetch("/header.html")\
            .then(response => response.text())\
            .then(data => {\
                document.getElementById("header-placeholder").innerHTML = data;\
                // Re-init Bootstrap components after dynamic content load\
                const dropdowns = document.querySelectorAll(".dropdown-toggle");\
                dropdowns.forEach(dropdown => new bootstrap.Dropdown(dropdown));\
            })\
            .catch(error => console.error("Erreur lors du chargement du header:", error));\
\
        // Charger le footer puis initialiser l'\''accessibilité\
        fetch("/footer.html")\
            .then(response => response.text())\
            .then(data => {\
                document.getElementById("footer-placeholder").innerHTML = data;\
                // Initialiser l'\''accessibilité après l'\''insertion du footer\
                if (typeof window.initializeAccessibility === "function") {\
                    window.initializeAccessibility();\
                }\
            })\
            .catch(error => console.error("Erreur lors du chargement du footer:", error));\
    <\/script>\
</body>' "$file"
done
