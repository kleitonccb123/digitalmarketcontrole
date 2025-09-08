import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Image,
  Calendar,
  Search,
  Link,
  BookOpen,
  Archive,
  Settings,
  LogOut,
  LayoutDashboard,
  PieChart
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarFooter
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Orçamentos', url: '/orcamentos', icon: FileText },
  { title: 'Briefings', url: '/briefings', icon: BookOpen },
  { title: 'Leads & Scoring', url: '/leads', icon: Users },
  { title: 'ROI/ROAS', url: '/roi-roas', icon: TrendingUp },
  { title: 'Meta CSV Analyzer', url: '/meta-analyzer', icon: PieChart },
  { title: 'Criativos & Testes', url: '/criativos', icon: Image },
  { title: 'Planner Editorial', url: '/planner', icon: Calendar },
  { title: 'Auditorias', url: '/auditorias', icon: Search },
  { title: 'UTMs & LinkHub', url: '/utms', icon: Link },
  { title: 'Cartilha Eventos', url: '/eventos', icon: BarChart3 },
  { title: 'Templates', url: '/templates', icon: Archive },
  { title: 'Configurações', url: '/configuracoes', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout } = useAuthStore();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `transition-smooth focus-ring rounded-lg ${
      isActive 
        ? 'bg-gradient-primary text-primary-foreground font-medium shadow-glow' 
        : 'hover:bg-muted/60 text-muted-foreground/90 hover:text-foreground hover:scale-105'
    }`;

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} glass border-r border-border/20`} collapsible="icon">
      <SidebarContent className="bg-gradient-subtle/50 backdrop-blur-xl">
        <div className="p-4 border-b border-border/20">
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
                DM Max
              </h2>
              <p className="text-xs text-muted-foreground/70 mt-1">Digital Market</p>
            </div>
          )}
        </div>
        
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3 font-medium">
            {!collapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3 font-medium tracking-tight">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/20">
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-start btn-apple focus-ring glass border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-3 font-medium">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}