/**
 * Lifecycle badges for the root constellation (AND-TECH-ROOT-CONSTELLATION-001).
 *
 * Deliberately NOT derived from `Product.status`. That field drives other copy
 * and uses a build-stage vocabulary ('live' | 'beta' | 'building' | 'soon'),
 * whereas a badge on the front door has to tell a visitor what they can actually
 * do right now. Pathfinder is the clearest case: its status is 'beta', but what
 * a visitor needs to know is that it is a desktop app they download, not a site
 * they can sign into.
 *
 * These strings are the reason the products heading had to change from "Four
 * products, in production." A badge reading "Closed beta" directly under that
 * sentence would have made the page contradict itself.
 */
import type { Product } from './products';

export type LifecycleTone = 'live' | 'beta' | 'desktop';

export interface Lifecycle {
  /** Shown in the badge. Kept to two words so it fits the node at every width. */
  label: string;
  tone: LifecycleTone;
  /** Read out to assistive tech, and used as the node's title attribute. */
  description: string;
}

const LIFECYCLE: Record<Product['key'], Lifecycle> = {
  velocity: {
    label: 'Live',
    tone: 'live',
    description: 'Live now. Sign up and use it today.',
  },
  academy: {
    label: 'Live',
    tone: 'live',
    description: 'Live now. Sign up and use it today.',
  },
  andiamo: {
    // Gated invite-only by AND-RIDES-CLOSED-BETA-001. Anyone can ask to join,
    // which is why the description points at the waitlist rather than dead-ending.
    label: 'Closed beta',
    tone: 'beta',
    description: 'Invite only for now. Request a place on the waitlist.',
  },
  pathfinder: {
    label: 'Desktop app',
    tone: 'desktop',
    description: 'A desktop app for macOS. Download and run it locally.',
  },
};

export function lifecycleFor(key: Product['key']): Lifecycle {
  return LIFECYCLE[key];
}
