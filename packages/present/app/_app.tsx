import "../styles/globals.css";

import { ReactNode } from 'react';
import { AppProps } from 'next/app';

function SafeHydrate({ children }: { children: ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SafeHydrate>
      <Component {...pageProps} />
    </SafeHydrate>
  );
}

export default MyApp;
