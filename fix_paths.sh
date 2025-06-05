#!/bin/bash

# Parcourir tous les fichiers HTML récursivement
find . -name "*.html" -not -name "header.html" -not -name "footer.html"-not -name "template.html" | while read file; do
    echo "Correction des chemins dans $file"

    # Compter le nombre de niveaux de profondeur
    depth=$(echo "$file" | tr -cd '/' | wc -c)
    prefix=""

    # Si le fichier n'est pas à la racine, calculer le préfixe
    if [ $depth -gt 1 ]; then
        for ((i=1; i<$depth; i++)); do
            prefix="../$prefix"
        done
        echo "Profondeur: $depth, Préfixe: $prefix"

        # Remplacer les chemins absolus par des chemins relatifs
        sed -i '' "s|href=\"/static|href=\"${prefix}static|g" "$file"
        sed -i '' "s|src=\"/static|src=\"${prefix}static|g" "$file"
        sed -i '' "s|fetch(\"/header|fetch(\"${prefix}header|g" "$file"
        sed -i '' "s|fetch(\"/footer|fetch(\"${prefix}footer|g" "$file"
    else
        echo "Fichier à la racine, pas de modification nécessaire"
    fi
done
