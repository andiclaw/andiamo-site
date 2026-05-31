import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple touch icon, iOS home-screen, Safari tab pinned, macOS shortcuts.
// Slightly different layout than favicon: more padding, larger glyph.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1E293B 0%, #0EA5E9 55%, #06B6D4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 32 32">
          <path d="M11 8 L21 16 L11 24 Z" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
