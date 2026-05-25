import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Next.js convention: this file generates /icon at runtime (and at build
// time for static export). Replaces the need for a separate .png or .ico.
// Modern browsers prefer this over .ico; Safari also renders it correctly.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1E293B 0%, #0EA5E9 55%, #06B6D4 100%)',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <path d="M11 8 L21 16 L11 24 Z" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
