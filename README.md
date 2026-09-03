# Language and Hearing Solutions (Pty) Ltd — Website

A static, mobile-first website for **Language and Hearing Solutions (Pty) Ltd**, a South African audiology and speech therapy practice. Built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step, no backend.

> "Language and hearing are the two windows to the soul."

---

## File Structure

```text
/
├── index.html                 Home
├── about.html                 About (vision, mission, values)
├── services.html              Audiology & Speech Therapy service directory
├── corporate-wellness.html    Industrial & Corporate Wellness
├── clients.html                Case studies (Sasol Mine Secunda, Transnet)
├── contact.html                Contact form, contact cards, locations
│
├── css/
│   └── style.css              Full design system (tokens, layout, components)
│
├── js/
│   └── main.js                Mobile nav, scroll reveal, form validation
│
├── assets/
│   ├── logo.svg                Recreated brand mark (profile + ear + sound wave)
│   ├── hearing-aid.svg         Placeholder hero/services image
│   ├── speech-therapy.svg      Placeholder services image
│   └── industrial-visit.svg    Placeholder corporate wellness image
│
└── README.md
```

## Running the site

No build tools or server required. Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080` (adjust the port to whichever tool you use).

## Placeholder assets — please replace before going live

The letterhead image supplied in chat could not be saved to disk as a usable image file, so the following were created as **clearly labelled SVG placeholders** so the site is visually complete and ready to swap:

- `assets/logo.svg` — a recreation of the described brand mark (circular teal ring, facial profile, ear, sound wave) in the practice's teal (`#0F6E6A`) and dark teal (`#0B4A47`). **Replace with the actual logo file** (ideally an SVG or high-resolution PNG) for pixel-perfect brand accuracy.
- `assets/hearing-aid.svg`, `assets/speech-therapy.svg`, `assets/industrial-visit.svg` — illustrative teal-toned placeholders, each captioned "Placeholder image — replace with practice photograph" directly in the image and in its `<title>`/`<desc>` for accessibility. Replace with real photography (hearing aid close-up, clinician/patient session, onsite industrial visit) when available. Keep the same filenames, or update the `src` attributes in each HTML file if you rename them.

No other content was invented. Per the brief, the following are intentionally left as **placeholders** because the exact official wording was not supplied:

- **Vision statement** (`about.html`) — currently shows the slogan and a placeholder note. Replace with the official wording from the company profile PDF.
- **Mission statement** (`about.html`) — currently shows a placeholder note plus a short, non-committal description of day-to-day approach. Replace with the official wording.
- **Director's name** — not shown anywhere, since it was not supplied.
- **Social media links** — omitted, as no profiles were supplied.
- **Opening hours** — omitted, as none were supplied.
- **Exact per-kilometre travel rate** — described only as "the applicable South African standard per-kilometre rate," per instruction not to invent a figure.

## Contact form — no backend

`contact.html` includes a fully client-side validated enquiry form (required fields, email format check, inline error messages, ARIA live-region feedback). Because this is a static site with **no backend**, submitting the form does **not** send data to a server. Instead, `js/main.js` builds a `mailto:` link from the form fields and opens the visitor's own email client with the message pre-filled, addressed to `info@languageandhearingsolutions.co.za`. The on-screen success message reflects this accurately.

### Connecting a real form backend later

To have submissions delivered automatically (recommended for production), connect the existing form markup to a form backend such as:

- **[Formspree](https://formspree.io/)** — set the form's `action` to your Formspree endpoint and `method="POST"`, then remove/adjust the `mailto:` logic in `main.js`.
- **[Netlify Forms](https://docs.netlify.com/forms/setup/)** — if hosting on Netlify, add `data-netlify="true"` and a hidden `form-name` input to the `<form>` tag; Netlify will handle submissions automatically.

The field `name` attributes (`name`, `email`, `phone`, `service`, `message`) are already backend-friendly and require no renaming.

## Design system

All shared styling lives in `css/style.css`, organised into reusable components:

- CSS custom properties for colour, radius, shadow and spacing tokens (teal `#0F6E6A`, dark teal `#0B4A47`, white, greys)
- Header / sticky nav / animated mobile menu
- Hero and page-hero sections with wave dividers
- Buttons (`btn-primary`, `btn-secondary` for WhatsApp green, `btn-outline`, `btn-outline-light`)
- Cards: generic `.card`, `.pillar-card`, `.service-card`, `.location-card`, `.contact-card`, `.case-card`, `.value-card`
- Trust bar, coverage section, contact strip, footer
- Floating WhatsApp button (`.whatsapp-float`)
- Form fields with validation states
- `.reveal` scroll-in animation, disabled automatically under `prefers-reduced-motion`

## Accessibility

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `footer`, `address`)
- Skip-to-content link on every page
- Visible focus states on all interactive elements
- Descriptive `alt` text (including placeholder images, which are labelled as such)
- Labelled form fields with `aria-live` error/success feedback
- Colour is never the sole means of conveying information
- Respects `prefers-reduced-motion`
- No autoplay audio/video

## SEO

Every page has a unique `<title>`, meta description, and a `canonical` link placeholder (`https://www.languageandhearingsolutions.co.za/...`) — update these to the real production domain when the site is deployed.

## Key contact links used throughout

- WhatsApp: `https://wa.me/27797195743`
- Phone (Cell): `tel:+27628653860`
- Email: `mailto:info@languageandhearingsolutions.co.za`
