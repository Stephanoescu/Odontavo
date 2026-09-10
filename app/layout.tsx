import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@identity/presentation/SessionProvider';

export const metadata: Metadata = {
  title: 'ODONTAVO — Tu Consultorio Digital',
  description: 'Sistema de gestión personal para tu consultorio odontológico. Expedientes, recetas, agenda y finanzas en un solo lugar.',
  keywords: 'odontología, consultorio dental, expediente digital, recetas, agenda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
