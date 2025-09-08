import React, { useState } from "react";
import { Calendar, CalendarDays, Clock, Eye, FileText, Filter, Plus, Search, Settings, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  content: string;
  platform: "instagram" | "facebook" | "linkedin" | "twitter";
  scheduledDate: Date;
  status: "scheduled" | "draft" | "published" | "failed";
  engagement?: number;
  hashtags: string[];
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Lançamento Nova Campanha",
    content: "🚀 Estamos orgulhosos de apresentar nossa nova campanha digital! Focada em resultados reais e ROI comprovado.",
    platform: "instagram",
    scheduledDate: new Date(2024, 11, 15, 9, 0),
    status: "scheduled",
    hashtags: ["#marketing", "#digital", "#roi"]
  },
  {
    id: "2", 
    title: "Dicas de ROI",
    content: "💡 Como melhorar seu ROI em campanhas digitais: 1. Segmente bem seu público 2. Use dados para otimizar 3. Teste diferentes abordagens",
    platform: "linkedin",
    scheduledDate: new Date(2024, 11, 16, 14, 30),
    status: "scheduled",
    hashtags: ["#dicas", "#roi", "#marketing"]
  },
  {
    id: "3",
    title: "Análise de Mercado",
    content: "📊 Análise semanal do mercado digital: Tendências que você precisa saber para 2024",
    platform: "facebook",
    scheduledDate: new Date(2024, 11, 17, 10, 0),
    status: "draft",
    hashtags: ["#analise", "#mercado", "#tendencias"]
  }
];

const Planner = () => {
  const [posts] = useState<Post[]>(mockPosts);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "", 
    platform: "",
    scheduledDate: new Date(),
    hashtags: ""
  });

  const filteredPosts = posts.filter(post => {
    const matchesPlatform = filterPlatform === "all" || post.platform === filterPlatform;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const scheduledCount = posts.filter(p => p.status === "scheduled").length;
  const draftCount = posts.filter(p => p.status === "draft").length;
  const publishedCount = posts.filter(p => p.status === "published").length;

  const platformColors = {
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    facebook: "bg-blue-600",
    linkedin: "bg-blue-700", 
    twitter: "bg-sky-500"
  };

  const statusColors = {
    scheduled: "bg-primary text-primary-foreground",
    draft: "bg-muted text-muted-foreground",
    published: "bg-green-600 text-white",
    failed: "bg-destructive text-destructive-foreground"
  };

  const handleCreatePost = () => {
    // Lógica para criar post
    setIsCreateModalOpen(false);
    setNewPost({
      title: "",
      content: "",
      platform: "",
      scheduledDate: new Date(),
      hashtags: ""
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planner Editorial</h1>
          <p className="text-muted-foreground">Gerencie e agende seu conteúdo em todas as plataformas</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Post</DialogTitle>
              <DialogDescription>
                Crie e agende um novo post para suas redes sociais
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título do post..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Select value={newPost.platform} onValueChange={(value) => setNewPost({...newPost, platform: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  placeholder="Escreva o conteúdo do post..."
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input
                  id="hashtags"
                  placeholder="#marketing #digital #roi"
                  value={newPost.hashtags}
                  onChange={(e) => setNewPost({...newPost, hashtags: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePost}>
                  Criar Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Posts Agendados</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">
              Para esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Rascunhos</CardTitle>
            <FileText className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{draftCount}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando revisão
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Publicados</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Taxa de Engajamento</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">4.8%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% vs. mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center text-card-foreground">
                <CalendarDays className="mr-2 h-5 w-5" />
                Calendário Editorial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="scheduled" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scheduled">Agendados</TabsTrigger>
              <TabsTrigger value="drafts">Rascunhos</TabsTrigger>
              <TabsTrigger value="published">Publicados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scheduled" className="space-y-4">
              {filteredPosts.filter(p => p.status === "scheduled").map((post) => (
                <Card key={post.id} className="bg-card border-border shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${platformColors[post.platform]}`}></div>
                          <h3 className="font-medium text-card-foreground">{post.title}</h3>
                          <Badge className={statusColors[post.status]}>
                            {post.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(post.scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                          <div className="capitalize">{post.platform}</div>
                        </div>
                        
                        <div className="flex gap-1">
                          {post.hashtags.map((tag, index) => (
                            <span key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="drafts" className="space-y-4">
              {filteredPosts.filter(p => p.status === "draft").map((post) => (
                <Card key={post.id} className="bg-card border-border shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${platformColors[post.platform]}`}></div>
                          <h3 className="font-medium text-card-foreground">{post.title}</h3>
                          <Badge className={statusColors[post.status]}>
                            {post.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="capitalize">{post.platform}</div>
                        </div>
                        
                        <div className="flex gap-1">
                          {post.hashtags.map((tag, index) => (
                            <span key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="published" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Nenhum post publicado encontrado
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Planner;