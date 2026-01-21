const fs = require('fs');
const path = require('path');

// English translations
const translations = {
    en: {
        nav: {
            home: "Home",
            services: "Services",
            about: "About Us",
            contact: "Contact",
            lang_toggle: "Deutsch"
        },
        hero: {
            title: "Quality and Reliability in Construction",
            subtitle: "Your partner for structural engineering, civil engineering, and renovation.",
            cta: "Start Project"
        },
        services: {
            title: "Our Services",
            items: [
                { title: "Structural Engineering", desc: "Professional implementation of residential and commercial projects." },
                { title: "Civil Engineering", desc: "Foundations, earthworks, and infrastructure." },
                { title: "Renovation", desc: "Modernization and preservation of existing buildings." }
            ]
        },
        about: {
            title: "About Nordbau",
            desc: "With years of experience and a dedicated team, we set standards in the construction industry."
        },
        contact: {
            title: "Contact Us",
            desc: "Ready for your next project? We look forward to hearing from you."
        }
    }
};

const rootDir = path.resolve(__dirname, '..');
// IMPORTANT: We read from the SOURCE index.html because we want to base it on the dev version structure
// But typically build scripts run after vite build, so we might want to read 'dist/index.html' (the minified one?)
// If we read 'dist/index.html', replacing might be harder because it's minified.
// BUT, sticking to 'index.html' (source) means 'dist/en/index.html' will be unminified and refer to source files?
// NO. 'index.html' refers to '/src/main.js'. In 'dist/en/index.html', we want it to refer to the built assets.
//
// OPTION A: Post-process `dist/index.html`.
// OPTION B: Copy `index.html` to `dist/en/index.html` via vite somehow?
//
// If we use `dist/index.html`, regex is dangerous on minified code.
//
// BETTER PLAN:
// Use `vite build --outDir dist/en --mode production` with a different configuration or env var that tells it to use English?
// That would require code changes in `vite.config.js` or `main.js` to inject translations at build time.
//
// ALTERNATIVE:
// Read `dist/index.html`. It usually preserves some structure or we can turn off strict minification if needed.
// Actually, `vite` minifies html.
//
// Let's modify `vite.config.js` to build multi-page?
// Or just let `generate-static.js` operate on the source `index.html` and then we run `vite build` again?
// No, that's slow.
//
// Let's stick to modifying `dist/index.html`.
// The `data-i18n` attributes will persist in `dist/index.html`.
// We can find `>German Text<` or use the attributes.
// Attributes `data-i18n="nav.home"` will be there.
// `minified` html usually removes whitespace but keeps attributes. `data-i18n="nav.home">Startseite</a>` might become `data-i18n=nav.home>Startseite</a>`.
//
// Let's Inspect `vite build` output first?
// Or just try to parse it.
//
// Actually, `vite-plugin-html-env` or similar plugins exist.
//
// Simplest robust way without plugins:
// 1. Run correct build for DE -> `dist`.
// 2. Read `dist/index.html`.
// 3. Replace text content inside tags with `data-i18n`.
//    Regex `data-i18n="([^"]+)"[^>]*>([^<]*)<` works on minified too if we are careful.
//    (Unless quotes are removed).
//
// Let's try this.
//
// Also, the asset paths in `dist/index.html` will be relative or absolute?
// `base: '/'` is default. So `/assets/foo.js`.
// In `dist/en/index.html`, `/assets/foo.js` is still valid.
// So reading `dist/index.html` is the way to go.
//
// One catch: `services-grid`.
// If `dist/index.html` has minified HTML for the grid, identifying it might be hard.
// But `id="services-grid"` will persist.
// The content inside will be minified.
//
// I'll update the script to use `dist/index.html` as source.

const docsDir = path.join(rootDir, 'docs');
const enDir = path.join(docsDir, 'en');
const sourceHtmlPath = path.join(docsDir, 'index.html');

if (!fs.existsSync(docsDir)) {
    console.error("docs folder not found. Run 'npm run build' first.");
    process.exit(1);
}
if (!fs.existsSync(sourceHtmlPath)) {
    console.error("docs/index.html not found.");
    process.exit(1);
}
if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
}

let html = fs.readFileSync(sourceHtmlPath, 'utf8');

// 1. Update Lang Attribute (could be lang=de or lang="de")
html = html.replace(/lang=["']?de["']?/, 'lang="en"');

// 2. Update Title and Description
// Note: Minification might change quote style.
// We'll try flexible regex.
html = html.replace(/<title>.*?<\/title>/, '<title>Nordbau Group - Quality and Reliability in Construction</title>');
html = html.replace(/content=["']Ihr Partner für Hochbau.*?["']/, 'content="Your partner for structural engineering, civil engineering, and renovation. With years of experience and a dedicated team, we set standards in the construction industry."');

// 3. Update Text Content based on data-i18n
const t = translations.en;

const replacements = {
    'nav.home': t.nav.home,
    'nav.services': t.nav.services,
    'nav.about': t.nav.about,
    'nav.contact': t.nav.contact,
    'nav.lang_toggle': t.nav.lang_toggle,
    'hero.title': t.hero.title,
    'hero.subtitle': t.hero.subtitle,
    'hero.cta': t.hero.cta,
    'services.title': t.services.title,
    'about.title': t.about.title,
    'about.desc': t.about.desc,
    'contact.title': t.contact.title,
    'contact.desc': t.contact.desc
};

for (const [key, value] of Object.entries(replacements)) {
    // Regex to match element with data-i18n="key" ... >Content<
    // Minified might look like: <a href=# data-i18n=nav.home>Startseite</a>
    // key can be surrounded by quotes or not if simple.
    // data-i18n="key" or data-i18n=key
    const regex = new RegExp(`(data-i18n=["']?${key}["']?[^>]*>)([^<]*)(<)`, 'g');
    html = html.replace(regex, `$1${value}$3`);
}

// 4. Update Services Grid
// The services grid content in English.
// We need to match the German innerHTML.
// Since minification makes it unpredictable (class names reordered? no, but whitespace gone),
// we should just clear the inner content of #services-grid and inject English.
const servicesHtml = t.services.items.map(item =>
    `<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"><h3 class="text-xl font-bold mb-2 text-nord-blue">${item.title}</h3><p class="text-gray-600">${item.desc}</p></div>`
).join('');

// Regex to replace inner content of id="services-grid"
// <div id="services-grid" ... > ... </div>
// We assume it's a div.
// Greedy matching might kill us if there are multiple divs.
// But we know `services-grid` is specific.
// And we know what follows it? `</section>` (or container `</div>`).
// In `dist/index.html`, it's likely `<div id=services-grid ...>...</div></div></section>`.
// So we match `<div[^>]*id=["']?services-grid["']?[^>]*>(.*?)<\/div>`?
// Nested divs inside services-grid make `</div>` matching hard without recursive parser.
//
// Workaround: We know the content we injected in Step 1 starts with `<!-- Javascript` (comments are removed in minification usually).
// We know it starts with `<div class="bg-white...`.
//
// Let's use the fact that `services-grid` is followed by closing div of the container?
// Or we can just try to match the known German text of the first item?
// `Professionelle Umsetzung...` 
//
// Strategy: Find `id="services-grid"`. Find the first occurrence of `Professionelle Umsetzung`.
// Replace from `id="services-grid" ...>` end to ... where?
//
// BETTER STRATEGY:
// Don't rely on regex for complex nested HTML replacement on minified code.
// Instead, in `index.html`, wrap the services content in a comment marker that PRESERVES?
// No, comments are stripped.
//
// NEW PLAN: `src/main.js` handles the list generation.
// If I leave `services-grid` empty or with German text, `src/main.js` overwrites it on load.
// Does SEO need the English text statically in the HTML? YES.
//
// So I MUST replace it.
//
// I will assume `vite` creates a fairly standard minified structure.
// I will look for `id="services-grid"`.
// And I will look for the text of the LAST service item: "Werterhalt bestehender Gebäude.</p></div>".
// I will replace everything between header and that end.
//
// Regex:
// From: `id="services-grid"` (and closing `>`)
// To: `Werterhalt bestehender Gebäude.</p></div>` (or whatever the German text is).
//
// German text: "Modernisierung und Werterhalt bestehender Gebäude."
// Minified: `...Modernisierung und Werterhalt bestehender Gebäude.</p></div>`
//
// The regex:
// `(<div[^>]*id=["']?services-grid["']?[^>]*>).*?(Modernisierung und Werterhalt bestehender Gebäude\.</p>\s*</div>)`
// Replace with: `$1${servicesHtml}`
//
// This is specific but should work.

const endMarker = 'Modernisierung und Werterhalt bestehender Gebäude.</p></div>';
const regexGrid = new RegExp(`(<div[^>]*id=["']?services-grid["']?[^>]*>).*?(${endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 's'); // s flag for dotAll not always supported in node older versions?
// Node 12+ supports new RegExp logic.
// But simpler:
// Use `[\s\S]*?` instead of `.*?` for multi-line (though minified is usually single line).

const match = html.match(new RegExp(`(<div[^>]*id=["']?services-grid["']?[^>]*>)[\\s\\S]*?Modernisierung und Werterhalt bestehender Gebäude\\.</p>\\s*</div>`));

if (match) {
    const fullMatch = match[0];
    const openingTag = match[1];
    // We replace the middle part.
    // Actually, we want to replace the whole inner part.
    html = html.replace(fullMatch, `${openingTag}${servicesHtml}`);
} else {
    console.warn("Could not find services-grid content to replace. Check if minification changed the text.");
    // Fallback: don't replace, JS will handle it (worse SEO but functional).
}

fs.writeFileSync(path.join(enDir, 'index.html'), html);
console.log('Generated docs/en/index.html');
