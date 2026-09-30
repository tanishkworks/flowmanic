import { ImageResponse } from 'next/og';

export const alt = 'Flowmanic: AI automation for marketing agencies';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ffffff',
          color: '#000000',
        }}
      >
        <div style={{ display: 'flex', fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1 }}>AGENCY</div>
        <div style={{ display: 'flex', fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1, color: '#0B54F7' }}>
          AUTOPILOT
        </div>
        <div style={{ display: 'flex', marginTop: 48, fontSize: 28, fontWeight: 700, letterSpacing: 6 }}>
          FLOWMANIC · AI AUTOMATION FOR MARKETING AGENCIES
        </div>
      </div>
    ),
    size,
  );
}
