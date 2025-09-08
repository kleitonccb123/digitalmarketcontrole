import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Video, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Play,
  Pause,
  Archive,
  Filter,
  Download,
  Upload,
  Loader2
} from 'lucide-react';
import { useCreatives, Creative, CreateCreativeInput } from '@/hooks/useCreatives';

export default function Criativos() {
  const { creatives, loading, addCreative, loadDemoData } = useCreatives();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCreative, setNewCreative] = useState<CreateCreativeInput>({
    name: '',
    angle: '',
    promise: '',
    hypothesis: '',
    status: 'Testando',
    notes: '',
    thumbnail: null
  });

  // Filtrar criativos
  const filteredCreatives = useMemo(() => {
    return creatives.filter(creative => {
      const matchesSearch = creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creative.angle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creative.promise.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || creative.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [creatives, searchTerm, statusFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = creatives.length;
    const testando = creatives.filter(c => c.status === 'Testando').length;
    const aprovados = creatives.filter(c => c.status === 'Aprovado').length;
    const pausados = creatives.filter(c => c.status === 'Pausado').length;
    const arquivados = creatives.filter(c => c.status === 'Arquivado').length;

    return { total, testando, aprovados, pausados, arquivados };
  }, [creatives]);

  const handleAddCreative = async () => {
    if (!newCreative.name || !newCreative.angle || !newCreative.promise) {
      return;
    }

    try {
      setIsSubmitting(true);
      await addCreative(newCreative);
      setNewCreative({
        name: '',
        angle: '',
        promise: '',
        hypothesis: '',
        status: 'Testando',
        notes: '',
        thumbnail: null
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Creative['status']) => {
    const variants = {
      'Testando': 'default',
      'Aprovado': 'secondary',
      'Pausado': 'outline',
      'Arquivado': 'destructive'
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getStatusIcon = (status: Creative['status']) => {
    switch (status) {
      case 'Testando': return <Play className="h-4 w-4" />;
      case 'Aprovado': return <TrendingUp className="h-4 w-4" />;
      case 'Pausado': return <Pause className="h-4 w-4" />;
      case 'Arquivado': return <Archive className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Criativos & Testes</h1>
          <p className="text-muted-foreground">Gerencie seus criativos e testes A/B</p>
        </div>
        
        <div className="flex gap-3">
          {creatives.length === 0 && (
            <Button onClick={loadDemoData} variant="outline">
              Carregar Dados Demo
            </Button>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Criativo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Criativo</DialogTitle>
                <DialogDescription>
                  Cadastre um novo criativo para teste
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Criativo *</Label>
                  <Input
                    id="name"
                    value={newCreative.name}
                    onChange={(e) => setNewCreative({ ...newCreative, name: e.target.value })}
                    placeholder="Ex: Vídeo 30s - Transformação"
                  />
                </div>
                
                <div>
                  <Label htmlFor="angle">Ângulo *</Label>
                  <Input
                    id="angle"
                    value={newCreative.angle}
                    onChange={(e) => setNewCreative({ ...newCreative, angle: e.target.value })}
                    placeholder="Ex: Antes e Depois"
                  />
                </div>
                
                <div>
                  <Label htmlFor="promise">Promessa *</Label>
                  <Input
                    id="promise"
                    value={newCreative.promise}
                    onChange={(e) => setNewCreative({ ...newCreative, promise: e.target.value })}
                    placeholder="Ex: 30 dias para seu melhor resultado"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hypothesis">Hipótese</Label>
                  <Textarea
                    id="hypothesis"
                    value={newCreative.hypothesis}
                    onChange={(e) => setNewCreative({ ...newCreative, hypothesis: e.target.value })}
                    placeholder="Ex: Transformação visual gera mais conversões"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newCreative.status} onValueChange={(value: Creative['status']) => setNewCreative({ ...newCreative, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Testando">Testando</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Pausado">Pausado</SelectItem>
                      <SelectItem value="Arquivado">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={newCreative.notes}
                    onChange={(e) => setNewCreative({ ...newCreative, notes: e.target.value })}
                    placeholder="Notas adicionais sobre o criativo"
                    rows={2}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCreative} className="bg-gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Adicionar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testando</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.testando}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.aprovados}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pausados</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.pausados}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.arquivados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar criativos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Testando">Testando</SelectItem>
            <SelectItem value="Aprovado">Aprovado</SelectItem>
            <SelectItem value="Pausado">Pausado</SelectItem>
            <SelectItem value="Arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
          <TabsTrigger value="performance">Performance & Testes</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando criativos...</span>
            </div>
          ) : filteredCreatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreatives.map((creative) => (
                <Card key={creative.id} className="shadow-card hover:shadow-glow transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(creative.status)}
                        <CardTitle className="text-lg">{creative.name}</CardTitle>
                      </div>
                      {getStatusBadge(creative.status)}
                    </div>
                    <CardDescription>{creative.angle}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center">
                      {creative.thumbnail ? (
                        <img 
                          src={creative.thumbnail} 
                          alt={creative.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Sem thumbnail</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Promessa</h4>
                        <p className="text-sm">{creative.promise}</p>
                      </div>
                      
                      {creative.hypothesis && (
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Hipótese</h4>
                          <p className="text-sm">{creative.hypothesis}</p>
                        </div>
                      )}
                      
                      {creative.notes && (
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Observações</h4>
                          <p className="text-sm">{creative.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum criativo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros ou busca.'
                  : 'Comece adicionando seu primeiro criativo.'
                }
              </p>
              {creatives.length === 0 && (
                <Button onClick={loadDemoData} variant="outline">
                  Carregar Dados Demo
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Teste A/B em Andamento
                </CardTitle>
                <CardDescription>
                  Comparação de performance entre criativos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4" />
                  <p>Funcionalidade de testes A/B em desenvolvimento</p>
                  <p className="text-sm mt-2">Configure testes automatizados entre criativos</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Histórica
                </CardTitle>
                <CardDescription>
                  Métricas de conversão e engajamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Relatórios de performance em desenvolvimento</p>
                  <p className="text-sm mt-2">CTR, CPC, Conversões e mais métricas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Biblioteca de Assets</CardTitle>
              <CardDescription>
                Gerencie vídeos, imagens e outros recursos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Biblioteca de Assets</h3>
                <p className="mb-4">
                  Organize seus vídeos, imagens e recursos de criativos
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Assets
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}