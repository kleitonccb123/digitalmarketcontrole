import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Creative {
  id: string;
  name: string;
  angle: string;
  promise: string;
  hypothesis: string | null;
  status: 'Testando' | 'Aprovado' | 'Pausado' | 'Arquivado';
  thumbnail: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateCreativeInput = {
  name: string;
  angle: string;
  promise: string;
  hypothesis: string;
  status: 'Testando' | 'Aprovado' | 'Pausado' | 'Arquivado';
  thumbnail: string | null;
  notes: string;
};

export type UpdateCreativeData = Partial<CreateCreativeInput>;

export const useCreatives = () => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all creatives
  const fetchCreatives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creatives')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure proper typing
      setCreatives((data as Creative[]) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar criativos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new creative
  const addCreative = async (creative: CreateCreativeInput) => {
    try {
      const { data, error } = await supabase
        .from('creatives')
        .insert([creative as any]) // Use any to bypass TypeScript strict checking for insert
        .select()
        .single();

      if (error) throw error;

      setCreatives(prev => [data as Creative, ...prev]);
      
      toast({
        title: "Criativo adicionado!",
        description: "Novo criativo foi salvo com sucesso."
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar criativo",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update creative
  const updateCreative = async (id: string, updates: UpdateCreativeData) => {
    try {
      const { data, error } = await supabase
        .from('creatives')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCreatives(prev => 
        prev.map(creative => 
          creative.id === id ? (data as Creative) : creative
        )
      );

      toast({
        title: "Criativo atualizado!",
        description: "Alterações salvas com sucesso."
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar criativo",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete creative
  const deleteCreative = async (id: string) => {
    try {
      const { error } = await supabase
        .from('creatives')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCreatives(prev => prev.filter(creative => creative.id !== id));

      toast({
        title: "Criativo removido!",
        description: "Criativo foi excluído com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover criativo",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Load demo data
  const loadDemoData = async () => {
    const demoCreatives: CreateCreativeInput[] = [
      {
        name: 'Vídeo 30s - Transformação',
        angle: 'Antes e Depois',
        promise: '30 dias para seu melhor resultado',
        hypothesis: 'Transformação visual gera mais conversões',
        status: 'Testando',
        thumbnail: null,
        notes: ''
      },
      {
        name: 'Carrossel - Benefícios',
        angle: 'Educativo',
        promise: 'Descubra os 5 segredos',
        hypothesis: 'Conteúdo educativo aumenta confiança',
        status: 'Aprovado',
        thumbnail: null,
        notes: 'Performou muito bem na primeira semana'
      },
      {
        name: 'Story - Depoimento Cliente',
        angle: 'Social Proof',
        promise: 'Resultados comprovados',
        hypothesis: 'Depoimentos reais convertem melhor',
        status: 'Pausado',
        thumbnail: null,
        notes: 'Pausado para ajustar copy'
      }
    ];

    try {
      for (const creative of demoCreatives) {
        await addCreative(creative);
      }
    } catch (error) {
      // Error handling is already done in addCreative
    }
  };

  useEffect(() => {
    fetchCreatives();
  }, []);

  return {
    creatives,
    loading,
    addCreative,
    updateCreative,
    deleteCreative,
    loadDemoData,
    refetch: fetchCreatives
  };
};