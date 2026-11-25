import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Morgen Rush | Seed Balance',
  description:
    'Slither. Collect. Complete your mix. Six wholesome ingredients. One crunchy challenge. Collect every ingredient to craft a Morgen Mete bowl and climb the ranks.',
  keywords: ['Seed Balance', 'Morgen Mete', 'Snake Game', 'Muesli', 'Web Game', 'The Morgen Rush'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#071827',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
