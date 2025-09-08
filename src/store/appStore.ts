import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types para o store principal
export interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  origin: string;
  score: number;
  status: 'Novo' | 'Qualificação' | 'Call' | 'Proposta' | 'Fechado - Ganho' | 'Fechado - Perdido';
  createdAt: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  purchases: number;
  revenue: number;
  date: string;
}

export interface Creative {
  id: string;
  name: string;
  angle: string;
  promise: string;
  hypothesis: string;
  status: 'Testando' | 'Aprovado' | 'Pausado' | 'Arquivado';
  thumbnail?: string;
  notes?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  status: 'Ideia' | 'Roteiro' | 'Edição' | 'Aprovado' | 'Publicado';
  copy?: string;
  cta?: string;
  responsible?: string;
  scheduledDate?: string;
  createdAt: string;
}

export interface UTM {
  id: string;
  campaign: string;
  source: string;
  medium: string;
  content?: string;
  term?: string;
  fullUrl: string;
  qrCode?: string;
  createdAt: string;
}

export interface Audit {
  id: string;
  website: string;
  type: 'SEO' | 'Performance' | 'UX/UI' | 'Técnico' | 'Concorrência';
  status: 'Agendado' | 'Em Análise' | 'Concluído' | 'Entregue';
  score?: number;
  priority: 'Alta' | 'Média' | 'Baixa';
  issues?: number;
  opportunities?: number;
  client?: string;
  dueDate: string;
  completedAt?: string;
  reportUrl?: string;
  notes?: string;
  createdAt: string;
}

interface AppState {
  // Data
  projects: Project[];
  leads: Lead[];
  campaigns: Campaign[];
  creatives: Creative[];
  posts: Post[];
  utms: UTM[];
  audits: Audit[];
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  addCampaign: (campaign: Campaign) => void;
  addCreative: (creative: Omit<Creative, 'id' | 'createdAt'>) => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  addUTM: (utm: Omit<UTM, 'id' | 'createdAt'>) => void;
  addAudit: (audit: Omit<Audit, 'id' | 'createdAt'>) => void;
  
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  
  // Utility
  exportData: () => string;
  importData: (data: string) => boolean;
  clearAll: () => void;
  loadDemoData: () => void;
}

// Dados de demonstração
const generateDemoData = () => ({
  projects: [
    {
      id: '1',
      name: 'Digital Max - Clínica Renova',
      client: 'Clínica Renova',
      status: 'Em andamento',
      createdAt: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'LP + Tráfego - Academia Strong',
      client: 'Academia Strong',
      status: 'Aprovação',
      createdAt: new Date().toISOString()
    }
  ],
  leads: Array.from({ length: 15 }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Lead ${i + 1}`,
    phone: `(11) 9${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    origin: ['Meta', 'Google', 'Indicação', 'Site'][Math.floor(Math.random() * 4)],
    score: Math.floor(Math.random() * 100),
    status: ['Novo', 'Qualificação', 'Call', 'Proposta'][Math.floor(Math.random() * 4)] as any,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  })),
  campaigns: [
    {
      id: 'camp-1',
      name: 'Prospecção DM - Frio',
      platform: 'Meta',
      spend: 350.50,
      impressions: 120000,
      clicks: 1400,
      leads: 95,
      purchases: 7,
      revenue: 4200.00,
      date: '2025-01-06'
    },
    {
      id: 'camp-2',
      name: 'Remarketing DM - 7d',
      platform: 'Meta',
      spend: 180.00,
      impressions: 38000,
      clicks: 620,
      leads: 110,
      purchases: 9,
      revenue: 5600.00,
      date: '2025-01-06'
    }
  ],
  creatives: [
    {
      id: 'creative-1',
      name: 'Vídeo 30s - Transformação',
      angle: 'Antes e Depois',
      promise: '30 dias para seu melhor resultado',
      hypothesis: 'Transformação visual gera mais conversões',
      status: 'Testando' as const,
      createdAt: new Date().toISOString()
    },
    {
      id: 'creative-2',
      name: 'Carrossel - Benefícios',
      angle: 'Educativo',
      promise: 'Descubra os 5 segredos',
      hypothesis: 'Conteúdo educativo aumenta confiança',
      status: 'Aprovado' as const,
      createdAt: new Date().toISOString()
    }
  ],
  posts: [
    {
      id: 'post-1',
      title: 'Dica de Segunda - Produtividade',
      status: 'Aprovado' as const,
      copy: 'Como organizar sua semana para ter mais resultados',
      cta: 'Salve este post!',
      responsible: 'Ana Silva',
      scheduledDate: '2025-01-13',
      createdAt: new Date().toISOString()
    }
  ],
  utms: [
    {
      id: 'utm-1',
      campaign: 'lancamento-2025',
      source: 'meta',
      medium: 'social',
      content: 'video-transformacao',
      fullUrl: 'https://example.com?utm_campaign=lancamento-2025&utm_source=meta&utm_medium=social&utm_content=video-transformacao',
      createdAt: new Date().toISOString()
    }
  ],
  audits: [
    {
      id: 'audit-1',
      website: 'clinicabenova.com.br',
      type: 'SEO' as const,
      status: 'Concluído' as const,
      score: 78,
      priority: 'Alta' as const,
      issues: 12,
      opportunities: 8,
      client: 'Clínica Renova',
      dueDate: '2025-01-10',
      completedAt: '2025-01-08',
      reportUrl: '#',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'audit-2',
      website: 'academiastrong.com.br',
      type: 'Performance' as const,
      status: 'Em Análise' as const,
      priority: 'Média' as const,
      client: 'Academia Strong',
      dueDate: '2025-01-15',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'audit-3',
      website: 'consultoriodr.silva.com',
      type: 'UX/UI' as const,
      status: 'Agendado' as const,
      priority: 'Baixa' as const,
      dueDate: '2025-01-20',
      createdAt: new Date().toISOString()
    }
  ]
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      leads: [],
      campaigns: [],
      creatives: [],
      posts: [],
      utms: [],
      audits: [],
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, {
          ...project,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      addLead: (lead) => set((state) => ({
        leads: [...state.leads, {
          ...lead,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      addCampaign: (campaign) => set((state) => ({
        campaigns: [...state.campaigns, campaign]
      })),
      
      addCreative: (creative) => set((state) => ({
        creatives: [...state.creatives, {
          ...creative,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      addPost: (post) => set((state) => ({
        posts: [...state.posts, {
          ...post,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      addUTM: (utm) => set((state) => ({
        utms: [...state.utms, {
          ...utm,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      addAudit: (audit) => set((state) => ({
        audits: [...state.audits, {
          ...audit,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(lead => 
          lead.id === id ? { ...lead, ...updates } : lead
        )
      })),
      
      updatePost: (id, updates) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === id ? { ...post, ...updates } : post
        )
      })),
      
      updateAudit: (id, updates) => set((state) => ({
        audits: state.audits.map(audit => 
          audit.id === id ? { ...audit, ...updates } : audit
        )
      })),
      
      exportData: () => {
        const state = get();
        return JSON.stringify({
          projects: state.projects,
          leads: state.leads,
          campaigns: state.campaigns,
          creatives: state.creatives,
          posts: state.posts,
          utms: state.utms,
          audits: state.audits,
          exportedAt: new Date().toISOString()
        }, null, 2);
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            projects: parsed.projects || [],
            leads: parsed.leads || [],
            campaigns: parsed.campaigns || [],
          creatives: parsed.creatives || [],
          posts: parsed.posts || [],
          utms: parsed.utms || [],
          audits: parsed.audits || []
          });
          return true;
        } catch {
          return false;
        }
      },
      
      clearAll: () => set({
        projects: [],
        leads: [],
        campaigns: [],
        creatives: [],
        posts: [],
        utms: [],
        audits: []
      }),
      
      loadDemoData: () => {
        const demo = generateDemoData();
        set(demo);
      }
    }),
    {
      name: 'dm-app-storage'
    }
  )
);