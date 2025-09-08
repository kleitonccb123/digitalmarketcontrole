import { useState } from 'react';
import { useAppStore, type Audit } from '@/store/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Search, 
  Plus, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  BarChart3,
  Globe,
  Zap,
  Palette,
  Settings,
  Users,
  Filter,
  Download,
  CalendarIcon,
  CalendarDays
} from 'lucide-react';

const Auditorias = () => {
  const { audits, addAudit, updateAudit } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAudit, setNewAudit] = useState<Partial<Audit>>({
    type: 'SEO',
    status: 'Agendado',
    priority: 'Média'
  });
  const [dueDate, setDueDate] = useState<Date>();

  // Filtrar auditorias
  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesType = typeFilter === 'all' || audit.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Estatísticas
  const totalAudits = audits.length;
  const completedAudits = audits.filter(a => a.status === 'Concluído').length;
  const inProgressAudits = audits.filter(a => a.status === 'Em Análise').length;
  const pendingAudits = audits.filter(a => a.status === 'Agendado').length;
  const averageScore = audits.filter(a => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / audits.filter(a => a.score).length || 0;

  const handleCreateAudit = () => {
    if (newAudit.website && dueDate) {
      addAudit({
        ...newAudit,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
      } as Omit<Audit, 'id' | 'createdAt'>);
      
      setNewAudit({
        type: 'SEO',
        status: 'Agendado',
        priority: 'Média'
      });
      setDueDate(undefined);
      setIsCreateModalOpen(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'Em Análise': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'Entregue': return <FileText className="h-4 w-4 text-blue-400" />;
      default: return <CalendarDays className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SEO': return <Search className="h-4 w-4" />;
      case 'Performance': return <Zap className="h-4 w-4" />;
      case 'UX/UI': return <Palette className="h-4 w-4" />;
      case 'Técnico': return <Settings className="h-4 w-4" />;
      case 'Concorrência': return <Users className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'destructive';
      case 'Média': return 'secondary';
      case 'Baixa': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Auditorias</h1>
          <p className="text-muted-foreground">Gerencie auditorias de websites e relatórios</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Auditoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Auditoria</DialogTitle>
              <DialogDescription>
                Configure uma nova auditoria para análise completa do website.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    placeholder="exemplo.com.br"
                    value={newAudit.website || ''}
                    onChange={(e) => setNewAudit({ ...newAudit, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client"
                    placeholder="Nome do cliente"
                    value={newAudit.client || ''}
                    onChange={(e) => setNewAudit({ ...newAudit, client: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Auditoria</Label>
                  <Select
                    value={newAudit.type}
                    onValueChange={(value) => setNewAudit({ ...newAudit, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEO">SEO</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="UX/UI">UX/UI</SelectItem>
                      <SelectItem value="Técnico">Técnico</SelectItem>
                      <SelectItem value="Concorrência">Concorrência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select
                    value={newAudit.priority}
                    onValueChange={(value) => setNewAudit({ ...newAudit, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prazo de Entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações sobre a auditoria..."
                  value={newAudit.notes || ''}
                  onChange={(e) => setNewAudit({ ...newAudit, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAudit} className="flex-1 bg-gradient-primary hover:opacity-90">
                  Criar Auditoria
                </Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-subtle border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalAudits}</div>
            <p className="text-xs text-muted-foreground">auditorias criadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedAudits}</div>
            <p className="text-xs text-muted-foreground">finalizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Análise</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{inProgressAudits}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agendadas</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingAudits}</div>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{Math.round(averageScore) || 0}</div>
            <p className="text-xs text-muted-foreground">pontuação média</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-gradient-subtle border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por website ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-background/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Agendado">Agendado</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-background/50">
                <BarChart3 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="SEO">SEO</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="UX/UI">UX/UI</SelectItem>
                <SelectItem value="Técnico">Técnico</SelectItem>
                <SelectItem value="Concorrência">Concorrência</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="bg-background/50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Auditorias */}
      <div className="grid gap-4">
        {filteredAudits.length === 0 ? (
          <Card className="bg-gradient-subtle border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma auditoria encontrada</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {audits.length === 0 
                  ? "Crie sua primeira auditoria para começar a analisar websites."
                  : "Ajuste os filtros ou termos de busca para encontrar auditorias específicas."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAudits.map((audit) => (
            <Card key={audit.id} className="bg-gradient-subtle border-border/50 hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(audit.type)}
                        <h3 className="text-lg font-semibold text-foreground">{audit.website}</h3>
                      </div>
                      <Badge variant={getPriorityColor(audit.priority) as any}>
                        {audit.priority}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {getStatusIcon(audit.status)}
                        <span>{audit.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="font-medium text-accent">{audit.type}</span>
                      {audit.client && <span>Cliente: {audit.client}</span>}
                      <span>Prazo: {format(new Date(audit.dueDate), "dd/MM/yyyy")}</span>
                    </div>

                    {audit.score && (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">Score</span>
                            <span className="text-sm font-bold text-accent">{audit.score}/100</span>
                          </div>
                          <Progress value={audit.score} className="h-2" />
                        </div>
                        {audit.issues && (
                          <div className="flex items-center gap-1 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span className="text-muted-foreground">{audit.issues} issues</span>
                          </div>
                        )}
                        {audit.opportunities && (
                          <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-muted-foreground">{audit.opportunities} oportunidades</span>
                          </div>
                        )}
                      </div>
                    )}

                    {audit.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        {audit.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {audit.reportUrl && (
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Relatório
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Auditorias;