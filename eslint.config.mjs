/**
 * SITE-LINT-NEVER-WORKED-001
 *
 * This repo had NO eslint config, no eslint dependency and no CI, so
 * `npm run lint` (`next lint`) dropped into an interactive setup prompt and had
 * therefore never once produced a result. A gate step that cannot produce a
 * result is not a gate.
 *
 * Flat config on the ESLint CLI rather than `next lint`: `next lint` is
 * deprecated in Next 15 and REMOVED in Next 16, and the Rides app is already on
 * 16 - wiring this to a command that is scheduled for deletion would just book
 * the same outage again.
 */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default config;
