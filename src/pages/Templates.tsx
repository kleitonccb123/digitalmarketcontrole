import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Archive,
  Search,
  Download,
  Eye,
  Star,
  Filter,
  Globe,
  Mail,
  Share2,
  Megaphone,
  BarChart3,
  Presentation,
  FileText,
  Image,
  Video,
  Layout,
  Palette,
  Target,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'free' | 'premium';
  rating: number;
  downloads: number;
  preview: string;
  tags: string[];
  format: string;
  lastUpdated: string;
}

const templates: Template[] = [
  // Landing Pages
  {
    id: 'landing-saas',
    title: 'SaaS Landing Page',
    description: 'Template completo para produtos SaaS com seções de features, pricing e testimonials',
    category: 'landing',
    type: 'premium',
    rating: 4.9,
    downloads: 1247,
    preview: '/templates/landing-saas.jpg',
    tags: ['SaaS', 'Conversão', 'B2B'],
    format: 'HTML/CSS',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'landing-lead-magnet',
    title: 'Lead Magnet Landing',
    description: 'Página focada em captura de leads com formulário otimizado e copy persuasivo',
    category: 'landing',
    type: 'free',
    rating: 4.7,
    downloads: 2156,
    preview: '/templates/landing-lead.jpg',
    tags: ['Lead Generation', 'Formulário', 'CRO'],
    format: 'HTML/CSS',
    lastUpdated: '2024-01-10'
  },
  {
    id: 'landing-evento',
    title: 'Landing de Evento',
    description: 'Template para inscrições em webinars, workshops e eventos online',
    category: 'landing',
    type: 'free',
    rating: 4.8,
    downloads: 987,
    preview: '/templates/landing-evento.jpg',
    tags: ['Evento', 'Webinar', 'Inscrição'],
    format: 'HTML/CSS',
    lastUpdated: '2024-01-08'
  },

  // Email Marketing
  {
    id: 'email-welcome-sequence',
    title: 'Sequência de Boas-vindas',
    description: 'Série de 7 e-mails para novos leads com copy otimizado',
    category: 'email',
    type: 'premium',
    rating: 4.9,
    downloads: 1834,
    preview: '/templates/email-welcome.jpg',
    tags: ['Automação', 'Nutrição', 'Onboarding'],
    format: 'HTML/Text',
    lastUpdated: '2024-01-12'
  },
  {
    id: 'email-newsletter',
    title: 'Newsletter Semanal',
    description: 'Template responsivo para newsletters com seções de conteúdo e CTAs',
    category: 'email',
    type: 'free',
    rating: 4.6,
    downloads: 3241,
    preview: '/templates/email-newsletter.jpg',
    tags: ['Newsletter', 'Conteúdo', 'Engajamento'],
    format: 'HTML',
    lastUpdated: '2024-01-05'
  },
  {
    id: 'email-promocional',
    title: 'E-mail Promocional',
    description: 'Template para campanhas de vendas com countdown e senso de urgência',
    category: 'email',
    type: 'free',
    rating: 4.5,
    downloads: 1675,
    preview: '/templates/email-promo.jpg',
    tags: ['Vendas', 'Promoção', 'Urgência'],
    format: 'HTML',
    lastUpdated: '2024-01-03'
  },

  // Social Media
  {
    id: 'social-kit-instagram',
    title: 'Kit Instagram Stories',
    description: 'Pack com 30 templates editáveis para Stories do Instagram',
    category: 'social',
    type: 'premium',
    rating: 4.8,
    downloads: 2847,
    preview: '/templates/social-stories.jpg',
    tags: ['Instagram', 'Stories', 'Engagement'],
    format: 'PSD/Figma',
    lastUpdated: '2024-01-14'
  },
  {
    id: 'social-feed-posts',
    title: 'Posts para Feed',
    description: 'Templates de posts quadrados para Instagram e Facebook com várias categorias',
    category: 'social',
    type: 'free',
    rating: 4.7,
    downloads: 4521,
    preview: '/templates/social-feed.jpg',
    tags: ['Feed', 'Instagram', 'Facebook'],
    format: 'PSD/PNG',
    lastUpdated: '2024-01-11'
  },
  {
    id: 'social-linkedin-carousel',
    title: 'Carousel LinkedIn',
    description: 'Templates para posts em formato carousel no LinkedIn',
    category: 'social',
    type: 'free',
    rating: 4.6,
    downloads: 1293,
    preview: '/templates/social-linkedin.jpg',
    tags: ['LinkedIn', 'Carousel', 'B2B'],
    format: 'PSD/PDF',
    lastUpdated: '2024-01-09'
  },

  // Ads/Campaigns
  {
    id: 'ads-meta-kit',
    title: 'Kit Completo Meta Ads',
    description: 'Templates para Facebook e Instagram Ads em diversos formatos',
    category: 'ads',
    type: 'premium',
    rating: 4.9,
    downloads: 1567,
    preview: '/templates/ads-meta.jpg',
    tags: ['Meta Ads', 'Facebook', 'Instagram'],
    format: 'PSD/Figma',
    lastUpdated: '2024-01-13'
  },
  {
    id: 'ads-google-responsive',
    title: 'Google Ads Responsivos',
    description: 'Templates para anúncios responsivos do Google Ads',
    category: 'ads',
    type: 'free',
    rating: 4.4,
    downloads: 892,
    preview: '/templates/ads-google.jpg',
    tags: ['Google Ads', 'Responsivo', 'Display'],
    format: 'HTML/Images',
    lastUpdated: '2024-01-07'
  },

  // Reports
  {
    id: 'report-performance',
    title: 'Relatório de Performance',
    description: 'Template para relatórios mensais de marketing digital',
    category: 'reports',
    type: 'premium',
    rating: 4.8,
    downloads: 743,
    preview: '/templates/report-performance.jpg',
    tags: ['Relatório', 'KPIs', 'Analytics'],
    format: 'PowerPoint/PDF',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'report-roi-dashboard',
    title: 'Dashboard ROI/ROAS',
    description: 'Planilha interativa para acompanhamento de ROI e ROAS',
    category: 'reports',
    type: 'free',
    rating: 4.7,
    downloads: 1456,
    preview: '/templates/report-roi.jpg',
    tags: ['ROI', 'ROAS', 'Dashboard'],
    format: 'Excel/Google Sheets',
    lastUpdated: '2024-01-06'
  },

  // Presentations
  {
    id: 'presentation-pitch-deck',
    title: 'Pitch Deck Startup',
    description: 'Template profissional para apresentações de startups e investidores',
    category: 'presentations',
    type: 'premium',
    rating: 4.9,
    downloads: 654,
    preview: '/templates/pitch-deck.jpg',
    tags: ['Pitch', 'Startup', 'Investimento'],
    format: 'PowerPoint/Keynote',
    lastUpdated: '2024-01-17'
  },
  {
    id: 'presentation-marketing-plan',
    title: 'Plano de Marketing',
    description: 'Template para apresentação de estratégias e planos de marketing',
    category: 'presentations',
    type: 'free',
    rating: 4.6,
    downloads: 1123,
    preview: '/templates/marketing-plan.jpg',
    tags: ['Marketing', 'Estratégia', 'Planejamento'],
    format: 'PowerPoint',
    lastUpdated: '2024-01-04'
  }
];

const categories = [
  { id: 'all', label: 'Todos', icon: Archive, count: templates.length },
  { id: 'landing', label: 'Landing Pages', icon: Globe, count: templates.filter(t => t.category === 'landing').length },
  { id: 'email', label: 'E-mail Marketing', icon: Mail, count: templates.filter(t => t.category === 'email').length },
  { id: 'social', label: 'Redes Sociais', icon: Share2, count: templates.filter(t => t.category === 'social').length },
  { id: 'ads', label: 'Anúncios', icon: Megaphone, count: templates.filter(t => t.category === 'ads').length },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, count: templates.filter(t => t.category === 'reports').length },
  { id: 'presentations', label: 'Apresentações', icon: Presentation, count: templates.filter(t => t.category === 'presentations').length }
];

export default function Templates() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = filterType === 'all' || template.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
      toast({
        title: "Removido dos favoritos",
        description: "Template removido da sua lista de favoritos."
      });
    } else {
      newFavorites.add(templateId);
      toast({
        title: "Adicionado aos favoritos",
        description: "Template salvo na sua lista de favoritos."
      });
    }
    setFavorites(newFavorites);
  };

  const downloadTemplate = (template: Template) => {
    toast({
      title: "Download iniciado!",
      description: `Template "${template.title}" está sendo baixado.`
    });
  };

  const previewTemplate = (template: Template) => {
    toast({
      title: "Visualizando template",
      description: `Abrindo preview de "${template.title}".`
    });
  };

  const copyTemplateLink = (template: Template) => {
    navigator.clipboard.writeText(`https://app.com/templates/${template.id}`);
    toast({
      title: "Link copiado!",
      description: "Link do template copiado para a área de transferência."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8 text-primary" />
            Templates de Marketing
          </h1>
          <p className="text-muted-foreground">
            Biblioteca completa de templates prontos para usar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredTemplates.length} templates encontrados
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            Todos
          </Button>
          <Button
            variant={filterType === 'free' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('free')}
          >
            Gratuitos
          </Button>
          <Button
            variant={filterType === 'premium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('premium')}
          >
            Premium
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Categorias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.label}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="shadow-card hover:shadow-glow transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {template.title}
                        {template.type === 'premium' && (
                          <Badge variant="default" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(template.id)}
                      className="ml-2 p-1"
                    >
                      <Star 
                        className={`h-4 w-4 ${
                          favorites.has(template.id) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Template Preview Placeholder */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <Layout className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        {template.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {template.downloads}
                      </span>
                    </div>
                    <span className="text-xs">{template.format}</span>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadTemplate(template)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {template.type === 'premium' ? 'Comprar' : 'Baixar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => previewTemplate(template)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyTemplateLink(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="text-center py-12">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}