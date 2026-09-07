export type UserRole = 'cliente' | 'prestador' | 'admin';
export type PaymentStatus = 'nao_pago' | 'pendente_aprovacao' | 'aprovado' | 'rejeitado' | 'vencido';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  city: string;
  state: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  createdAt: string;
  clientFeeStatus?: 'nao_pago' | 'pendente_aprovacao' | 'aprovado';
  clientFeePaidAt?: string;
  providerPlanStatus?: 'nao_pago' | 'pendente_aprovacao' | 'ativo' | 'vencido';
  subscriptionExpiresAt?: string;
  specialties?: string[];
  headline?: string;
  bio?: string;
  rating?: number;
  totalReviews?: number;
  completedJobsCount?: number;
  verified?: boolean;
}

export type JobStatus = 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';

export interface JobReview {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientCity: string;
  clientState: string;
  title: string;
  category: string;
  description: string;
  urgency: 'urgente' | 'esta_semana' | 'combinar' | 'data_especifica';
  preferredDate?: string;
  preferredTime?: string;
  budgetMax?: number;
  budgetType: 'definido' | 'aberto_a_orcamentos';
  materialsProvided: 'sim' | 'nao' | 'parcial';
  status?: JobStatus;
  createdAt: string;
  proposalsCount: number;
  chosenProposalId?: string;
  chosenProviderId?: string;
  review?: JobReview;
}

export type ProposalStatus = 'pendente' | 'aceita' | 'recusada';

export interface Proposal {
  id: string;
  jobId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerHeadline?: string;
  providerRating: number;
  providerReviewsCount: number;
  providerCompletedJobs: number;
  providerVerified: boolean;
  price: number;
  availableDate: string;
  availableTime: string;
  estimatedDuration: string;
  message: string;
  materialsIncluded: boolean;
  status: ProposalStatus;
  createdAt: string;
}

export type TransactionType = 'taxa_cadastro_cliente' | 'mensalidade_prestador';

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userCity?: string;
  userState?: string;
  userRole: UserRole;
  type: TransactionType;
  amount: number;
  pixPayload: string;
  pixQrCode?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
  approvedAt?: string;
  txId: string;
  proofNote?: string;
  planDurationDays?: number;
}

export interface AdminSettings {
  pixKey: string;
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  recipientName: string;
  recipientCity: string;
  clientRegistrationFee: number;
  providerMonthlyFee: number;
  autoApproveDemo?: boolean;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  type: 'duvida' | 'reclamacao' | 'feedback' | 'erro_bug' | 'contato_dono';
  subject: string;
  message: string;
  status: 'aberto' | 'em_analise' | 'resolvido';
  createdAt: string;
  adminReply?: string;
}