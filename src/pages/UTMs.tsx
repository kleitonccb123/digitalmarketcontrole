import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  ExternalLink, 
  Plus, 
  QrCode, 
  Link as LinkIcon, 
  Edit, 
  Trash2,
  Globe,
  Tag,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Links predefinidos do usuário
const predefinedLinks = [
  {
    id: 'link-1',
    name: 'Price Pro Copy FX',
    url: 'https://priceprocopyfx.shop/',
    category: 'Trading',
    description: 'Plataforma de trading FX',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-2', 
    name: 'Seja Digital Market',
    url: 'https://sejadigitalmarket.com/',
    category: 'Marketing Digital',
    description: 'Curso de marketing digital',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-3',
    name: 'Trader Price FX',
    url: 'https://traderpricefx.com/',
    category: 'Trading',
    description: 'Plataforma de trading profissional',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-4',
    name: 'WhatsApp Group - EMS Copy C',
    url: 'https://chat.whatsapp.com/FFin3fq3bUvLdvVUXdS4tW?mode=ems_copy_c',
    category: 'WhatsApp',
    description: 'Grupo WhatsApp EMS Copy C',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-5',
    name: 'WhatsApp Group - EMS Copy T',
    url: 'https://chat.whatsapp.com/IYptSZpemx38G0SfIpimi9?mode=ems_copy_t',
    category: 'WhatsApp', 
    description: 'Grupo WhatsApp EMS Copy T',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-6',
    name: 'Cadastro Tickmill',
    url: 'https://my.tickmill.com?utm_campaign=ib_link&utm_content=IB35750824&utm_medium=Open+Account&utm_source=link&lp=https%3A%2F%2Fmy.tickmill.com%2Fpt%2Fsign-up%2F',
    category: 'Broker',
    description: 'Cadastro na corretora Tickmill',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-7',
    name: 'Link Copy Trade Marcos',
    url: 'https://tck.tradingsocial.net/portal/registration/subscription/84935/PriceFX01',
    category: 'Trading',
    description: 'Copy trading com Marcos - PriceFX',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-8',
    name: 'Indicador Price Pro',
    url: 'https://payment.ticto.app/ODB67755E',
    category: 'Trading',
    description: 'Indicador Price Pro para trading',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-9',
    name: 'Acompanhamento One',
    url: 'https://payment.ticto.app/O7F67D826',
    category: 'Trading',
    description: 'Serviço de acompanhamento One',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-10',
    name: 'Smart',
    url: 'https://payment.ticto.app/O8166E72F',
    category: 'Trading',
    description: 'Produto Smart para trading',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-11',
    name: 'Black Max',
    url: 'https://payment.ticto.app/O34853C50',
    category: 'Trading',
    description: 'Produto Black Max',
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-12',
    name: 'Bot Price Pro',
    url: 'https://payment.ticto.app/OC1F57B99',
    category: 'Trading',
    description: 'Bot automatizado Price Pro',
    createdAt: new Date().toISOString()
  }
];

export default function UTMs() {
  const { utms, addUTM } = useAppStore();
  const { toast } = useToast();
  const [links] = useState(predefinedLinks);
  const [selectedTab, setSelectedTab] = useState('utms');
  const [isUTMDialogOpen, setIsUTMDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [newUTM, setNewUTM] = useState({
    campaign: '',
    source: '',
    medium: '',
    content: '',
    term: '',
    baseUrl: ''
  });

  const generateUTMUrl = () => {
    const { baseUrl, campaign, source, medium, content, term } = newUTM;
    if (!baseUrl || !campaign || !source || !medium) return '';
    
    const params = new URLSearchParams();
    params.append('utm_campaign', campaign);
    params.append('utm_source', source);
    params.append('utm_medium', medium);
    if (content) params.append('utm_content', content);
    if (term) params.append('utm_term', term);
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleAddUTM = () => {
    const fullUrl = generateUTMUrl();
    if (!fullUrl) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    addUTM({
      campaign: newUTM.campaign,
      source: newUTM.source,
      medium: newUTM.medium,
      content: newUTM.content,
      term: newUTM.term,
      fullUrl
    });
    
    setNewUTM({
      campaign: '',
      source: '',
      medium: '',
      content: '',
      term: '',
      baseUrl: ''
    });
    setIsUTMDialogOpen(false);
    
    toast({
      title: "UTM criado!",
      description: "Link UTM gerado com sucesso"
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Trading': 'bg-blue-100 text-blue-800 border-blue-200',
      'Marketing Digital': 'bg-green-100 text-green-800 border-green-200',
      'WhatsApp': 'bg-green-100 text-green-800 border-green-200',
      'Broker': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">UTMs & LinkHub</h1>
          <p className="text-muted-foreground/80 mt-2 font-medium">Gerencie links UTM e organize seu hub de links</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass p-1 h-12">
          <TabsTrigger value="utms" className="btn-apple focus-ring">
            <Tag className="w-4 h-4 mr-2" />
            UTMs
          </TabsTrigger>
          <TabsTrigger value="linkhub" className="btn-apple focus-ring">
            <LinkIcon className="w-4 h-4 mr-2" />
            LinkHub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="utms" className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-foreground/90">Links UTM</h2>
            <Dialog open={isUTMDialogOpen} onOpenChange={setIsUTMDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-apple focus-ring shadow-soft">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar UTM
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass border-border/40">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Criar novo UTM</DialogTitle>
                  <DialogDescription className="text-muted-foreground/80">
                    Preencha os parâmetros para gerar seu link UTM
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-3">
                    <Label htmlFor="baseUrl" className="text-sm font-medium">URL Base *</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://exemplo.com"
                      value={newUTM.baseUrl}
                      onChange={(e) => setNewUTM({...newUTM, baseUrl: e.target.value})}
                      className="focus-ring"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="campaign" className="text-sm font-medium">Campanha *</Label>
                      <Input
                        id="campaign"
                        placeholder="black-friday"
                        value={newUTM.campaign}
                        onChange={(e) => setNewUTM({...newUTM, campaign: e.target.value})}
                        className="focus-ring"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="source" className="text-sm font-medium">Fonte *</Label>
                      <Input
                        id="source"
                        placeholder="facebook"
                        value={newUTM.source}
                        onChange={(e) => setNewUTM({...newUTM, source: e.target.value})}
                        className="focus-ring"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="medium" className="text-sm font-medium">Mídia *</Label>
                      <Input
                        id="medium"
                        placeholder="social"
                        value={newUTM.medium}
                        onChange={(e) => setNewUTM({...newUTM, medium: e.target.value})}
                        className="focus-ring"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="content" className="text-sm font-medium">Conteúdo</Label>
                      <Input
                        id="content"
                        placeholder="banner-topo"
                        value={newUTM.content}
                        onChange={(e) => setNewUTM({...newUTM, content: e.target.value})}
                        className="focus-ring"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="term" className="text-sm font-medium">Termo</Label>
                    <Input
                      id="term"
                      placeholder="desconto"
                      value={newUTM.term}
                      onChange={(e) => setNewUTM({...newUTM, term: e.target.value})}
                      className="focus-ring"
                    />
                  </div>
                  {generateUTMUrl() && (
                    <div className="grid gap-3">
                      <Label className="text-sm font-medium">Preview do Link</Label>
                      <div className="p-3 bg-muted/50 rounded-lg text-xs break-all font-mono border">
                        {generateUTMUrl()}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddUTM} disabled={!generateUTMUrl()} className="btn-apple focus-ring">
                    Criar UTM
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {utms.length === 0 ? (
              <Card className="glass border-border/40 shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Tag className="w-16 h-16 text-muted-foreground/60 mb-6" />
                  <h3 className="text-xl font-semibold mb-3">Nenhum UTM criado</h3>
                  <p className="text-muted-foreground/80 text-center mb-6 max-w-sm">
                    Crie seu primeiro link UTM para começar a rastrear suas campanhas
                  </p>
                  <Button onClick={() => setIsUTMDialogOpen(true)} className="btn-apple focus-ring">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeiro UTM
                  </Button>
                </CardContent>
              </Card>
            ) : (
              utms.map((utm) => (
                <Card key={utm.id} className="glass border-border/40 shadow-card hover:shadow-glow transition-all duration-300 animate-scale-in">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-medium text-foreground/90">
                          {utm.campaign} • {utm.source} • {utm.medium}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1 text-muted-foreground/70">
                          Criado em {format(new Date(utm.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(utm.fullUrl, 'Link UTM')}
                          className="btn-apple focus-ring"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(utm.fullUrl, '_blank')}
                          className="btn-apple focus-ring"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground/80 break-all bg-muted/30 p-3 rounded-lg font-mono border">
                      {utm.fullUrl}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {utm.content && <Badge variant="secondary" className="text-xs font-medium">Conteúdo: {utm.content}</Badge>}
                      {utm.term && <Badge variant="secondary" className="text-xs font-medium">Termo: {utm.term}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="linkhub" className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-foreground/90">Hub de Links</h2>
            <Badge variant="outline" className="font-mono text-xs">{links.length} links</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {links.map((link) => (
              <Card key={link.id} className="glass border-border/40 shadow-card hover:shadow-glow transition-all duration-300 animate-scale-in group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-3 font-medium text-foreground/90 group-hover:text-primary transition-colors">
                        <Globe className="w-5 h-5" />
                        {link.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2 text-muted-foreground/70">
                        {link.description}
                      </CardDescription>
                    </div>
                    <Badge className={`${getCategoryColor(link.category)} font-medium text-xs`}>
                      {link.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground/80 break-all bg-muted/30 p-3 rounded-lg mb-4 font-mono border">
                    {link.url}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/60 font-medium">
                      Adicionado em {format(new Date(link.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(link.url, link.name)}
                        className="btn-apple focus-ring"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        className="btn-apple focus-ring"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}