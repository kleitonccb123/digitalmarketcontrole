import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !accessCode.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha seu nome e código de acesso',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      const success = login(userName, accessCode);
      if (success) {
        toast({
          title: 'Acesso autorizado',
          description: `Bem-vindo ao Digital Market Max, ${userName}!`
        });
      } else {
        toast({
          title: 'Código inválido',
          description: 'Verifique seu código de acesso e tente novamente',
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
            Digital Market Max
          </h1>
          <p className="text-muted-foreground text-lg">
            Plataforma completa para gestão digital
          </p>
        </div>

        <Card className="shadow-card border-border/30 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-base mt-2">
              Informe suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName">Seu nome</Label>
                <Input
                  id="userName"
                  placeholder="Digite seu nome completo"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessCode">Código de acesso</Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Digite seu código"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? 'Validando...' : 'Acessar Sistema'}
              </Button>
            </form>

            <div className="mt-6 text-xs text-muted-foreground space-y-2">
              <p className="font-medium">Códigos de exemplo:</p>
              <div className="space-y-1">
                <p><span className="font-mono bg-muted px-1 rounded">X7kP9mQ2vL</span> - Admin</p>
                <p><span className="font-mono bg-muted px-1 rounded">Q3vB6nM8yT</span> - Gestor</p>
                <p><span className="font-mono bg-muted px-1 rounded">Y2bV6tR9jH</span> - Analista</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}