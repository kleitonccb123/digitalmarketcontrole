import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';
import { 
  FileText, 
  Download, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Building2,
  Scissors,
  Store,
  GraduationCap,
  Target,
  Users,
  Zap,
  Gift,
  Megaphone,
  Image,
  AlertTriangle
} from 'lucide-react';

interface BriefingData {
  id: string;
  clientName: string;
  niche: 'clinica' | 'salao' | 'local' | 'infoprodutor';
  businessName: string;
  contactInfo: string;
  
  // Análise de negócio
  pains: string;
  objectives: string;
  persona: string;
  differentials: string;
  competitors: string;
  
  // Oferta e estratégia
  mainOffer: string;
  secondaryOffers: string;
  channels: string[];
  currentAssets: string;
  restrictions: string;
  
  // Extras por nicho
  services?: string; // Clínica/Salão
  location?: string; // Local Business
  productType?: string; // Infoprodutor
  
  createdAt: string;
  status: 'Rascunho' | 'Finalizado' | 'Aprovado';
}

const nicheConfig = {
  clinica: {
    icon: Building2,
    title: 'Clínica/Estética',
    color: 'text-blue-400',
    fields: {
      services: 'Principais procedimentos/serviços',
      location: 'Localização e área de atendimento'
    }
  },
  salao: {
    icon: Scissors,
    title: 'Salão de Beleza',
    color: 'text-pink-400',
    fields: {
      services: 'Serviços oferecidos',
      location: 'Localização e público local'
    }
  },
  local: {
    icon: Store,
    title: 'Negócio Local',
    color: 'text-green-400',
    fields: {
      services: 'Produtos/serviços principais',
      location: 'Área de cobertura e delivery'
    }
  },
  infoprodutor: {
    icon: GraduationCap,
    title: 'Infoprodutor',
    color: 'text-purple-400',
    fields: {
      productType: 'Tipo de produto digital',
      services: 'Formato do conteúdo (curso, ebook, mentoria)'
    }
  }
};

const channelOptions = [
  'Meta Ads (Facebook/Instagram)',
  'Google Ads',
  'TikTok Ads',
  'YouTube Ads',
  'WhatsApp Business',
  'E-mail Marketing',
  'SEO/Blog',
  'Influenciadores',
  'Parcerias',
  'Indicações'
];

export default function Briefings() {
  const { toast } = useToast();
  const [briefings, setBriefings] = useState<BriefingData[]>([]);
  const [currentBriefing, setCurrentBriefing] = useState<BriefingData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const steps = [
    { title: 'Informações Básicas', icon: Building2 },
    { title: 'Análise de Negócio', icon: Target },
    { title: 'Persona & Mercado', icon: Users },
    { title: 'Oferta & Estratégia', icon: Gift },
    { title: 'Canais & Assets', icon: Megaphone },
    { title: 'Revisão & Finalização', icon: Check }
  ];

  const createNewBriefing = (niche: keyof typeof nicheConfig) => {
    const newBriefing: BriefingData = {
      id: Date.now().toString(),
      clientName: '',
      niche,
      businessName: '',
      contactInfo: '',
      pains: '',
      objectives: '',
      persona: '',
      differentials: '',
      competitors: '',
      mainOffer: '',
      secondaryOffers: '',
      channels: [],
      currentAssets: '',
      restrictions: '',
      createdAt: new Date().toISOString(),
      status: 'Rascunho'
    };
    
    setCurrentBriefing(newBriefing);
    setCurrentStep(0);
    setIsCreating(true);
  };

  const saveBriefing = () => {
    if (!currentBriefing) return;
    
    const existingIndex = briefings.findIndex(b => b.id === currentBriefing.id);
    if (existingIndex >= 0) {
      const updated = [...briefings];
      updated[existingIndex] = currentBriefing;
      setBriefings(updated);
    } else {
      setBriefings([...briefings, currentBriefing]);
    }
    
    toast({
      title: "Briefing salvo!",
      description: `${currentBriefing.businessName || 'Briefing'} foi salvo com sucesso.`
    });
  };

  const finalizeBriefing = () => {
    if (!currentBriefing) return;
    
    const finalizedBriefing = {
      ...currentBriefing,
      status: 'Finalizado' as const
    };
    
    const existingIndex = briefings.findIndex(b => b.id === currentBriefing.id);
    if (existingIndex >= 0) {
      const updated = [...briefings];
      updated[existingIndex] = finalizedBriefing;
      setBriefings(updated);
    } else {
      setBriefings([...briefings, finalizedBriefing]);
    }
    
    setCurrentBriefing(null);
    setIsCreating(false);
    
    toast({
      title: "Briefing finalizado!",
      description: "Documento pronto para aprovação e implementação."
    });
  };

  const updateBriefing = (updates: Partial<BriefingData>) => {
    if (!currentBriefing) return;
    setCurrentBriefing({ ...currentBriefing, ...updates });
  };

  const toggleChannel = (channel: string) => {
    if (!currentBriefing) return;
    const channels = currentBriefing.channels.includes(channel)
      ? currentBriefing.channels.filter(c => c !== channel)
      : [...currentBriefing.channels, channel];
    updateBriefing({ channels });
  };

  const exportBriefingPDF = (briefing: BriefingData) => {
    // Simulação de export PDF
    toast({
      title: "PDF gerado!",
      description: "Documento de briefing baixado com sucesso."
    });
  };

  const exportBriefingJSON = (briefing: BriefingData) => {
    const dataStr = JSON.stringify(briefing, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `briefing-${briefing.businessName || briefing.id}.json`;
    link.click();
    
    toast({
      title: "JSON exportado!",
      description: "Dados do briefing baixados em JSON."
    });
  };

  if (isCreating && currentBriefing) {
    const config = nicheConfig[currentBriefing.niche];
    const IconComponent = config.icon;

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCreating(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <IconComponent className={`h-6 w-6 ${config.color}`} />
                <h1 className="text-2xl font-bold">Briefing - {config.title}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveBriefing}>
                Salvar Rascunho
              </Button>
              {currentStep === steps.length - 1 && (
                <Button onClick={finalizeBriefing}>
                  Finalizar Briefing
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-muted-foreground/20 text-muted-foreground'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-muted-foreground/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 0: Informações Básicas */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Nome do Cliente</Label>
                      <Input
                        id="clientName"
                        value={currentBriefing.clientName}
                        onChange={(e) => updateBriefing({ clientName: e.target.value })}
                        placeholder="João Silva"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessName">Nome do Negócio</Label>
                      <Input
                        id="businessName"
                        value={currentBriefing.businessName}
                        onChange={(e) => updateBriefing({ businessName: e.target.value })}
                        placeholder="Clínica Bella Vita"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contactInfo">Informações de Contato</Label>
                    <Textarea
                      id="contactInfo"
                      value={currentBriefing.contactInfo}
                      onChange={(e) => updateBriefing({ contactInfo: e.target.value })}
                      placeholder="E-mail, telefone, endereço..."
                      rows={3}
                    />
                  </div>

                  {config.fields.services && (
                    <div>
                      <Label htmlFor="services">{config.fields.services}</Label>
                      <Textarea
                        id="services"
                        value={currentBriefing.services || ''}
                        onChange={(e) => updateBriefing({ services: e.target.value })}
                        placeholder="Descreva os principais serviços oferecidos..."
                        rows={3}
                      />
                    </div>
                  )}

                  {(config.fields as any).location && currentBriefing.niche !== 'infoprodutor' && (
                    <div>
                      <Label htmlFor="location">{(config.fields as any).location}</Label>
                      <Input
                        id="location"
                        value={currentBriefing.location || ''}
                        onChange={(e) => updateBriefing({ location: e.target.value })}
                        placeholder="São Paulo - SP, raio de 10km"
                      />
                    </div>
                  )}

                  {currentBriefing.niche === 'infoprodutor' && (
                    <div>
                      <Label htmlFor="productType">Tipo de Produto Digital</Label>
                      <Input
                        id="productType"
                        value={currentBriefing.productType || ''}
                        onChange={(e) => updateBriefing({ productType: e.target.value })}
                        placeholder="Curso online, Ebook, Mentoria, etc."
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Análise de Negócio */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pains">Principais Dores do Cliente</Label>
                    <Textarea
                      id="pains"
                      value={currentBriefing.pains}
                      onChange={(e) => updateBriefing({ pains: e.target.value })}
                      placeholder="Quais problemas o cliente enfrenta? Ex: baixo faturamento, poucos leads, concorrência..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="objectives">Objetivos Principais</Label>
                    <Textarea
                      id="objectives"
                      value={currentBriefing.objectives}
                      onChange={(e) => updateBriefing({ objectives: e.target.value })}
                      placeholder="O que o cliente quer alcançar? Ex: 50 leads/mês, R$ 100k de faturamento..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Persona & Mercado */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="persona">Persona Ideal</Label>
                    <Textarea
                      id="persona"
                      value={currentBriefing.persona}
                      onChange={(e) => updateBriefing({ persona: e.target.value })}
                      placeholder="Descreva o cliente ideal: idade, gênero, renda, dores, desejos, comportamento..."
                      rows={5}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="competitors">Principais Concorrentes</Label>
                    <Textarea
                      id="competitors"
                      value={currentBriefing.competitors}
                      onChange={(e) => updateBriefing({ competitors: e.target.value })}
                      placeholder="Quem são os concorrentes diretos? Como eles se posicionam? Pontos fracos?"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="differentials">Diferenciais Competitivos</Label>
                    <Textarea
                      id="differentials"
                      value={currentBriefing.differentials}
                      onChange={(e) => updateBriefing({ differentials: e.target.value })}
                      placeholder="O que torna este negócio único? Vantagens sobre a concorrência..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Oferta & Estratégia */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mainOffer">Oferta Principal</Label>
                    <Textarea
                      id="mainOffer"
                      value={currentBriefing.mainOffer}
                      onChange={(e) => updateBriefing({ mainOffer: e.target.value })}
                      placeholder="Qual a oferta irresistível? Preço, benefícios, garantias, bônus..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryOffers">Ofertas Secundárias</Label>
                    <Textarea
                      id="secondaryOffers"
                      value={currentBriefing.secondaryOffers}
                      onChange={(e) => updateBriefing({ secondaryOffers: e.target.value })}
                      placeholder="Upsells, cross-sells, programas de fidelidade..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Canais & Assets */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label>Canais de Aquisição</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {channelOptions.map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={channel}
                            checked={currentBriefing.channels.includes(channel)}
                            onChange={() => toggleChannel(channel)}
                            className="rounded"
                          />
                          <Label htmlFor={channel} className="text-sm">{channel}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="currentAssets">Assets Atuais</Label>
                    <Textarea
                      id="currentAssets"
                      value={currentBriefing.currentAssets}
                      onChange={(e) => updateBriefing({ currentAssets: e.target.value })}
                      placeholder="Site, redes sociais, materiais gráficos, fotos, vídeos existentes..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="restrictions">Restrições e Observações</Label>
                    <Textarea
                      id="restrictions"
                      value={currentBriefing.restrictions}
                      onChange={(e) => updateBriefing({ restrictions: e.target.value })}
                      placeholder="Limitações de orçamento, regulamentações, preferências específicas..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Revisão */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">Resumo do Briefing</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Cliente:</strong> {currentBriefing.clientName}
                      </div>
                      <div>
                        <strong>Negócio:</strong> {currentBriefing.businessName}
                      </div>
                      <div className="col-span-2">
                        <strong>Nicho:</strong> {config.title}
                      </div>
                      <div className="col-span-2">
                        <strong>Canais Selecionados:</strong> {currentBriefing.channels.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-semibold">Checklist Técnico</h4>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Configurar Google Analytics 4</li>
                      <li>• Instalar Meta Pixel</li>
                      <li>• Configurar Google Tag Manager</li>
                      <li>• Criar UTMs para campanhas</li>
                      <li>• Configurar eventos de conversão</li>
                      <li>• Implementar tracking de telefone</li>
                      <li>• Configurar remarketing audiences</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={finalizeBriefing} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Finalizar Briefing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Briefings</h1>
          <p className="text-muted-foreground">Capture informações estratégicas por nicho de mercado</p>
        </div>
      </div>

      {briefings.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum briefing criado</h3>
          <p className="text-muted-foreground mb-6">Escolha um nicho para começar seu primeiro briefing</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {Object.entries(nicheConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <Card 
                  key={key} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => createNewBriefing(key as keyof typeof nicheConfig)}
                >
                  <CardContent className="p-6 text-center">
                    <IconComponent className={`h-8 w-8 mx-auto mb-3 ${config.color}`} />
                    <h3 className="font-semibold">{config.title}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {Object.entries(nicheConfig).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => createNewBriefing(key as keyof typeof nicheConfig)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <IconComponent className="h-4 w-4" />
                    {config.title}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            {briefings.map((briefing) => {
              const config = nicheConfig[briefing.niche];
              const IconComponent = config.icon;
              
              return (
                <Card key={briefing.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${config.color}`} />
                        <div>
                          <h3 className="font-semibold">{briefing.businessName || 'Sem nome'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {briefing.clientName} • {config.title}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          briefing.status === 'Aprovado' ? 'default' :
                          briefing.status === 'Finalizado' ? 'outline' : 'secondary'
                        }>
                          {briefing.status}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportBriefingPDF(briefing)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportBriefingJSON(briefing)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentBriefing(briefing);
                            setCurrentStep(0);
                            setIsCreating(true);
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}