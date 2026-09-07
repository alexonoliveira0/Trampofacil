import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Enviando...');
    // Simulação de envio para a API
    setTimeout(() => {
      setStatus('Mensagem enviada com sucesso! Entraremos em contato via e-mail.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Central de Atendimento e Ouvidoria</h2>
      <p className="text-gray-600 mb-6">Envie sua dúvida, solicitação ou reclamação. Retornaremos via e-mail o mais breve possível.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assunto / Motivo</label>
          <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="mt-1 w-full border rounded p-2">
            <option value="">Selecione...</option>
            <option value="duvida">Dúvida Geral</option>
            <option value="reclamacao">Reclamação</option>
            <option value="suporte">Suporte Técnico</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mensagem</label>
          <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="mt-1 w-full border rounded p-2"></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Enviar Mensagem
        </button>
      </form>
      
      {status && <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">{status}</div>}
    </div>
  );
}
