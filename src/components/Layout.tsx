import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuthStore } from '@/store/authStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuthStore();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Apple-style header */}
          <header className="h-18 border-b border-border/20 glass sticky top-0 z-40 flex items-center px-8 shadow-glass animate-fade-in">
            <SidebarTrigger className="mr-8 btn-apple focus-ring" />
            
            <div className="flex-1 flex items-center justify-between">
              <div className="animate-slide-up">
                <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
                  Digital Market Max
                </h1>
                <p className="text-xs text-muted-foreground/70 mt-1 font-medium">Plataforma completa para gestão digital</p>
              </div>
              
              {user && (
                <div className="flex items-center space-x-6 animate-fade-in">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground/90">{user.userName}</p>
                    <p className="text-xs text-muted-foreground/60 capitalize font-medium">{user.role}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground shadow-glow btn-apple">
                    {user.userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Apple-style main content with better spacing */}
          <main className="flex-1 p-10 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}