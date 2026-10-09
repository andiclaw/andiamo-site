/**
 * SITE-HOME-FEEDBACK-1008-001 Part B: the content of /products/<app>. Every line carries its source so R2 can read the
 * claim against it. Academy, Velocity and Rides lines restate what each app's own live public page says (captured
 * 2026-10-08); nothing here goes beyond those pages. Pathfinder covers only release 1.3.7, which is a source candidate,
 * unsigned and unpublished (Explorer docs/release-notes-v1.3.7.md at e45b191).
 * Colours are not set here: the page uses the product registry's accent, which is the app's own theme token.
 */
export interface AppPage {
  key: 'academy' | 'velocity' | 'andiamo' | 'pathfinder';
  summary: string;
  status: string;
  screenshot: { src: string; alt: string; source: string } | null;
  features: Array<{ text: string; source: string }>;
}

const ACA = 'https://academy.andiamo.tech/, captured 2026-10-08';
const VEL = 'https://velocity.andiamo.tech/, captured 2026-10-08';
const RID = 'https://rides.andiamo.tech/, captured 2026-10-08';
const PF = 'Explorer docs/release-notes-v1.3.7.md at e45b191';

export const APP_PAGES: AppPage[] = [
  {
    key: 'academy',
    summary: 'Plan the week, teach the lesson, keep the record.',
    status: 'Live at academy.andiamo.tech.',
    screenshot: {
      src: '/products/academy/home-1440.png',
      alt: 'The Academy home page: plan the week, teach the lesson, keep the record, and a family view with two sample children',
      source: `${ACA} at 1440 by 900`,
    },
    features: [
      { text: 'Press one button and the week is planned.', source: `${ACA}: heading "Press one button and the week is planned."` },
      { text: 'Academy sets each lesson up for you to teach.', source: `${ACA}: hero step "Teach the lesson / Academy sets it up"` },
      { text: "Progress is carried into your child's record, and the record is yours.", source: `${ACA}: list item "Progress carried into the record"; heading "Your child's record, owned by you."` },
      { text: "Faith lessons follow your family's tradition, or take a secular path, set per child and changeable later.", source: `${ACA}: headings "Your family's tradition", "Or a secular path", "Per child, changeable"` },
      { text: 'Andaro adds a story layer over the schoolwork.', source: `${ACA}: heading "A story layer over the schoolwork."` },
    ],
  },
  {
    key: 'velocity',
    summary: 'Live intel for humans and agents.',
    status: 'Live at velocity.andiamo.tech, with a free tier and no credit card.',
    screenshot: {
      src: '/products/velocity/home-1440.png',
      alt: 'The Velocity home page: Live intel for humans and agents, above a view of the dashboard',
      source: `${VEL} at 1440 by 900`,
    },
    features: [
      { text: 'A five-signal score with continuous decay, so a loud story is not mistaken for an accelerating one.', source: `${VEL}: headings "Loud is not the same as accelerating", "Five-signal score", "Continuous decay"` },
      { text: 'The same story is clustered together, and micro trends roll up to macro ones.', source: `${VEL}: headings "Same-story clustering", "Micro rolls up to macro"` },
      { text: 'Declare your tech stack and see the matching vulnerabilities from NVD and GitHub advisories, matched by version, on your stack watch and over MCP for your agents.', source: `${VEL}: steps 1 to 3 and list items "NVD + GHSA feeds", "Version-aware matching", "MCP access"` },
      { text: 'Email, push and webhook alerts are not switched on yet.', source: `${VEL}: step 3 "Email, push and webhook alerts are not switched on yet."` },
      { text: 'Threat-actor intelligence on 200+ APT groups, with confidence-scored links.', source: `${VEL}: list items "200+ APT groups", "Confidence-scored links"` },
    ],
  },
  {
    key: 'andiamo',
    summary: 'Mobility with Meaning.',
    status: 'In private beta. Ask to join at rides.andiamo.tech.',
    screenshot: {
      src: '/products/andiamo/home-1440.png',
      alt: 'The Rides home page: Mobility with Meaning, with Take the Tour, Sign In, and the form to ask to join the beta',
      source: `${RID} at 1440 by 900`,
    },
    features: [
      { text: 'Starting in Skagit Valley, Washington.', source: `${RID}: hero "Starting in Skagit Valley, WA."` },
      { text: 'Neighbors give rides, and helpers draw on a shared fund.', source: `${RID}: hero "Neighbors give rides, helpers draw on a shared fund"` },
      { text: 'Every zone grows as people use it.', source: `${RID}: hero "every zone grows as people use it."` },
    ],
  },
  {
    key: 'pathfinder',
    summary: 'A file manager for the Mac, in development.',
    status: 'Not yet released. Release 1.3.7 is a source candidate: unsigned and unpublished.',
    screenshot: null,
    features: [
      { text: 'An MCP server for AI agents, with 27 allowed methods registered in the 1.3.7 source.', source: `${PF}: "The MCP server currently registers 27 allowed methods"` },
      { text: 'The editor refuses to save over a planted temporary file or link instead of overwriting it.', source: `${PF}: "The editor save path now refuses an existing predictable temporary symlink or ordinary-file collision"` },
      { text: 'Release 1.3.7 prepares a signed and notarized macOS release; that has not been run yet.', source: `${PF}: "This candidate prepares a Developer ID, notarization and Gatekeeper release chain. Preparation does not mean the chain has been executed."` },
    ],
  },
];
