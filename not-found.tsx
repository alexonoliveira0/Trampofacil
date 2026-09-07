import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-black text-slate-900">404 - Página Não Encontrada</h2>
        <p className="text-sm text-slate-600">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}