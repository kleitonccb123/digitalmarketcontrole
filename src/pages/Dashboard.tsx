import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export default function Dashboard() {
  const { leads, campaigns, projects, posts, loadDemoData } = useAppStore();

  // Calcular KPIs
  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    
    const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const ticketMedio = campaigns.reduce((sum, c) => sum + c.purchases, 0) > 0 
      ? totalRevenue / campaigns.reduce((sum, c) => sum + c.purchases, 0) 
      : 0;

    return {
      totalLeads,
      cpl,
      roas,
      ticketMedio,
      ctr
    };
  }, [leads, campaigns]);

  const hotLeads = leads.filter(l => l.score >= 70).length;
  const projectsInProgress = projects.filter(p => p.status === 'Em andamento').length;
  const postsApproved = posts.filter(p => p.status === 'Aprovado').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das operações</p>
        </div>
        
        {leads.length === 0 && (
          <Button onClick={loadDemoData} variant="outline">
            Carregar Dados Demo
          </Button>
        )}
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalLeads}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span>{hotLeads} leads quentes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPL Médio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {kpis.cpl.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 mr-1 text-green-500" />
              <span>Dentro da meta</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.roas.toFixed(2)}x
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span>+15% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {kpis.ticketMedio.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span>Crescimento estável</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximas Entregas
            </CardTitle>
            <CardDescription>
              Projetos e tarefas com prazo próximo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectsInProgress > 0 ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle">
                  <div>
                    <p className="font-medium">LP Clínica Renova</p>
                    <p className="text-sm text-muted-foreground">Entrega: Amanhã</p>
                  </div>
                  <Badge variant="secondary">Em andamento</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle">
                  <div>
                    <p className="font-medium">Campanha Academia Strong</p>
                    <p className="text-sm text-muted-foreground">Entrega: 3 dias</p>
                  </div>
                  <Badge variant="outline">Revisão</Badge>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma entrega próxima
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Status Geral
            </CardTitle>
            <CardDescription>
              Resumo das atividades em andamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Projetos ativos</span>
              <Badge variant="default">{projectsInProgress}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Posts aprovados</span>
              <Badge variant="secondary">{postsApproved}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Leads qualificados</span>
              <Badge variant="outline">{hotLeads}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">CTR médio</span>
              <Badge variant="default">{kpis.ctr.toFixed(2)}%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Campanhas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Top Campanhas por ROAS</CardTitle>
          <CardDescription>
            Campanhas com melhor retorno nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns
                .sort((a, b) => (b.revenue / b.spend) - (a.revenue / a.spend))
                .slice(0, 5)
                .map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Gasto: R$ {campaign.spend.toFixed(2)} • Receita: R$ {campaign.revenue.toFixed(2)}
                      </p>
                    </div>
                    <Badge className="bg-gradient-primary">
                      {(campaign.revenue / campaign.spend).toFixed(2)}x
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma campanha registrada ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}