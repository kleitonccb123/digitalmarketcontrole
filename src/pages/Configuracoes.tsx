import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Zap,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Key,
  Mail,
  Phone,
  Globe,
  Link2,
  Camera,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  leadAlerts: boolean;
  campaignAlerts: boolean;
  budgetAlerts: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  passwordLastChanged: string;
  loginAlerts: boolean;
  apiKeyVisible: boolean;
}

interface IntegrationSettings {
  metaAdsConnected: boolean;
  googleAdsConnected: boolean;
  analyticsConnected: boolean;
  crmConnected: boolean;
  emailMarketingConnected: boolean;
  webhookUrl: string;
}

export default function Configuracoes() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [showApiKey, setShowApiKey] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.userName || 'João Silva',
    email: 'joao@empresa.com',
    phone: '+55 11 99999-9999',
    company: 'Minha Empresa Ltda',
    role: 'Marketing Manager',
    avatar: '',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR'
  });

  // Notification state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    leadAlerts: true,
    campaignAlerts: true,
    budgetAlerts: true
  });

  // Security state
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: '24',
    passwordLastChanged: '2024-01-15',
    loginAlerts: true,
    apiKeyVisible: false
  });

  // Integration state
  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    metaAdsConnected: true,
    googleAdsConnected: false,
    analyticsConnected: true,
    crmConnected: false,
    emailMarketingConnected: true,
    webhookUrl: 'https://api.minhaempresa.com/webhook'
  });

  const saveProfile = () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações pessoais foram salvas com sucesso."
    });
  };

  const saveNotifications = () => {
    toast({
      title: "Notificações atualizadas!",
      description: "Suas preferências de notificação foram salvas."
    });
  };

  const saveSecurity = () => {
    toast({
      title: "Segurança atualizada!",
      description: "Configurações de segurança foram salvas."
    });
  };

  const saveIntegrations = () => {
    toast({
      title: "Integrações atualizadas!",
      description: "Configurações de integrações foram salvas."
    });
  };

  const exportData = () => {
    toast({
      title: "Exportação iniciada!",
      description: "Seus dados estão sendo preparados para download."
    });
  };

  const importData = () => {
    toast({
      title: "Importação iniciada!",
      description: "Arquivo está sendo processado."
    });
  };

  const deleteAccount = () => {
    toast({
      title: "Solicitação enviada",
      description: "Nossa equipe entrará em contato para confirmar a exclusão.",
      variant: "destructive"
    });
  };

  const generateApiKey = () => {
    toast({
      title: "Nova API Key gerada!",
      description: "Sua API Key foi renovada com sucesso."
    });
  };

  const connectIntegration = (service: string) => {
    toast({
      title: `${service} conectado!`,
      description: `Integração com ${service} configurada com sucesso.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Dados
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações de perfil e preferências pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tóquio (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setProfile({
                  name: user?.userName || 'João Silva',
                  email: 'joao@empresa.com',
                  phone: '+55 11 99999-9999',
                  company: 'Minha Empresa Ltda',
                  role: 'Marketing Manager',
                  avatar: '',
                  timezone: 'America/Sao_Paulo',
                  language: 'pt-BR'
                })}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar
                </Button>
                <Button onClick={saveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Canais de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">Receber notificações via e-mail</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Notificações no navegador</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS</Label>
                      <p className="text-sm text-muted-foreground">Notificações por mensagem de texto</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Relatórios Automáticos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Relatório Semanal</Label>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Relatório Mensal</Label>
                    <Switch
                      checked={notifications.monthlyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReports: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alertas Importantes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Novos Leads</Label>
                    <Switch
                      checked={notifications.leadAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, leadAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Performance de Campanhas</Label>
                    <Switch
                      checked={notifications.campaignAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, campaignAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Alertas de Orçamento</Label>
                    <Switch
                      checked={notifications.budgetAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie a segurança e privacidade da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Timeout de Sessão</Label>
                  <Select 
                    value={security.sessionTimeout} 
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="8">8 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                      <SelectItem value="168">7 dias</SelectItem>
                      <SelectItem value="720">30 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alertas de Login</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre novos acessos à conta</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">API & Integrações</h4>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_4eC39HqLyjWDarjtT1zdp7dc"
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateApiKey}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Zona de Perigo</h4>
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Alterar Senha</h5>
                        <p className="text-sm text-muted-foreground">
                          Última alteração: {security.passwordLastChanged}
                        </p>
                      </div>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Alterar Senha
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveSecurity}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integrações de Marketing
              </CardTitle>
              <CardDescription>
                Conecte suas ferramentas de marketing para sincronização automática
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Meta Ads</CardTitle>
                      <Badge variant={integrations.metaAdsConnected ? "default" : "secondary"}>
                        {integrations.metaAdsConnected ? "Conectado" : "Desconectado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Importe dados de campanhas do Facebook e Instagram
                    </p>
                    <Button 
                      variant={integrations.metaAdsConnected ? "outline" : "default"}
                      className="w-full"
                      onClick={() => connectIntegration('Meta Ads')}
                    >
                      {integrations.metaAdsConnected ? "Reconectar" : "Conectar"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Google Ads</CardTitle>
                      <Badge variant={integrations.googleAdsConnected ? "default" : "secondary"}>
                        {integrations.googleAdsConnected ? "Conectado" : "Desconectado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sincronize campanhas e métricas do Google Ads
                    </p>
                    <Button 
                      variant={integrations.googleAdsConnected ? "outline" : "default"}
                      className="w-full"
                      onClick={() => connectIntegration('Google Ads')}
                    >
                      {integrations.googleAdsConnected ? "Reconectar" : "Conectar"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Google Analytics</CardTitle>
                      <Badge variant={integrations.analyticsConnected ? "default" : "secondary"}>
                        {integrations.analyticsConnected ? "Conectado" : "Desconectado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Importe dados de tráfego e conversões
                    </p>
                    <Button 
                      variant={integrations.analyticsConnected ? "outline" : "default"}
                      className="w-full"
                      onClick={() => connectIntegration('Google Analytics')}
                    >
                      {integrations.analyticsConnected ? "Reconectar" : "Conectar"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">CRM</CardTitle>
                      <Badge variant={integrations.crmConnected ? "default" : "secondary"}>
                        {integrations.crmConnected ? "Conectado" : "Desconectado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sincronize leads e oportunidades do CRM
                    </p>
                    <Button 
                      variant={integrations.crmConnected ? "outline" : "default"}
                      className="w-full"
                      onClick={() => connectIntegration('CRM')}
                    >
                      {integrations.crmConnected ? "Reconectar" : "Conectar"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Webhook URL</h4>
                <div className="space-y-2">
                  <Label>URL para receber notificações automáticas</Label>
                  <Input
                    value={integrations.webhookUrl}
                    onChange={(e) => setIntegrations({ ...integrations, webhookUrl: e.target.value })}
                    placeholder="https://api.suaempresa.com/webhook"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveIntegrations}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Integrações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência e Tema
              </CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Tema da Interface</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card className={`cursor-pointer transition-colors ${theme === 'light' ? 'ring-2 ring-primary' : ''}`} onClick={() => setTheme('light')}>
                    <CardContent className="p-4 text-center">
                      <Sun className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-medium">Claro</p>
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-colors ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`} onClick={() => setTheme('dark')}>
                    <CardContent className="p-4 text-center">
                      <Moon className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-medium">Escuro</p>
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-colors ${theme === 'system' ? 'ring-2 ring-primary' : ''}`} onClick={() => setTheme('system')}>
                    <CardContent className="p-4 text-center">
                      <Monitor className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-medium">Sistema</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Outras Preferências</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Animações Reduzidas</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Modo Compacto</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sidebar Minimizada</Label>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gerenciamento de Dados
              </CardTitle>
              <CardDescription>
                Exporte, importe ou delete seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Exportar Dados</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={exportData} className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Relatórios
                  </Button>
                  <Button variant="outline" onClick={exportData} className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Leads
                  </Button>
                  <Button variant="outline" onClick={exportData} className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Campanhas
                  </Button>
                  <Button variant="outline" onClick={exportData} className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Todos os Dados
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Importar Dados</h4>
                <div className="space-y-2">
                  <Label>Carregar arquivo de dados</Label>
                  <div className="flex gap-2">
                    <Input type="file" accept=".csv,.json,.xlsx" />
                    <Button onClick={importData}>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Formatos aceitos: CSV, JSON, Excel (.xlsx)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Zona de Perigo</h4>
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <h5 className="font-medium text-red-900">Excluir Conta</h5>
                          <p className="text-sm text-red-700">
                            Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" onClick={deleteAccount} className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Solicitar Exclusão da Conta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}