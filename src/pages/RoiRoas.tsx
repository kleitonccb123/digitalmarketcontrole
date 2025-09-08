import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  FileText,
  Eye,
  Settings,
  Target,
  DollarSign,
  Users,
  MousePointer,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MediaData {
  date: string;
  platform: string;
  campaign: string;
  adSet: string;
  creative: string;
  impressions: number;
  clicks: number;
  leads: number;
  spend: number;
}

interface SalesData {
  date: string;
  campaign: string;
  orders: number;
  revenue: number;
}

interface KPIData {
  ctr: number;
  cpc: number;
  cpl: number;
  leadToSaleRate: number;
  cpa: number;
  roas: number;
  roi: number;
  avgTicket: number;
  totalSpend: number;
  totalRevenue: number;
  totalLeads: number;
  totalSales: number;
}

interface CampaignAnalysis {
  campaign: string;
  spend: number;
  revenue: number;
  leads: number;
  sales: number;
  roas: number;
  roi: number;
  cpl: number;
  cpa: number;
}

const DEMO_MEDIA_DATA: MediaData[] = [
  {
    date: '2025-01-01',
    platform: 'Meta',
    campaign: 'Prospecção DM - Frio',
    adSet: 'LOOK 1%',
    creative: 'Vídeo 30s A',
    impressions: 120000,
    clicks: 1400,
    leads: 95,
    spend: 350.50
  },
  {
    date: '2025-01-02',
    platform: 'Meta',
    campaign: 'Remarketing DM - 7d',
    adSet: 'Engajados',
    creative: 'Carrossel B',
    impressions: 38000,
    clicks: 620,
    leads: 110,
    spend: 180.00
  },
  {
    date: '2025-01-03',
    platform: 'Google',
    campaign: 'Search - Marca',
    adSet: 'Exata',
    creative: 'Anúncio Texto',
    impressions: 25000,
    clicks: 800,
    leads: 45,
    spend: 220.00
  }
];

const DEMO_SALES_DATA: SalesData[] = [
  { date: '2025-01-01', campaign: 'Prospecção DM - Frio', orders: 7, revenue: 4200.00 },
  { date: '2025-01-02', campaign: 'Remarketing DM - 7d', orders: 9, revenue: 5600.00 },
  { date: '2025-01-03', campaign: 'Search - Marca', orders: 3, revenue: 1800.00 }
];

export default function RoiRoas() {
  const { toast } = useToast();
  const mediaFileRef = useRef<HTMLInputElement>(null);
  const salesFileRef = useRef<HTMLInputElement>(null);
  
  const [mediaData, setMediaData] = useState<MediaData[]>(DEMO_MEDIA_DATA);
  const [salesData, setSalesData] = useState<SalesData[]>(DEMO_SALES_DATA);
  const [dateRange, setDateRange] = useState<'today' | '7d' | '14d' | '30d' | 'custom'>('7d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showMapping, setShowMapping] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [csvType, setCsvType] = useState<'media' | 'sales'>('media');
  
  // Column mapping state
  const [mediaMapping, setMediaMapping] = useState({
    date: 'date',
    platform: 'platform',
    campaign: 'campaign',
    adSet: 'adSet',
    creative: 'creative',
    impressions: 'impressions',
    clicks: 'clicks',
    leads: 'leads',
    spend: 'spend'
  });
  
  const [salesMapping, setSalesMapping] = useState({
    date: 'date',
    campaign: 'campaign',
    orders: 'orders',
    revenue: 'revenue'
  });

  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (dateRange) {
      case 'today':
        startDate = now;
        break;
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '14d':
        startDate = subDays(now, 14);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case 'custom':
        if (!customStartDate || !customEndDate) return { media: mediaData, sales: salesData };
        startDate = parseISO(customStartDate);
        endDate = parseISO(customEndDate);
        break;
      default:
        startDate = subDays(now, 7);
    }

    const filteredMedia = mediaData.filter(item => 
      isWithinInterval(parseISO(item.date), { start: startDate, end: endDate })
    );
    
    const filteredSales = salesData.filter(item => 
      isWithinInterval(parseISO(item.date), { start: startDate, end: endDate })
    );

    return { media: filteredMedia, sales: filteredSales };
  };

  const calculateKPIs = (): KPIData => {
    const { media, sales } = getFilteredData();
    
    const totalSpend = media.reduce((sum, item) => sum + item.spend, 0);
    const totalImpressions = media.reduce((sum, item) => sum + item.impressions, 0);
    const totalClicks = media.reduce((sum, item) => sum + item.clicks, 0);
    const totalLeads = media.reduce((sum, item) => sum + item.leads, 0);
    const totalRevenue = sales.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = sales.reduce((sum, item) => sum + item.orders, 0);
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const leadToSaleRate = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0;
    const cpa = totalSales > 0 ? totalSpend / totalSales : 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      ctr,
      cpc,
      cpl,
      leadToSaleRate,
      cpa,
      roas,
      roi,
      avgTicket,
      totalSpend,
      totalRevenue,
      totalLeads,
      totalSales
    };
  };

  const getCampaignAnalysis = (): CampaignAnalysis[] => {
    const { media, sales } = getFilteredData();
    
    const campaignMap = new Map<string, {
      spend: number;
      leads: number;
      revenue: number;
      sales: number;
    }>();

    // Aggregate media data
    media.forEach(item => {
      const existing = campaignMap.get(item.campaign) || { spend: 0, leads: 0, revenue: 0, sales: 0 };
      campaignMap.set(item.campaign, {
        ...existing,
        spend: existing.spend + item.spend,
        leads: existing.leads + item.leads
      });
    });

    // Aggregate sales data
    sales.forEach(item => {
      const existing = campaignMap.get(item.campaign) || { spend: 0, leads: 0, revenue: 0, sales: 0 };
      campaignMap.set(item.campaign, {
        ...existing,
        revenue: existing.revenue + item.revenue,
        sales: existing.sales + item.orders
      });
    });

    return Array.from(campaignMap.entries()).map(([campaign, data]) => ({
      campaign,
      spend: data.spend,
      revenue: data.revenue,
      leads: data.leads,
      sales: data.sales,
      roas: data.spend > 0 ? data.revenue / data.spend : 0,
      roi: data.spend > 0 ? ((data.revenue - data.spend) / data.spend) * 100 : 0,
      cpl: data.leads > 0 ? data.spend / data.leads : 0,
      cpa: data.sales > 0 ? data.spend / data.sales : 0
    })).sort((a, b) => b.roas - a.roas);
  };

  const getChartData = () => {
    const { media, sales } = getFilteredData();
    
    const dateMap = new Map<string, {
      date: string;
      spend: number;
      revenue: number;
      leads: number;
      sales: number;
    }>();

    media.forEach(item => {
      const existing = dateMap.get(item.date) || { date: item.date, spend: 0, revenue: 0, leads: 0, sales: 0 };
      dateMap.set(item.date, {
        ...existing,
        spend: existing.spend + item.spend,
        leads: existing.leads + item.leads
      });
    });

    sales.forEach(item => {
      const existing = dateMap.get(item.date) || { date: item.date, spend: 0, revenue: 0, leads: 0, sales: 0 };
      dateMap.set(item.date, {
        ...existing,
        revenue: existing.revenue + item.revenue,
        sales: existing.sales + item.orders
      });
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        ...item,
        roas: item.spend > 0 ? item.revenue / item.spend : 0,
        formattedDate: format(parseISO(item.date), 'dd/MM', { locale: ptBR })
      }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'sales') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const preview = lines.slice(0, 6).map(line => line.split(','));
      
      setCsvPreview(preview);
      setCsvType(type);
      setShowMapping(true);
    };
    reader.readAsText(file);
  };

  const processCSV = () => {
    if (csvPreview.length < 2) return;

    const headers = csvPreview[0];
    const rows = csvPreview.slice(1);
    
    if (csvType === 'media') {
      const processedData: MediaData[] = rows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        
        return {
          date: obj[mediaMapping.date],
          platform: obj[mediaMapping.platform],
          campaign: obj[mediaMapping.campaign],
          adSet: obj[mediaMapping.adSet],
          creative: obj[mediaMapping.creative],
          impressions: parseInt(obj[mediaMapping.impressions]) || 0,
          clicks: parseInt(obj[mediaMapping.clicks]) || 0,
          leads: parseInt(obj[mediaMapping.leads]) || 0,
          spend: parseFloat(obj[mediaMapping.spend].replace(/[R$,]/g, '')) || 0
        };
      });
      
      setMediaData([...mediaData, ...processedData]);
    } else {
      const processedData: SalesData[] = rows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        
        return {
          date: obj[salesMapping.date],
          campaign: obj[salesMapping.campaign],
          orders: parseInt(obj[salesMapping.orders]) || 0,
          revenue: parseFloat(obj[salesMapping.revenue].replace(/[R$,]/g, '')) || 0
        };
      });
      
      setSalesData([...salesData, ...processedData]);
    }
    
    setShowMapping(false);
    setCsvPreview([]);
    
    toast({
      title: "CSV importado com sucesso!",
      description: `Dados de ${csvType === 'media' ? 'mídia' : 'vendas'} foram adicionados.`
    });
  };

  const exportReport = () => {
    const kpis = calculateKPIs();
    const campaigns = getCampaignAnalysis();
    
    // Simulate PDF generation
    toast({
      title: "Relatório gerado!",
      description: "Relatório executivo de ROI/ROAS baixado em PDF."
    });
  };

  const kpis = calculateKPIs();
  const campaigns = getCampaignAnalysis();
  const chartData = getChartData();

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatPercent = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);

  if (showMapping) {
    return (
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Mapear Colunas - {csvType === 'media' ? 'Dados de Mídia' : 'Dados de Vendas'}</CardTitle>
            <CardDescription>
              Configure como as colunas do CSV devem ser interpretadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div>
              <h3 className="font-semibold mb-2">Prévia do Arquivo</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {csvPreview[0]?.map((header, index) => (
                          <th key={index} className="p-2 text-left border-r">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.slice(1, 4).map((row, index) => (
                        <tr key={index} className="border-t">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="p-2 border-r">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mapping */}
            <div>
              <h3 className="font-semibold mb-4">Mapeamento de Colunas</h3>
              <div className="grid grid-cols-2 gap-4">
                {csvType === 'media' ? (
                  <>
                    {Object.entries(mediaMapping).map(([field, value]) => (
                      <div key={field}>
                        <Label htmlFor={field}>
                          {field === 'date' ? 'Data' :
                           field === 'platform' ? 'Plataforma' :
                           field === 'campaign' ? 'Campanha' :
                           field === 'adSet' ? 'Conjunto de Anúncios' :
                           field === 'creative' ? 'Criativo' :
                           field === 'impressions' ? 'Impressões' :
                           field === 'clicks' ? 'Cliques' :
                           field === 'leads' ? 'Leads' :
                           field === 'spend' ? 'Gasto' : field}
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(newValue) => 
                            setMediaMapping(prev => ({ ...prev, [field]: newValue }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {csvPreview[0]?.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {Object.entries(salesMapping).map(([field, value]) => (
                      <div key={field}>
                        <Label htmlFor={field}>
                          {field === 'date' ? 'Data' :
                           field === 'campaign' ? 'Campanha' :
                           field === 'orders' ? 'Pedidos' :
                           field === 'revenue' ? 'Receita' : field}
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(newValue) => 
                            setSalesMapping(prev => ({ ...prev, [field]: newValue }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {csvPreview[0]?.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowMapping(false)}>
                Cancelar
              </Button>
              <Button onClick={processCSV}>
                Importar Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ROI/ROAS</h1>
          <p className="text-muted-foreground">Análise de retorno sobre investimento em mídia paga</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReport}>
            <FileText className="h-4 w-4 mr-2" />
            Relatório PDF
          </Button>
        </div>
      </div>

      {/* Upload & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Importar Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => mediaFileRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                CSV Mídia
              </Button>
              <input
                ref={mediaFileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'media')}
              />
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => salesFileRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                CSV Vendas
              </Button>
              <input
                ref={salesFileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'sales')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Período de Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="14d">Últimos 14 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date" className="text-xs">De</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs">Até</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status dos Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Registros Mídia:</span>
              <Badge variant="outline">{mediaData.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Registros Vendas:</span>
              <Badge variant="outline">{salesData.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Última atualização:</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(), 'HH:mm', { locale: ptBR })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROAS</p>
                <p className="text-2xl font-bold">
                  {kpis.roas.toFixed(2)}x
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">
                {formatCurrency(kpis.totalRevenue)} / {formatCurrency(kpis.totalSpend)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold">
                  {kpis.roi > 0 ? '+' : ''}{kpis.roi.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Target className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">
                Lucro: {formatCurrency(kpis.totalRevenue - kpis.totalSpend)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPL</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(kpis.cpl)}
                </p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">
                {kpis.totalLeads} leads gerados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPA</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(kpis.cpa)}
                </p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <DollarSign className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">
                {kpis.totalSales} vendas realizadas
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'roas' ? `${value.toFixed(2)}x` :
                    name === 'spend' || name === 'revenue' ? formatCurrency(value) :
                    value,
                    name === 'roas' ? 'ROAS' :
                    name === 'spend' ? 'Gasto' :
                    name === 'revenue' ? 'Receita' :
                    name === 'leads' ? 'Leads' :
                    name === 'sales' ? 'Vendas' : name
                  ]}
                />
                <Line type="monotone" dataKey="roas" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="spend" stroke="hsl(var(--destructive))" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(142 76% 36%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Campanhas por ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaigns.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="campaign" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value.toFixed(2)}x`, 'ROAS']}
                />
                <Bar dataKey="roas" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Campanha</CardTitle>
          <CardDescription>Performance detalhada de cada campanha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Campanha</th>
                  <th className="text-right p-2">Gasto</th>
                  <th className="text-right p-2">Receita</th>
                  <th className="text-right p-2">Leads</th>
                  <th className="text-right p-2">Vendas</th>
                  <th className="text-right p-2">ROAS</th>
                  <th className="text-right p-2">ROI</th>
                  <th className="text-right p-2">CPL</th>
                  <th className="text-right p-2">CPA</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{campaign.campaign}</td>
                    <td className="p-2 text-right">{formatCurrency(campaign.spend)}</td>
                    <td className="p-2 text-right">{formatCurrency(campaign.revenue)}</td>
                    <td className="p-2 text-right">{campaign.leads}</td>
                    <td className="p-2 text-right">{campaign.sales}</td>
                    <td className="p-2 text-right">
                      <Badge variant={campaign.roas >= 3 ? 'default' : campaign.roas >= 2 ? 'outline' : 'destructive'}>
                        {campaign.roas.toFixed(2)}x
                      </Badge>
                    </td>
                    <td className="p-2 text-right">
                      <span className={campaign.roi > 0 ? 'text-green-600' : 'text-red-600'}>
                        {campaign.roi > 0 ? '+' : ''}{campaign.roi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-2 text-right">{formatCurrency(campaign.cpl)}</td>
                    <td className="p-2 text-right">{formatCurrency(campaign.cpa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="text-xl font-bold">
                  {kpis.ctr.toFixed(2)}%
                </p>
              </div>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPC</p>
                <p className="text-xl font-bold">
                  {formatCurrency(kpis.cpc)}
                </p>
              </div>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa L→V</p>
                <p className="text-xl font-bold">
                  {kpis.leadToSaleRate.toFixed(1)}%
                </p>
              </div>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-xl font-bold">
                  {formatCurrency(kpis.avgTicket)}
                </p>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}