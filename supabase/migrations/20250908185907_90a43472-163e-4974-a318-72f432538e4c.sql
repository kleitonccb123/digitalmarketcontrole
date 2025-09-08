-- Create creatives table
CREATE TABLE public.creatives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL,
  name text NOT NULL,
  angle text NOT NULL,
  promise text NOT NULL,
  hypothesis text,
  status text NOT NULL DEFAULT 'Testando' CHECK (status IN ('Testando', 'Aprovado', 'Pausado', 'Arquivado')),
  thumbnail text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.creatives ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "tenant read creatives" 
ON public.creatives 
FOR SELECT 
USING (tenant_id = current_tenant_id());

CREATE POLICY "tenant write creatives" 
ON public.creatives 
FOR ALL 
USING (tenant_id = current_tenant_id())
WITH CHECK (tenant_id = current_tenant_id());

-- Add trigger for tenant_id
CREATE TRIGGER set_creatives_tenant_id
BEFORE INSERT ON public.creatives
FOR EACH ROW
EXECUTE FUNCTION public.set_tenant_id();

-- Add trigger for updated_at
CREATE TRIGGER update_creatives_updated_at
BEFORE UPDATE ON public.creatives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();