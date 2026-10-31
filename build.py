#!/usr/bin/env python3
"""Builds the static multi-page TFL site from src/.

Edit content in src/pages/*.html, shared parts in src/partials/, styles in
assets/style.css, then run:  python3 build.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
DOMAIN = "https://www.tfllogistics.eu"

# slug -> (output dir, title, meta description, menu key)
PAGES = {
    "home": ("", "TFL Logistics – Complete ontzorging voor al uw transport en zendingen",
             "TFL Logistics uit Losser: wegtransport door heel Europa, lucht- en zeevracht wereldwijd en spoedzendingen. Eén aanspreekpunt, offerte binnen één uur.", None),
    "wegtransport": ("wegtransport", "Wegtransport door heel Europa | TFL Logistics",
             "Groupage, palletdistributie, deelvrachten, volle vrachten, ADR en GDP-transport door heel Europa. Vrijwel dagelijks ritten. Vraag een offerte aan.", "wegtransport"),
    "lucht-en-zeevracht": ("lucht-en-zeevracht", "Lucht- en zeevracht wereldwijd | TFL Logistics",
             "Wereldwijde import en export via lucht- en zeevracht. FCL, LCL, containervervoer en deur-tot-deurservice met één vast aanspreekpunt.", "lucht-en-zeevracht"),
    "spoedzendingen": ("spoedzendingen", "Spoedzending boeken? Snel een offerte | TFL Logistics",
             "Spoedtransport of spoedkoerier nodig? Binnen enkele uren staat er een transporteur voor de deur. Pallets, colli en volle vrachten.", "spoedzendingen"),
    "over-ons": ("over-tfl", "Over TFL Logistics – Totaalleverancier voor al jouw transport",
             "Maak kennis met TFL Logistics: ruim 30 jaar ervaring in internationaal transport, korte lijnen, goede prijzen en 100% levergarantie.", "over-tfl"),
    "offerte": ("offerteaanvraag", "Offerte aanvragen – binnen één uur een prijs | TFL Logistics",
             "Vraag eenvoudig een transportofferte aan voor wegtransport, lucht- en zeevracht of een spoedzending. U ontvangt binnen één uur een prijs.", None),
    "contact": ("contact", "Contact | TFL Logistics, Losser",
             "Neem contact op met TFL Logistics: 085 87 70 599, info@tfllogistics.eu, Broekhoekweg 34, 7582 PT Losser.", "contact"),
}

# hash link in source -> page slug
LINKMAP = {"#home": "home", "#offerte": "offerte", "#over-ons": "over-ons", "#contact": "contact",
           "#wegtransport": "wegtransport", "#lucht-en-zeevracht": "lucht-en-zeevracht",
           "#spoedzendingen": "spoedzendingen", "#diensten": "home", "#": "home"}

def read(p): return (SRC / p).read_text(encoding="utf-8")

def url(slug, prefix):
    d = PAGES[slug][0]
    return prefix + (d + "/" if d else "") or "./"

def fix_links(html, prefix):
    def rep(m):
        target = m.group(1)
        if target in LINKMAP:
            return f'href="{url(LINKMAP[target], prefix)}"'
        return m.group(0)
    return re.sub(r'href="(#[a-z\-]*)"', rep, html)

def build():
    head = read("partials/head.html")
    defs = read("partials/svg-defs.html")
    header = read("partials/header.html")
    footer = read("partials/footer.html")
    sitemap = []
    for slug, (outdir, title, desc, menu) in PAGES.items():
        prefix = "../" if outdir else ""
        body = read(f"pages/{slug}.html")
        canonical = f"{DOMAIN}/{outdir + '/' if outdir else ''}"
        hdr = header
        if menu:
            hdr = hdr.replace(f'data-menu="{menu}"', f'data-menu="{menu}" class="active" aria-current="page"')
        html = (head.replace("{{TITLE}}", title).replace("{{DESC}}", desc)
                    .replace("{{CANONICAL}}", canonical).replace("{{P}}", prefix)
                + "<body>\n" + defs + hdr + "<main>\n" + body + "</main>\n" + footer
                + f'<script src="{prefix}assets/main.js"></script>\n</body>\n</html>\n')
        html = fix_links(html, prefix).replace("{{P}}", prefix)
        out = ROOT / outdir / "index.html" if outdir else ROOT / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, encoding="utf-8")
        sitemap.append(canonical)
        print("built", out.relative_to(ROOT))
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{u}</loc></url>\n" for u in sitemap) + "</urlset>\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n", encoding="utf-8")

if __name__ == "__main__":
    build()
