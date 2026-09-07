# Language and Hearing Solutions (Pty) Ltd — Website

A premium, static, mobile-first website for **Language and Hearing Solutions (Pty) Ltd**, a South African audiology and speech therapy practice. Built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, build step or backend.

> “Language and hearing are the two windows to the soul.”

## File structure

```text
/
├── index.html                 Home and practice overview
├── about.html                 Practice story, credentials, values and approach
├── services.html              Audiology and speech therapy service directory
├── corporate-wellness.html    Industrial audiology and workplace wellness
├── clients.html               Data-led workplace screening case studies
├── contact.html               Contact methods, enquiry form and locations
│
├── css/
│   └── style.css              Shared premium design system and responsive layout
│
├── js/
│   └── main.js                Navigation, reveal states, FAQ and form validation
│
├── assets/
│   ├── logo.svg                Teal profile, ear and sound-wave brand mark
│   ├── hearing-aid.svg         Editorial audiology illustration
│   ├── speech-therapy.svg      Editorial speech-therapy illustration
│   ├── industrial-visit.svg    Editorial workplace-visit illustration
│   └── clinical-environment.svg Editorial consultation-environment illustration
│
└── README.md
```

## Running the site

No build tools or server are required. Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080` (adjust the port to whichever tool you use).

## Design direction

The redesign is intentionally structured as a private healthcare practice rather than a template collection of cards:

- Warm white, sand, deep navy and restrained teal create a calm clinical palette.
- Editorial serif display typography is paired with a readable sans-serif body face.
- Credentials, practice number and locations are visible early without overwhelming the page.
- Asymmetric editorial sections, numbered directories, data-led proof cards and a clear contact hierarchy replace repetitive rounded-card layouts.
- Corporate Wellness uses a more operational B2B flow: service scope, process, screening context and case-study evidence.
- The homepage follows the intended journey: hero → trust → practice → services → audiences → corporate wellness → field evidence → care promise → FAQ → contact CTA.
- Layouts adapt for 360px and 390px phones, tablet, laptop and large desktop widths. Reduced-motion preferences are respected.

The local SVG illustrations are lightweight, brand-coloured artwork created for the static experience. They keep the website self-contained and fast while approved practice photography or final brand artwork can be substituted later without changing the page structure.

## Content boundaries

No staff names, patient testimonials, opening hours, prices, exact travel rates or unverified medical claims have been added. The practice is described as a single-director practice without naming the director. The official mission and full vision wording remain clearly marked as pending because the exact approved wording was not supplied. The practice slogan is presented as a slogan, not as a patient testimonial.

The case-study figures are labelled as relating only to specific workplace screening visits and not to the total number of patients served:

- Sasol Mine Secunda: 25 people screened, 15 required ear-wax management, and 11 failed screening due to wax blockage and were referred for further assessment.
- Transnet: 40 people screened, 11 required wax management, 2 presented possible hearing loss and 4 had tympanic membrane perforations.

## Contact form — no backend

`contact.html` includes a client-side validated enquiry form with required fields, inline error messages and ARIA feedback. Because this is a static site with **no backend**, submitting the form does not send data to a server. Instead, `js/main.js` builds a `mailto:` link from the form fields and opens the visitor’s email client with the message pre-filled for `info@languageandhearingsolutions.co.za`. The on-screen message accurately provides direct email and WhatsApp fallbacks.

The field names (`name`, `email`, `phone`, `service`, `message`) are already suitable for connecting a real form backend later.

## Accessibility and SEO

- Semantic HTML5 landmarks and a skip-to-content link are used throughout.
- Navigation, FAQ controls and form feedback expose accessible states.
- All meaningful images have descriptive alt text; decorative footer marks use empty alt text.
- Visible keyboard focus states, responsive mobile actions and `prefers-reduced-motion` support are included.
- Every page has a unique title, description, canonical URL, favicon, Open Graph title/description and Twitter card metadata.

## Key contact links

- WhatsApp: `https://wa.me/27797195743`
- WhatsApp / phone: `079 719 5743`
- Cell: `tel:+27628653860`
- Email: `mailto:info@languageandhearingsolutions.co.za`
