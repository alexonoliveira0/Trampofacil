import React, { useState } from 'react';

export default function PixPayment() {
  const [copied, setCopied] = useState(false);
  const pixKey = "00020101021126480014br.gov.bcb.pix0126alexoliveira0880@gmail.com520400005303986540529.905802BR5915ALEXON OLIVEIRA6009SAO PAULO62070503***6304B2A1";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50 max-w-md mx-auto shadow-sm">
      <h3 className="font-bold text-xl mb-2 text-gray-800">Pagamento via PIX</h3>
      <p className="text-sm text-gray-600 mb-4">Copie o código abaixo e cole no aplicativo do seu banco para finalizar a transação.</p>
      
      <div className="bg-gray-200 p-3 rounded text-xs break-all text-gray-700 font-mono mb-4 border border-gray-300">
        {pixKey}
      </div>
      
      <button 
        onClick={handleCopy}
        className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {copied ? '✓ Código Copiado!' : '📋 Copiar Código PIX'}
      </button>
    </div>
  );
}
