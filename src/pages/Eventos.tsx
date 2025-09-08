import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Users,
  Target,
  CheckCircle,
  Clock,
  MapPin,
  Megaphone,
  Camera,
  Share2,
  TrendingUp,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  FileText,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface EventPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  tasks: string[];
  tips: string[];
  completed?: boolean;
}

const eventPhases: EventPhase[] = [
  {
    id: 'pre-planning',
    title: 'Pré-Planejamento',
    description: 'Definição de objetivos e estrutura inicial',
    duration: '2-4 semanas antes',
    tasks: [
      'Definir objetivos SMART do evento',
      'Estabelecer orçamento e ROI esperado',
      'Escolher data, horário e formato (presencial/online)',
      'Definir público-alvo e persona do evento',
      'Criar identidade visual e naming',
      'Selecionar palestrantes/convidados',
      'Definir agenda e cronograma'
    ],
    tips: [
      'Sempre tenha um objetivo claro: gerar leads, educar, vender ou engajar',
      'Considere fusos horários para eventos online',
      'Reserve 20% do orçamento para imprevistos',
      'Crie uma proposta de valor única para o evento'
    ]
  },
  {
    id: 'planning',
    title: 'Planejamento Detalhado',
    description: 'Estruturação operacional e logística',
    duration: '1-3 semanas antes',
    tasks: [
      'Configurar plataforma de transmissão/local',
      'Criar landing page de inscrição',
      'Desenvolver materiais gráficos',
      'Estruturar funil de inscrições',
      'Configurar automações de e-mail',
      'Preparar kit de divulgação',
      'Testar equipamentos e tecnologia',
      'Briefar equipe e palestrantes'
    ],
    tips: [
      'Sempre teste a tecnologia 2x antes do evento',
      'Tenha um plano B para falhas técnicas',
      'Crie templates de e-mail para diferentes momentos',
      'Use UTMs específicas para rastrear origens das inscrições'
    ]
  },
  {
    id: 'promotion',
    title: 'Promoção e Divulgação',
    description: 'Campanha de marketing e captação',
    duration: '1-4 semanas',
    tasks: [
      'Lançar campanha de tráfego pago',
      'Ativar parcerias e afiliados',
      'Executar cronograma de posts orgânicos',
      'Enviar campanhas de e-mail marketing',
      'Ativar influenciadores e embaixadores',
      'Monitorar métricas de conversão',
      'Ajustar investimento por canal',
      'Criar senso de urgência (limitação de vagas)'
    ],
    tips: [
      'Meta Ads: Use lookalike de clientes para encontrar público similar',
      'Orgânico: Poste stories diários com countdown',
      'E-mail: Segmente listas por interesse e engajamento',
      'Parcerias: Ofereça comissão ou contrapartida'
    ]
  },
  {
    id: 'execution',
    title: 'Execução do Evento',
    description: 'Dia D - Transmissão e engajamento',
    duration: 'Dia do evento',
    tasks: [
      'Checklist técnico completo',
      'Recepcionar participantes',
      'Moderar chat e interações',
      'Executar cronograma conforme planejado',
      'Monitorar métricas em tempo real',
      'Capturar depoimentos e feedbacks',
      'Gerenciar ofertas e call-to-actions',
      'Gravar conteúdo para replay'
    ],
    tips: [
      'Chegue 1h antes para testes finais',
      'Tenha uma pessoa dedicada só para o chat',
      'Monitore métricas de abandono em tempo real',
      'Capture screenshots dos melhores momentos'
    ]
  },
  {
    id: 'post-event',
    title: 'Pós-Evento',
    description: 'Follow-up e análise de resultados',
    duration: '1-2 semanas após',
    tasks: [
      'Enviar replay e materiais complementares',
      'Executar sequência de e-mails de follow-up',
      'Analisar métricas e ROI do evento',
      'Coletar feedbacks dos participantes',
      'Nutrir leads gerados',
      'Reaproveitar conteúdo em outros formatos',
      'Documentar lições aprendidas',
      'Planejar próximos eventos'
    ],
    tips: [
      'Envie o replay em até 24h após o evento',
      'Segmente follow-up por nível de engajamento',
      'Transforme o conteúdo em posts, reels e artigos',
      'Use pesquisa NPS para medir satisfação'
    ]
  }
];

const eventTypes = [
  {
    type: 'webinar',
    title: 'Webinar Educativo',
    description: 'Evento online focado em educação e geração de leads',
    avgAttendance: '100-500',
    avgConversion: '15-25%',
    investment: 'R$ 2.000 - R$ 10.000',
    duration: '60-90min',
    bestFor: 'Captura de leads qualificados, autoridade'
  },
  {
    type: 'workshop',
    title: 'Workshop Prático',
    description: 'Treinamento hands-on com exercícios práticos',
    avgAttendance: '50-200',
    avgConversion: '25-40%',
    investment: 'R$ 5.000 - R$ 20.000',
    duration: '2-4h',
    bestFor: 'Vendas diretas, demonstração de valor'
  },
  {
    type: 'summit',
    title: 'Summit/Congresso',
    description: 'Evento multi-dias com vários palestrantes',
    avgAttendance: '500-5.000',
    avgConversion: '5-15%',
    investment: 'R$ 20.000 - R$ 100.000',
    duration: '2-3 dias',
    bestFor: 'Branding, networking, grandes lançamentos'
  },
  {
    type: 'masterclass',
    title: 'Masterclass VIP',
    description: 'Aula exclusiva com conteúdo premium',
    avgAttendance: '20-100',
    avgConversion: '40-60%',
    investment: 'R$ 3.000 - R$ 15.000',
    duration: '90-120min',
    bestFor: 'Produtos de alto ticket, relacionamento'
  }
];

const kpiMetrics = [
  {
    metric: 'Taxa de Inscrição',
    description: 'Conversão da landing page',
    benchmark: '15-35%',
    formula: '(Inscritos ÷ Visitantes) × 100'
  },
  {
    metric: 'Show Up Rate',
    description: 'Taxa de comparecimento',
    benchmark: '35-65%',
    formula: '(Presentes ÷ Inscritos) × 100'
  },
  {
    metric: 'Tempo Médio',
    description: 'Permanência no evento',
    benchmark: '60-80%',
    formula: 'Tempo assistido ÷ Duração total'
  },
  {
    metric: 'Taxa de Conversão',
    description: 'Conversão em vendas',
    benchmark: '5-25%',
    formula: '(Vendas ÷ Presentes) × 100'
  },
  {
    metric: 'CAC do Evento',
    description: 'Custo por cliente adquirido',
    benchmark: 'Varia por nicho',
    formula: 'Investimento total ÷ Clientes conquistados'
  },
  {
    metric: 'ROI do Evento',
    description: 'Retorno sobre investimento',
    benchmark: '300-500%',
    formula: '((Receita - Investimento) ÷ Investimento) × 100'
  }
];

export default function Eventos() {
  const { toast } = useToast();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (phaseId: string, taskIndex: number) => {
    const taskKey = `${phaseId}-${taskIndex}`;
    const newChecked = new Set(checkedTasks);
    
    if (newChecked.has(taskKey)) {
      newChecked.delete(taskKey);
    } else {
      newChecked.add(taskKey);
    }
    
    setCheckedTasks(newChecked);
    
    toast({
      title: newChecked.has(taskKey) ? "Tarefa concluída!" : "Tarefa desmarcada",
      description: "Progresso atualizado na cartilha de eventos."
    });
  };

  const downloadTemplate = (type: string) => {
    toast({
      title: "Template baixado!",
      description: `Template de ${type} foi baixado com sucesso.`
    });
  };

  const exportChecklist = () => {
    const checklist = eventPhases.map(phase => ({
      fase: phase.title,
      duracao: phase.duration,
      tarefas: phase.tasks.map((task, index) => ({
        tarefa: task,
        concluida: checkedTasks.has(`${phase.id}-${index}`)
      }))
    }));

    const dataStr = JSON.stringify(checklist, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'checklist-eventos.json';
    link.click();
    
    toast({
      title: "Checklist exportado!",
      description: "Seu progresso foi salvo em arquivo JSON."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Cartilha de Eventos
          </h1>
          <p className="text-muted-foreground">
            Guia completo para planejar e executar eventos de marketing digital
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportChecklist}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Progresso
          </Button>
          <Button onClick={() => setCheckedTasks(new Set())}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Checklist
          </Button>
        </div>
      </div>

      <Tabs defaultValue="fases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fases">Fases do Evento</TabsTrigger>
          <TabsTrigger value="tipos">Tipos de Eventos</TabsTrigger>
          <TabsTrigger value="metricas">KPIs e Métricas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Fases do Evento */}
        <TabsContent value="fases" className="space-y-6">
          <div className="grid gap-6">
            {eventPhases.map((phase, index) => {
              const completedTasks = phase.tasks.filter((_, taskIndex) => 
                checkedTasks.has(`${phase.id}-${taskIndex}`)
              ).length;
              const totalTasks = phase.tasks.length;
              const progress = (completedTasks / totalTasks) * 100;
              
              return (
                <Card key={phase.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          progress === 100 ? 'bg-green-500 text-white' :
                          progress > 0 ? 'bg-primary text-primary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {phase.title}
                            {progress === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
                          </CardTitle>
                          <CardDescription>{phase.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {phase.duration}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {completedTasks}/{totalTasks} concluídas
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          progress === 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Tasks */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Tarefas Essenciais
                        </h4>
                        <div className="space-y-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={checkedTasks.has(`${phase.id}-${taskIndex}`)}
                                onChange={() => toggleTask(phase.id, taskIndex)}
                                className="mt-1 rounded"
                              />
                              <span className={`text-sm ${
                                checkedTasks.has(`${phase.id}-${taskIndex}`) 
                                  ? 'line-through text-muted-foreground' 
                                  : ''
                              }`}>
                                {task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Dicas Importantes
                        </h4>
                        <div className="space-y-2">
                          {phase.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-start gap-3">
                              <AlertTriangle className="h-3 w-3 mt-1 text-yellow-500 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {tip}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tipos de Eventos */}
        <TabsContent value="tipos" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {eventTypes.map((eventType) => (
              <Card key={eventType.type} className="shadow-card hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    {eventType.title}
                  </CardTitle>
                  <CardDescription>{eventType.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Público Médio:</span>
                      <div className="font-medium">{eventType.avgAttendance}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversão:</span>
                      <div className="font-medium text-green-500">{eventType.avgConversion}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Investimento:</span>
                      <div className="font-medium">{eventType.investment}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duração:</span>
                      <div className="font-medium">{eventType.duration}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Melhor para:</span>
                    <div className="text-sm font-medium mt-1">{eventType.bestFor}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* KPIs e Métricas */}
        <TabsContent value="metricas" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiMetrics.map((kpi) => (
              <Card key={kpi.metric} className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {kpi.metric}
                  </CardTitle>
                  <CardDescription>{kpi.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Benchmark:</span>
                    <div className="font-bold text-primary">{kpi.benchmark}</div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Fórmula:</span>
                    <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                      {kpi.formula}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Cronograma de Evento
                </CardTitle>
                <CardDescription>
                  Template completo com todas as fases e prazos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => downloadTemplate('Cronograma')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Kit de Divulgação
                </CardTitle>
                <CardDescription>
                  Peças gráficas e copy para redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => downloadTemplate('Kit de Divulgação')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Sequência de E-mails
                </CardTitle>
                <CardDescription>
                  Templates de e-mail para cada fase do evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => downloadTemplate('E-mails')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Landing Page
                </CardTitle>
                <CardDescription>
                  Estrutura e copy para página de inscrição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => downloadTemplate('Landing Page')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Script de Apresentação
                </CardTitle>
                <CardDescription>
                  Roteiro completo para condução do evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => downloadTemplate('Script')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Planilha de ROI
                </CardTitle>
                <CardDescription>
                  Calculadora de métricas e retorno do evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => downloadTemplate('ROI Calculator')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}