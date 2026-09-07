'"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wrench, ShieldCheck, User as UserIcon, Briefcase, DollarSign, 
  CheckCircle2, Clock, AlertCircle, Phone, Mail, MessageSquare, 
  Plus, Search, Star, ChevronRight, HelpCircle, Send, Copy, Check, 
  Smartphone, LogOut, Settings, Award, MapPin
} from 'lucide-react';
import { User, Job, Proposal, PaymentTransaction, SupportTicket, ChatMessage } from '@/types';
import { generatePixPayload, generatePixQrCodeDataUrl, OFFICIAL_PIX_KEY, OFFICIAL_RECIPIENT_NAME, OFFICIAL_RECIPIENT_CITY } from '@/lib/pix';
import { usePWAInstall } from '@/lib/usePWAInstall';

export default function TrampoFacilApp() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-cliente-1',
    name: 'Carlos Silva',
    email: 'carlos.silva@email.com',
    role: 'cliente',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    city: 'São Paulo',
    state: 'SP',
    createdAt: new Date().toISOString(),
    clientFeeStatus: 'nao_pago',
    providerPlanStatus: 'ativo',
  });

  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'wallet' | 'support' | 'admin'>('home');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Mock initial state
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'j-1',
      clientId: 'u-cliente-1',
      clientName: 'Carlos Silva',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      clientCity: 'São Paulo',
      clientState: 'SP',
      title: 'Reparo de Instalação Elétrica Residencial',
      category: 'Eletricista',
      description: 'Preciso trocar disjuntores do quadro geral e instalar 3 tomadas novas na cozinha.',
      urgency: 'urgente',
      budgetType: 'aberto_a_orcamentos',
      materialsProvided: 'nao',
      status: 'aberto',
      createdAt: new Date().toISOString(),
      proposalsCount: 2
    },
    {
      id: 'j-2',
      clientId: 'u-cliente-2',
      clientName: 'Mariana Souza',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      clientCity: 'São Paulo',
      clientState: 'SP',
      title: 'Limpeza Pós-Obra em Apartamento 80m²',
      category: 'Limpeza',
      description: 'Limpeza detalhada de pisos, rodapés e vidros após reforma na sala e quartos.',
      urgency: 'esta_semana',
      budgetMax: 450,
      budgetType: 'definido',
      materialsProvided: 'sim',
      status: 'aberto',
      createdAt: new Date().toISOString(),
      proposalsCount: 1
    }
  ]);

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'p-1',
      jobId: 'j-1',
      providerId: 'u-prestador-1',
      providerName: 'Roberto Eletricista',
      providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      providerHeadline: 'Eletricista Residencial & Comercial CREA-SP',
      providerRating: 4.9,
      providerReviewsCount: 48,
      providerCompletedJobs: 112,
      providerVerified: true,
      price: 280,
      availableDate: '2026-03-10',
      availableTime: '09:00',
      estimatedDuration: '3 horas',
      message: 'Olá Carlos! Sou eletricista experiente e levo todas as ferramentas necessárias.',
      materialsIncluded: false,
      status: 'pendente',
      createdAt: new Date().toISOString()
    }
  ]);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: 'tx-1',
      userId: 'u-prestador-1',
      userName: 'Roberto Eletricista',
      userEmail: 'roberto@eletricista.com',
      userRole: 'prestador',
      type: 'mensalidade_prestador',
      amount: 29.90,
      pixPayload: '00020101021126480014br.gov.bcb.pix0126alexoliveira0880@gmail.com520400005303986540529.905802BR5915ALEXON OLIVEIRA6009SAO PAULO62070503***6304F136',
      status: 'aprovado',
      createdAt: new Date().toISOString(),
      txId: 'TXPREV123'
    }
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 't-1',
      userName: 'Carlos Silva',
      userEmail: 'carlos.silva@email.com',
      type: 'duvida',
      subject: 'Como funciona a taxa de cadastro?',
      message: 'Gostaria de entender se a taxa de cliente é cobrada por cada serviço ou única.',
      status: 'resolvido',
      createdAt: new Date().toISOString(),
      adminReply: 'Olá Carlos! A taxa de cliente de R$ 10,00 é única para ativar seu cadastro e garantia na plataforma.'
    }
  ]);

  // New Job Modal State
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('Eletricista');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobUrgency, setNewJobUrgency] = useState<'urgente' | 'esta_semana' | 'combinar' | 'data_especifica'>('urgente');
  const [newJobBudget, setNewJobBudget] = useState('');

  // New Proposal Modal State
  const [selectedJobForProposal, setSelectedJobForProposal] = useState<Job | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalMsg, setProposalMsg] = useState('');

  // Support Form State
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportType, setSupportType] = useState<'duvida' | 'reclamacao' | 'feedback' | 'erro_bug' | 'contato_dono'>('duvida');
  const [supportSent, setSupportSent] = useState(false);

  const { isInstallable, install } = usePWAInstall();

  // Handle Create Job
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDesc) return;

    const newJob: Job = {
      id: 'j-' + Date.now(),
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      clientCity: currentUser.city,
      clientState: currentUser.state,
      title: newJobTitle,
      category: newJobCategory,
      description: newJobDesc,
      urgency: newJobUrgency,
      budgetType: newJobBudget ? 'definido' : 'aberto_a_orcamentos',
      budgetMax: newJobBudget ? Number(newJobBudget) : undefined,
      materialsProvided: 'nao',
      status: 'aberto',
      createdAt: new Date().toISOString(),
      proposalsCount: 0
    };

    setJobs([newJob, ...jobs]);
    setShowNewJobModal(false);
    setNewJobTitle('');
    setNewJobDesc('');
    setNewJobBudget('');
    alert('Serviço publicado com sucesso! Profissionais da sua região serão notificados.');
  };

  // Handle Send Proposal
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForProposal || !proposalPrice) return;

    const newProp: Proposal = {
      id: 'p-' + Date.now(),
      jobId: selectedJobForProposal.id,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      providerHeadline: currentUser.headline || 'Profissional Autônomo Verificado',
      providerRating: currentUser.rating || 5.0,
      providerReviewsCount: currentUser.totalReviews || 12,
      providerCompletedJobs: currentUser.completedJobsCount || 24,
      providerVerified: currentUser.verified || true,
      price: Number(proposalPrice),
      availableDate: new Date().toISOString().split('T')[0],
      availableTime: '10:00',
      estimatedDuration: '2 horas',
      message: proposalMsg || 'Proposta enviada pelo aplicativo TrampoFácil.',
      materialsIncluded: true,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    setProposals([newProp, ...proposals]);
    setJobs(jobs.map(j => j.id === selectedJobForProposal.id ? { ...j, proposalsCount: j.proposalsCount + 1 } : j));
    setSelectedJobForProposal(null);
    setProposalPrice('');
    setProposalMsg('');
    alert('Orçamento enviado com sucesso para o cliente!');
  };

  // Handle Pay Fee (Client or Provider)
  const handlePayFee = (type: 'taxa_cadastro_cliente' | 'mensalidade_prestador') => {
    const amount = type === 'taxa_cadastro_cliente' ? 10.0 : 29.90;
    const payload = generatePixPayload({
      key: OFFICIAL_PIX_KEY,
      name: OFFICIAL_RECIPIENT_NAME,
      city: OFFICIAL_RECIPIENT_CITY,
      amount,
      txId: 'TRAMPO' + Math.floor(Math.random() * 90000 + 10000)
    });

    const newTx: PaymentTransaction = {
      id: 'tx-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      userCity: currentUser.city,
      userState: currentUser.state,
      userRole: currentUser.role,
      type,
      amount,
      pixPayload: payload,
      status: 'pendente',
      createdAt: new Date().toISOString(),
      txId: 'TX' + Date.now()
    };

    setTransactions([newTx, ...transactions]);

    // Simulate instant approval for demo convenience if auto-approved
    setTimeout(() => {
      setTransactions(prev => prev.map(t => t.id === newTx.id ? { ...t, status: 'aprovado' } : t));
      if (type === 'taxa_cadastro_cliente') {
        setCurrentUser(u => ({ ...u, clientFeeStatus: 'aprovado' }));
      } else {
        setCurrentUser(u => ({ ...u, providerPlanStatus: 'ativo' }));
      }
    }, 3000);

    alert('PIX gerado com sucesso! Simulação de pagamento PIX iniciada (aprovação automática em 3 segundos para teste).');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-inner">
              <Wrench className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">TrampoFácil</h1>
              <p className="text-xs text-indigo-200">Serviços Locais & Orçamentos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isInstallable && (
              <button
                onClick={install}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 text-xs px-3 py-1.5 rounded-lg border border-indigo-700 transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>Instalar App</span>
              </button>
            )}

            <div className="flex items-center space-x-2 bg-indigo-800/80 px-3 py-1.5 rounded-xl border border-indigo-700 text-xs">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
              <div className="text-left hidden md:block">
                <p className="font-bold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-indigo-300 capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selector Bar */}
        <div className="bg-indigo-950/70 border-t border-indigo-800/50 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setCurrentUser(u => ({ ...u, role: 'cliente' }));
                  setActiveTab('home');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentUser.role === 'cliente' ? 'bg-amber-400 text-slate-950 shadow' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
              >
                Modo Cliente
              </button>
              <button
                onClick={() => {
                  setCurrentUser(u => ({ ...u, role: 'prestador', headline: 'Eletricista & Bombeiro Hidráulico' }));
                  setActiveTab('home');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentUser.role === 'prestador' ? 'bg-amber-400 text-slate-950 shadow' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
              >
                Modo Prestador
              </button>
              <button
                onClick={() => {
                  setCurrentUser(u => ({ ...u, role: 'admin' }));
                  setActiveTab('admin');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentUser.role === 'admin' ? 'bg-amber-400 text-slate-950 shadow' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
              >
                Painel Administrador
              </button>
            </div>

            <div className="text-xs text-indigo-300 hidden lg:block">
              PIX Oficial BACEN: <span className="font-mono text-amber-300">alexoliveira0880@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentUser.role === 'cliente' && (
          <div className="space-y-6">
            {/* Client Status Banner */}
            {currentUser.clientFeeStatus !== 'aprovado' ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-base">Ative seu Cadastro de Cliente (Taxa única R$ 10,00)</h3>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Para solicitar orçamentos ilimitados e contratar profissionais com garantia TrampoFácil, efetue o pagamento da taxa via PIX BACEN.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handlePayFee('taxa_cadastro_cliente')}
                  className="w-full md:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow transition shrink-0"
                >
                  Pagar R$ 10,00 via PIX
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900 text-sm">Cliente Verificado & Ativo</p>
                    <p className="text-xs text-emerald-700">Seu cadastro possui acesso total aos melhores orçamentos da região.</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full font-bold">Ativo</span>
              </div>
            )}

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Meus Pedidos & Orçamentos</h2>
                <p className="text-xs text-slate-500">Publique um serviço ou gerencie propostas de profissionais qualificados.</p>
              </div>
              <button
                onClick={() => setShowNewJobModal(true)}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Pedir Novo Orçamento</span>
              </button>
            </div>

            {/* Jobs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {job.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.clientCity}/{job.clientState}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Orçamentos Recebidos</p>
                      <p className="text-sm font-bold text-indigo-600">{job.proposalsCount} propostas</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedJobForProposal(job);
                        alert(`Visualizando propostas para: ${job.title}`);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                    >
                      Ver Propostas ({job.proposalsCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentUser.role === 'prestador' && (
          <div className="space-y-6">
            {/* Provider Status Banner */}
            {currentUser.providerPlanStatus !== 'ativo' ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-base">Ative sua Mensalidade de Prestador (R$ 29,90/mês)</h3>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Envie orçamentos ilimitados, apareça em destaque para clientes na sua cidade e feche contratos diretamente.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handlePayFee('mensalidade_prestador')}
                  className="w-full md:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow transition shrink-0"
                >
                  Pagar R$ 29,90 via PIX
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900 text-sm">Plano de Prestador Ativo</p>
                    <p className="text-xs text-emerald-700">Você pode enviar orçamentos e aceitar serviços sem restrições.</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full font-bold">Ativo</span>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-black text-slate-900">Mural de Serviços Disponíveis</h2>
              <p className="text-xs text-slate-500">Encontre clientes buscando serviços na sua região e envie sua proposta profissional.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {job.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.clientCity}/{job.clientState}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{job.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Cliente</p>
                      <p className="text-sm font-bold text-slate-800">{job.clientName}</p>
                    </div>
                    <button
                      onClick={() => setSelectedJobForProposal(job)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow"
                    >
                      Enviar Orçamento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-black">Painel Administrativo TrampoFácil</h2>
              <p className="text-xs text-slate-400 mt-1">Gerencie transações PIX BACEN, taxas de clientes e mensalidades de prestadores.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Transações PIX Recentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400">
                      <th className="pb-3">Usuário</th>
                      <th className="pb-3">Tipo</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td className="py-3 font-bold text-slate-800">{tx.userName} ({tx.userRole})</td>
                        <td className="py-3 capitalize">{tx.type.replace(/_/g, ' ')}</td>
                        <td className="py-3 font-bold text-emerald-600">R$ {tx.amount.toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.status === 'aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Solicitar Novo Orçamento</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Troca de disjuntor ou Pintura de parede"
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={newJobCategory}
                  onChange={e => setNewJobCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Eletricista">Eletricista</option>
                  <option value="Bombeiro Hidráulico">Bombeiro Hidráulico</option>
                  <option value="Limpeza">Limpeza Residencial</option>
                  <option value="Pintor">Pintor</option>
                  <option value="Montador de Móveis">Montador de Móveis</option>
                  <option value="Outros">Outros Serviços</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Detalhada</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o que precisa ser feito..."
                  value={newJobDesc}
                  onChange={e => setNewJobDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Publicar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {selectedJobForProposal && currentUser.role === 'prestador' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Enviar Orçamento</h3>
            <p className="text-xs text-slate-500">Serviço: <span className="font-bold text-slate-800">{selectedJobForProposal.title}</span></p>
            <form onSubmit={handleSendProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valor do Orçamento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 150.00"
                  value={proposalPrice}
                  onChange={e => setProposalPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mensagem para o Cliente</label>
                <textarea
                  rows={3}
                  placeholder="Explique seus detalhes de atendimento e garantia..."
                  value={proposalMsg}
                  onChange={e => setProposalMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedJobForProposal(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Enviar Proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}