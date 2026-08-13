import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TemuTani — B2B Agricultural Waste Marketplace Powered by AI',
  description: 'Marketplace B2B limbah pertanian yang menghubungkan Kelompok Tani / Gapoktan dengan sektor industri pertanian berbasis AI Reasoning Engine (GEMASTIK 2026).',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="light">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('PWA ServiceWorker registered:', reg.scope); },
                    function(err) { console.log('PWA ServiceWorker registration failed:', err); }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
