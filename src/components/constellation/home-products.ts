import { PRODUCTS } from '../../lib/products';
import { ecosystemApps } from '../ecosystem/ecosystem-apps';

// Home-only copy/source binding: Main's 2026-09-05 orbital copy receipt.
// These authored illustrations represent structure, not deployed screenshots.
const PRESENTATION = {
  velocity: {
    line: 'Intel for humans and agents.', heading: 'Less noise. More context.',
    reason: 'Important changes are scattered across too many feeds. We built Velocity to bring news, security signals and local conditions into one place, with sources you can explore.',
    sourceCommit: 'd009756a7d37ec2bbe6302278d4a200e07291e53',
    sourcePaths: ['src/app/about/page.tsx', 'src/components/trend-card.tsx', 'src/components/security/stack-watch-list.tsx', 'src/components/local-intel-pulse.tsx'],
    repo: 'Velocity', previewAlt: 'Illustrated Velocity workspace with news, security and local conditions alongside source links.',
    artAlt: 'Separate sources converge into an ordered signal view.',
  },
  academy: {
    line: "Your child's journey, guided by you.", heading: 'More time for learning.',
    reason: 'Planning and record-keeping should not consume the school day. We built Academy to connect lessons, the family plan and progress, while keeping parents in charge.',
    sourceCommit: 'c817d656b3ea30e2dcbff3df3ffeaf05a42a032c',
    sourcePaths: ['src/components/landing/LandingV3.tsx', 'src/app/api/parent/family-planner/draw/route.ts', 'src/app/api/parent/record-export/route.ts'],
    repo: 'academy', previewAlt: 'Illustrated Academy parent workspace connecting a family plan, lessons and progress.',
    artAlt: 'A lesson, a day plan and a progress record form a connected learning path.',
  },
  andiamo: {
    line: PRODUCTS.find(p => p.key === 'andiamo')!.tagline, heading: 'A way to get there.',
    reason: 'A missed ride can mean a missed opportunity. We are building Rides to connect riders, transport providers and community sponsors. It is in closed beta.',
    sourceCommit: '6cdced61b6aca51cdcc2ab0bcbef6972ea3b7b8a', sourcePaths: ['src/lib/brand.ts'],
    repo: 'Andiamo', previewAlt: 'Illustrated Rides closed-beta workspace with rider, provider and community sponsor roles. No live trip or payment.',
    artAlt: 'A route connects a rider, a transport provider and a community sponsor.',
  },
  pathfinder: {
    line: 'Your files. A clearer view.', heading: 'Keep your work in view.',
    reason: 'Files and changes should be easier to follow. We built Pathfinder to bring browsing, editing and file watching into one desktop workspace.',
    sourceCommit: 'd7c7c87110f74463f6c0ade34a5a367d281b644b', sourcePaths: ['README.md', 'src/components/WatcherView.tsx', 'src/components/EditorPanel.tsx'],
    repo: 'Explorer', previewAlt: 'Illustrated Pathfinder workspace with synthetic project files, an editor and a change trail.',
    artAlt: 'Layered file panes connect a document to its edit and change trail.',
  },
} as const;

export const HOME_PRODUCTS = PRODUCTS.map(product => ({
  key: product.key, name: product.name, url: product.url, accent: product.accent,
  ...PRESENTATION[product.key],
  nodeTagline: product.key === 'andiamo' ? ecosystemApps.find(p => p.key === 'andiamo')!.tagline : null,
  textAccent: { velocity: '#67dae6', academy: '#b8a4f4', andiamo: '#7bdda4', pathfinder: '#efc46d' }[product.key],
  preview: {
    kind: 'authored-illustration' as const, label: 'Interface illustration',
    asset: `/home-orbital/${product.key}-interface.svg`,
    sourceRepo: PRESENTATION[product.key].repo,
    sourceCommit: PRESENTATION[product.key].sourceCommit,
    sourcePaths: PRESENTATION[product.key].sourcePaths,
  },
  art: `/home-orbital/${product.key}-purpose.svg`,
}));
