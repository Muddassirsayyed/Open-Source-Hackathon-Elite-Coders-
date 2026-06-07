'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { I18nProvider } from '@/context/I18nContext';
import { SocketProvider } from '@/context/SocketContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
