import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

// Types
interface MetaCampaignData {
  id: string;
  date: string;
  campaignName: string;
  adSetName: string;
  adName: string;
  spend: number;
  impressions: number;
  reach?: number;
  clicks: number;
  uniqueClicks?: number;
  leads: number;
  purchases?: number;
  revenue?: number;
  frequency?: number;
  budget?: number;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
}

interface KPIs {
  ctr: number;
  cpc: number;
  cpm: number;
  cpl: number;
  cpa?: number;
  roas?: number;
  conversionRate?: number;
  ticketMedio?: number;
}

interface CampaignAnalysis extends MetaCampaignData {
  kpis: KPIs;
  status: 'healthy' | 'warning' | 'danger';
  issues: string[];
  pacing?: 'behind' | 'on-track' | 'ahead';
}

// Mock data for demo
const generateDemoData = (): MetaCampaignData[] => [
  {
    id: '1',
    date: '2025-01-06',
    campaignName: 'Prospecção DM - Frio',
    adSetName: 'LOOK 1%',
    adName: 'Vídeo 30s A',
    spend: 350.50,
    impressions: 120000,
    clicks: 1400,
    leads: 95,
    purchases: 7,
    revenue: 4200.00,
    frequency: 2.8,
    budget: 400,
    utmCampaign: 'prospeccao-dm',
    utmSource: 'meta',
    utmMedium: 'social'
  },
  {
    id: '2',
    date: '2025-01-06',
    campaignName: 'Remarketing DM - 7d',
    adSetName: 'Engajados',
    adName: 'Carrossel B',
    spend: 180.00,
    impressions: 38000,
    clicks: 620,
    leads: 110,
    purchases: 9,
    revenue: 5600.00,
    frequency: 3.5,
    budget: 200,
    utmCampaign: 'remarketing-dm',
    utmSource: 'meta',
    utmMedium: 'social'
  },
  {
    id: '3',
    date: '2025-01-06',
    campaignName: 'Lookalike DM - 5%',
    adSetName: 'LAL Compradores',
    adName: 'Static Feed',
    spend: 95.30,
    impressions: 45000,
    clicks: 280,
    leads: 32,
    purchases: 2,
    revenue: 1200.00,
    frequency: 4.2,
    budget: 100,
    utmCampaign: 'lookalike-dm',
    utmSource: 'meta',
    utmMedium: 'social'
  }
];

export default function MetaAnalyzer() {
  const [campaigns, setCampaigns] = useState<MetaCampaignData[]>(generateDemoData());
  const [analysis, setAnalysis] = useState<CampaignAnalysis[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState({
    ctr: 1.5,
    cpl: 50,
    cpa: 150,
    roas: 3.0
  });

  // Required column mappings
  const requiredMappings = {
    date: 'Data',
    campaignName: 'Nome da Campanha',
    adSetName: 'Nome do Conjunto',
    adName: 'Nome do Anúncio',
    spend: 'Valor Gasto',
    impressions: 'Impressões',
    clicks: 'Cliques no Link',
    leads: 'Leads'
  };

  const optionalMappings = {
    reach: 'Alcance',
    uniqueClicks: 'Cliques Únicos',
    purchases: 'Compras',
    revenue: 'Valor da Conversão',
    frequency: 'Frequência',
    budget: 'Orçamento Diário',
    utmCampaign: 'UTM Campaign',
    utmSource: 'UTM Source',
    utmMedium: 'UTM Medium'
  };

  // Calculate KPIs
  const calculateKPIs = (data: MetaCampaignData): KPIs => {
    const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
    const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;
    const cpm = data.impressions > 0 ? (data.spend / data.impressions) * 1000 : 0;
    const cpl = data.leads > 0 ? data.spend / data.leads : 0;
    const cpa = data.purchases && data.purchases > 0 ? data.spend / data.purchases : undefined;
    const roas = data.revenue && data.revenue > 0 ? data.revenue / data.spend : undefined;
    const conversionRate = data.leads > 0 && data.purchases ? (data.purchases / data.leads) * 100 : undefined;
    const ticketMedio = data.purchases && data.revenue && data.purchases > 0 ? data.revenue / data.purchases : undefined;

    return { ctr, cpc, cpm, cpl, cpa, roas, conversionRate, ticketMedio };
  };

  // Analyze campaign performance
  const analyzeCampaign = (data: MetaCampaignData): CampaignAnalysis => {
    const kpis = calculateKPIs(data);
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'danger' = 'healthy';

    // Check against benchmarks
    if (kpis.ctr < benchmarks.ctr) {
      issues.push('CTR abaixo da meta');
      status = 'warning';
    }
    if (kpis.cpl > benchmarks.cpl) {
      issues.push('CPL acima da meta');
      status = status === 'healthy' ? 'warning' : 'danger';
    }
    if (kpis.cpa && kpis.cpa > benchmarks.cpa) {
      issues.push('CPA acima da meta');
      status = 'danger';
    }
    if (kpis.roas && kpis.roas < benchmarks.roas) {
      issues.push('ROAS abaixo da meta');
      status = 'danger';
    }

    // Check for creative fatigue
    if (data.frequency && data.frequency > 3 && kpis.ctr < 1) {
      issues.push('Possível fadiga criativa');
      status = 'danger';
    }

    // Check budget pacing
    let pacing: 'behind' | 'on-track' | 'ahead' | undefined;
    if (data.budget) {
      const spendPercentage = (data.spend / data.budget) * 100;
      if (spendPercentage < 80) pacing = 'behind';
      else if (spendPercentage > 120) pacing = 'ahead';
      else pacing = 'on-track';
    }

    return { ...data, kpis, status, issues, pacing };
  };

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      preview: 5,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setCsvHeaders(Object.keys(results.data[0] as any));
          setCsvPreview(results.data as any[]);
          toast.success('Arquivo carregado com sucesso');
        }
      },
      error: (error) => {
        toast.error(`Erro ao ler arquivo: ${error.message}`);
      }
    });
  }, []);

  // Process CSV file
  const processCsvFile = useCallback(() => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const processedData: MetaCampaignData[] = (results.data as any[]).map((row, index) => {
            const processed: any = { id: `imported-${index}` };
            
            // Map required fields
            Object.entries(requiredMappings).forEach(([key, label]) => {
              const mappedColumn = mapping[key];
              if (mappedColumn && row[mappedColumn] !== undefined) {
                if (key === 'spend' || key === 'impressions' || key === 'clicks' || key === 'leads') {
                  processed[key] = parseFloat(String(row[mappedColumn]).replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                } else {
                  processed[key] = row[mappedColumn];
                }
              }
            });

            // Map optional fields
            Object.entries(optionalMappings).forEach(([key, label]) => {
              const mappedColumn = mapping[key];
              if (mappedColumn && row[mappedColumn] !== undefined) {
                if (key === 'reach' || key === 'uniqueClicks' || key === 'purchases' || key === 'revenue' || key === 'frequency' || key === 'budget') {
                  processed[key] = parseFloat(String(row[mappedColumn]).replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                } else {
                  processed[key] = row[mappedColumn];
                }
              }
            });

            return processed;
          }).filter(item => item.campaignName && item.spend > 0);

          setCampaigns(processedData);
          
          // Analyze campaigns
          const analyzed = processedData.map(analyzeCampaign);
          setAnalysis(analyzed);
          
          toast.success(`${processedData.length} campanhas importadas e analisadas`);
        }
      },
      error: (error) => {
        toast.error(`Erro ao processar arquivo: ${error.message}`);
      }
    });
  }, [selectedFile, mapping]);

  // Load demo data
  const loadDemoData = () => {
    const demo = generateDemoData();
    setCampaigns(demo);
    const analyzed = demo.map(analyzeCampaign);
    setAnalysis(analyzed);
    toast.success('Dados de demonstração carregados');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'danger': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meta CSV Analyzer</h1>
          <p className="text-muted-foreground mt-2">
            Importe CSVs do Meta Ads Manager e analise o desempenho das campanhas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDemoData}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Dados Demo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Importar CSV</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload do CSV
              </CardTitle>
              <CardDescription>
                Faça upload do CSV exportado do Meta Ads Manager
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>

              {csvPreview.length > 0 && (
                <>
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Arquivo carregado com {csvPreview.length} linhas de preview. 
                      Configure o mapeamento das colunas abaixo.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-3">Campos Obrigatórios</h3>
                      {Object.entries(requiredMappings).map(([key, label]) => (
                        <div key={key} className="mb-3">
                          <Label htmlFor={key}>{label}</Label>
                          <Select onValueChange={(value) => setMapping(prev => ({ ...prev, [key]: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a coluna" />
                            </SelectTrigger>
                            <SelectContent>
                              {csvHeaders.map(header => (
                                <SelectItem key={header} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Campos Opcionais</h3>
                      {Object.entries(optionalMappings).map(([key, label]) => (
                        <div key={key} className="mb-3">
                          <Label htmlFor={key}>{label}</Label>
                          <Select onValueChange={(value) => setMapping(prev => ({ ...prev, [key]: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a coluna" />
                            </SelectTrigger>
                            <SelectContent>
                              {csvHeaders.map(header => (
                                <SelectItem key={header} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={processCsvFile}
                    className="w-full"
                    disabled={!Object.keys(requiredMappings).every(key => mapping[key])}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Processar e Analisar Dados
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {analysis.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Importe um CSV ou carregue dados demo para ver a análise
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* KPIs Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Total Investido</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {formatCurrency(analysis.reduce((sum, camp) => sum + camp.spend, 0))}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Total Leads</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {analysis.reduce((sum, camp) => sum + camp.leads, 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">CPL Médio</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {formatCurrency(analysis.reduce((sum, camp) => sum + camp.kpis.cpl, 0) / analysis.length)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-info" />
                      <span className="text-sm font-medium">ROAS Médio</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {(analysis.filter(c => c.kpis.roas).reduce((sum, camp) => sum + (camp.kpis.roas || 0), 0) / analysis.filter(c => c.kpis.roas).length || 0).toFixed(2)}x
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Analysis Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise por Campanha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Campanha</th>
                          <th className="text-right p-2">Investido</th>
                          <th className="text-right p-2">Leads</th>
                          <th className="text-right p-2">CPL</th>
                          <th className="text-right p-2">CTR</th>
                          <th className="text-right p-2">ROAS</th>
                          <th className="text-left p-2">Problemas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.map((campaign) => (
                          <tr key={campaign.id} className="border-b">
                            <td className="p-2">
                              <div className={`flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                                {getStatusIcon(campaign.status)}
                              </div>
                            </td>
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{campaign.campaignName}</p>
                                <p className="text-sm text-muted-foreground">{campaign.adSetName}</p>
                              </div>
                            </td>
                            <td className="text-right p-2">{formatCurrency(campaign.spend)}</td>
                            <td className="text-right p-2">{campaign.leads}</td>
                            <td className="text-right p-2">{formatCurrency(campaign.kpis.cpl)}</td>
                            <td className="text-right p-2">{formatPercentage(campaign.kpis.ctr)}</td>
                            <td className="text-right p-2">
                              {campaign.kpis.roas ? `${campaign.kpis.roas.toFixed(2)}x` : '-'}
                            </td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {campaign.issues.map((issue, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {issue}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {analysis.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Analise campanhas primeiro para ver insights
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-success">🏆 Melhores Performances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis
                      .filter(c => c.status === 'healthy')
                      .sort((a, b) => (b.kpis.roas || 0) - (a.kpis.roas || 0))
                      .slice(0, 3)
                      .map((campaign) => (
                        <div key={campaign.id} className="p-3 bg-success/10 rounded-lg">
                          <p className="font-medium">{campaign.campaignName}</p>
                          <p className="text-sm text-muted-foreground">
                            ROAS: {campaign.kpis.roas?.toFixed(2)}x | CPL: {formatCurrency(campaign.kpis.cpl)}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Issues Found */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">⚠️ Problemas Identificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis
                      .filter(c => c.issues.length > 0)
                      .slice(0, 3)
                      .map((campaign) => (
                        <div key={campaign.id} className="p-3 bg-destructive/10 rounded-lg">
                          <p className="font-medium">{campaign.campaignName}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {campaign.issues.map((issue, idx) => (
                              <Badge key={idx} variant="destructive" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-info">💡 Recomendações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Otimizações Imediatas:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Pausar anúncios com frequência maior que 4 e CTR menor que 1%</li>
                        <li>Aumentar budget dos conjuntos com ROAS maior que 4x</li>
                        <li>Testar novos criativos em campanhas com fadiga</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Análises Futuras:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Comparar performance por dia da semana</li>
                        <li>Analisar decay de performance por idade do anúncio</li>
                        <li>Segmentar análise por dispositivo e placement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}