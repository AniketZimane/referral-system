import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Referral Credit System',
  description: 'Earn credits by referring friends to our digital platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}