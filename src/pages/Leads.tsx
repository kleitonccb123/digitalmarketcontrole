import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone,
  MessageSquare,
  Download,
  Upload,
  TrendingUp,
  Target
} from 'lucide-react';
import { useAppStore, type Lead } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  'Novo': 'bg-blue-500',
  'Qualificação': 'bg-yellow-500',
  'Call': 'bg-orange-500',
  'Proposta': 'bg-purple-500',
  'Fechado - Ganho': 'bg-green-500',
  'Fechado - Perdido': 'bg-red-500'
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600 bg-green-100';
  if (score >= 40) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

const getScoreLabel = (score: number) => {
  if (score >= 70) return 'Quente';
  if (score >= 40) return 'Morno';
  return 'Frio';
};

export default function Leads() {
  const { leads, addLead, updateLead, loadDemoData } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    origin: '',
    score: 50,
    status: 'Novo' as Lead['status'],
    notes: ''
  });
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm) ||
                           lead.origin.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      let matchesScore = true;
      if (scoreFilter === 'hot') matchesScore = lead.score >= 70;
      else if (scoreFilter === 'warm') matchesScore = lead.score >= 40 && lead.score < 70;
      else if (scoreFilter === 'cold') matchesScore = lead.score < 40;
      
      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [leads, searchTerm, statusFilter, scoreFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter(l => l.score >= 70).length;
    const converted = leads.filter(l => l.status === 'Fechado - Ganho').length;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    
    return { total, hot, converted, conversionRate };
  }, [leads]);

  const handleAddLead = () => {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome e telefone',
        variant: 'destructive'
      });
      return;
    }

    addLead(newLead);
    setNewLead({
      name: '',
      phone: '',
      origin: '',
      score: 50,
      status: 'Novo',
      notes: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: 'Lead adicionado',
      description: 'Novo lead foi adicionado com sucesso'
    });
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    updateLead(leadId, updates);
    toast({
      title: 'Lead atualizado',
      description: 'Informações do lead foram atualizadas'
    });
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const exportLeads = () => {
    const csvContent = [
      'Nome,Telefone,Origem,Score,Status,Data,Notas',
      ...filteredLeads.map(lead => [
        lead.name,
        lead.phone,
        lead.origin,
        lead.score,
        lead.status,
        new Date(lead.createdAt).toLocaleDateString('pt-BR'),
        lead.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: 'CSV exportado',
      description: 'Lista de leads foi exportada com sucesso'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads & Scoring</h1>
          <p className="text-muted-foreground">Gestão e qualificação de leads</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {leads.length === 0 && (
            <Button onClick={loadDemoData} variant="outline">
              Carregar Demo
            </Button>
          )}
          
          <Button onClick={exportLeads} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin">Origem</Label>
                  <Select value={newLead.origin} onValueChange={(value) => setNewLead({...newLead, origin: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta Ads</SelectItem>
                      <SelectItem value="Google">Google Ads</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="score">Score (0-100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={newLead.score}
                    onChange={(e) => setNewLead({...newLead, score: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Notas sobre o lead..."
                    value={newLead.notes}
                    onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleAddLead} className="w-full">
                  Adicionar Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Quentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.hot}</div>
            <p className="text-xs text-muted-foreground">Score ≥ 70</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Qualificação">Qualificação</SelectItem>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Proposta">Proposta</SelectItem>
                <SelectItem value="Fechado - Ganho">Fechado - Ganho</SelectItem>
                <SelectItem value="Fechado - Perdido">Fechado - Perdido</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os scores</SelectItem>
                <SelectItem value="hot">Quente (70+)</SelectItem>
                <SelectItem value="warm">Morno (40-69)</SelectItem>
                <SelectItem value="cold">Frio (0-39)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pipeline de Leads</CardTitle>
          <CardDescription>
            {filteredLeads.length} leads encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLeads.length > 0 ? (
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-subtle">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{lead.name}</h4>
                        <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      </div>
                      
                      <Badge variant="outline">{lead.origin}</Badge>
                      
                      <Badge className={getScoreColor(lead.score)}>
                        {lead.score} • {getScoreLabel(lead.score)}
                      </Badge>
                    </div>
                    
                    {lead.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{lead.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleUpdateLead(lead.id, { status: value as Lead['status'] })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Qualificação">Qualificação</SelectItem>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Proposta">Proposta</SelectItem>
                        <SelectItem value="Fechado - Ganho">Fechado - Ganho</SelectItem>
                        <SelectItem value="Fechado - Perdido">Fechado - Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openWhatsApp(lead.phone)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {leads.length === 0 ? 'Nenhum lead cadastrado' : 'Nenhum lead encontrado com os filtros aplicados'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}