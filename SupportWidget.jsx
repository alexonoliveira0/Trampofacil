import React, { useState } from 'react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Olá! Como posso ajudar você hoje com sua solicitação ou reclamação?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Sua mensagem foi recebida pelo nosso suporte 24/7.' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
          💬 Suporte 24/7
        </button>
      ) : (
        <div className="w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-bold">Agente de Suporte</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-2 rounded text-sm ${m.sender === 'user' ? 'bg-blue-100 text-right ml-4' : 'bg-gray-100 text-left mr-4'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-2 border-t flex">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Digite sua dúvida..." 
              className="flex-1 border p-1 rounded text-sm outline-none" 
            />
            <button type="submit" className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}
