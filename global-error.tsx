'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Erro no Sistema</h2>
          <p className="text-sm text-slate-600">
            Ocorreu um erro no carregamento da aplicação.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}