import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Download, Copy, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Module {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  hours: number;
  category: string;
}

interface Proposal {
  id: string;
  clientName: string;
  modules: Module[];
  discount: number;
  discountType: 'percent' | 'fixed';
  taxes: number;
  validity: number;
  deadline: number;
  totalCost: number;
  finalPrice: number;
  createdAt: string;
}

const availableModules: Module[] = [
  {
    id: 'lp',
    name: 'Landing Page',
    description: 'LP responsiva com formulário e integrações',
    basePrice: 2500,
    hours: 40,
    category: 'Desenvolvimento'
  },
  {
    id: 'site',
    name: 'Site Institucional',
    description: 'Site completo até 8 páginas',
    basePrice: 4500,
    hours: 80,
    category: 'Desenvolvimento'
  },
  {
    id: 'seo',
    name: 'SEO Local',
    description: 'Otimização para Google Meu Negócio e busca local',
    basePrice: 1200,
    hours: 20,
    category: 'Marketing'
  },
  {
    id: 'trafego',
    name: 'Gestão de Tráfego',
    description: 'Campanhas Meta/Google por 3 meses',
    basePrice: 3000,
    hours: 60,
    category: 'Marketing'
  },
  {
    id: 'conteudo',
    name: 'Conteúdo (10/mês)',
    description: 'Criação de conteúdo para redes sociais',
    basePrice: 1500,
    hours: 30,
    category: 'Conteúdo'
  },
  {
    id: 'whatsapp',
    name: 'Automação WhatsApp',
    description: 'Chatbot e funis automatizados',
    basePrice: 2000,
    hours: 35,
    category: 'Automação'
  },
  {
    id: 'dashboard',
    name: 'Dashboard Métricas',
    description: 'Painel personalizado de KPIs',
    basePrice: 1800,
    hours: 25,
    category: 'Analytics'
  },
  {
    id: 'reunioes',
    name: 'Reuniões Mensais',
    description: 'Acompanhamento estratégico mensal',
    basePrice: 800,
    hours: 10,
    category: 'Consultoria'
  }
];

const templates = [
  {
    id: 'digital-on',
    name: 'Digital On',
    description: 'Pacote básico para negócios iniciantes',
    modules: ['lp', 'seo', 'conteudo']
  },
  {
    id: 'intermediario',
    name: 'Intermediário',
    description: 'LP + LinkHub + Typebot',
    modules: ['lp', 'whatsapp', 'trafego']
  },
  {
    id: 'digital-max',
    name: 'Digital Max',
    description: 'Solução completa para crescimento',
    modules: ['site', 'trafego', 'conteudo', 'dashboard', 'reunioes']
  }
];

export default function Orcamentos() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [taxes, setTaxes] = useState(20);
  const [validity, setValidity] = useState(30);
  const [deadline, setDeadline] = useState(4);
  const { toast } = useToast();

  const calculateTotals = () => {
    const selectedModuleData = availableModules.filter(m => selectedModules.includes(m.id));
    const subtotal = selectedModuleData.reduce((sum, m) => sum + m.basePrice, 0);
    const totalHours = selectedModuleData.reduce((sum, m) => sum + m.hours, 0);
    
    let discountAmount = 0;
    if (discountType === 'percent') {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }
    
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxes) / 100;
    const finalPrice = afterDiscount + taxAmount;
    
    return {
      subtotal,
      totalHours,
      discountAmount,
      afterDiscount,
      taxAmount,
      finalPrice
    };
  };

  const totals = calculateTotals();

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedModules(template.modules);
      toast({
        title: 'Template aplicado',
        description: `Template "${template.name}" foi aplicado com sucesso`
      });
    }
  };

  const generateProposal = () => {
    if (!clientName.trim() || selectedModules.length === 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome do cliente e selecione pelo menos um módulo',
        variant: 'destructive'
      });
      return;
    }

    const newProposal: Proposal = {
      id: Date.now().toString(),
      clientName,
      modules: availableModules.filter(m => selectedModules.includes(m.id)),
      discount,
      discountType,
      taxes,
      validity,
      deadline,
      totalCost: totals.subtotal,
      finalPrice: totals.finalPrice,
      createdAt: new Date().toISOString()
    };

    setProposals([...proposals, newProposal]);
    
    // Reset form
    setClientName('');
    setSelectedModules([]);
    setDiscount(0);
    
    toast({
      title: 'Proposta gerada',
      description: `Proposta para ${clientName} criada com sucesso`
    });
  };

  const exportProposalText = (proposal: Proposal) => {
    const text = `
PROPOSTA COMERCIAL - DIGITAL MARKET

Cliente: ${proposal.clientName}
Data: ${new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
Validade: ${proposal.validity} dias

ESCOPO DOS SERVIÇOS:
${proposal.modules.map(m => `• ${m.name} - ${m.description}`).join('\n')}

CRONOGRAMA:
Prazo de entrega: ${proposal.deadline} semanas
Total de horas: ${proposal.modules.reduce((sum, m) => sum + m.hours, 0)}h

INVESTIMENTO:
Valor dos serviços: R$ ${proposal.totalCost.toFixed(2)}
${proposal.discount > 0 ? `Desconto: R$ ${(proposal.discountType === 'percent' ? (proposal.totalCost * proposal.discount) / 100 : proposal.discount).toFixed(2)}\n` : ''}
Impostos (${proposal.taxes}%): R$ ${((proposal.finalPrice - proposal.totalCost + (proposal.discountType === 'percent' ? (proposal.totalCost * proposal.discount) / 100 : proposal.discount)) * proposal.taxes / (100 + proposal.taxes)).toFixed(2)}
VALOR FINAL: R$ ${proposal.finalPrice.toFixed(2)}

Condições de pagamento: 50% entrada + 50% entrega
    `.trim();

    navigator.clipboard.writeText(text);
    toast({
      title: 'Proposta copiada',
      description: 'Texto da proposta copiado para a área de transferência'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orçamentos & Propostas</h1>
          <p className="text-muted-foreground">Geração de propostas comerciais personalizadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Configurar Proposta
              </CardTitle>
              <CardDescription>
                Selecione módulos e configure parâmetros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Digite o nome do cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Templates Rápidos</Label>
                <div className="flex flex-wrap gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template.id)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Módulos Disponíveis</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableModules.map((module) => (
                    <div
                      key={module.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedModules.includes(module.id)
                          ? 'border-primary bg-gradient-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleModuleToggle(module.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline">{module.category}</Badge>
                            <span className="text-sm font-medium">R$ {module.basePrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={discountType} onValueChange={(value: 'percent' | 'fixed') => setDiscountType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="fixed">R$</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxes">Impostos (%)</Label>
                  <Input
                    id="taxes"
                    type="number"
                    value={taxes}
                    onChange={(e) => setTaxes(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo (semanas)</Label>
                  <Input
                    id="deadline"
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>R$ {totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto:</span>
                  <span>-R$ {totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Impostos ({taxes}%):</span>
                <span>R$ {totals.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Final:</span>
                  <span className="text-primary">R$ {totals.finalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Total de horas: {totals.totalHours}h
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={generateProposal}
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={!clientName.trim() || selectedModules.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Gerar Proposta
          </Button>
        </div>
      </div>

      {/* Lista de Propostas */}
      {proposals.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Propostas Geradas</CardTitle>
            <CardDescription>
              Histórico de propostas criadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-subtle">
                  <div>
                    <h4 className="font-medium">{proposal.clientName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {proposal.modules.length} módulos • R$ {proposal.finalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportProposalText(proposal)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}