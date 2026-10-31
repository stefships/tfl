# TFL Logistics – website

Statische website voor tfllogistics.eu (puur HTML/CSS/JS, geen framework).

## Structuur
- `index.html`, `wegtransport/`, `lucht-en-zeevracht/`, `spoedzendingen/`, `over-tfl/`, `offerteaanvraag/`, `contact/` – gegenereerde pagina's
- `assets/style.css` – alle opmaak
- `assets/main.js` – menu, contactknop, formulieren, bewegende header
- `src/pages/` – inhoud per pagina
- `src/partials/` – gedeelde delen (head, header, footer, iconen)
- `sitemap.xml`, `robots.txt`

## Aanpassen
Wijzig de inhoud in `src/`, en draai daarna `python3 build.py` om de pagina's opnieuw te genereren.
