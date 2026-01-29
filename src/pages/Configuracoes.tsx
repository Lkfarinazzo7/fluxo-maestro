import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { VendedoresManager } from '@/components/Configuracoes/VendedoresManager';
import { SupervisoresManager } from '@/components/Configuracoes/SupervisoresManager';
import { SettingsManager } from '@/components/Configuracoes/SettingsManager';
import { useOperadoras, useCategoriasDespesas, useFormasPagamento } from '@/hooks/useSettings';

export default function Configuracoes() {
  const { operadoras, addOperadora, removeOperadora, resetOperadoras } = useOperadoras();
  const { categorias, addCategoria, removeCategoria, resetCategorias } = useCategoriasDespesas();
  const { formasPagamento, addFormaPagamento, removeFormaPagamento, resetFormasPagamento } = useFormasPagamento();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Corretora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="razao-social">Razão Social</Label>
                <Input id="razao-social" placeholder="Nome da empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="contato@corretora.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 0000-0000" />
              </div>
            </div>

            <Button>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        <SettingsManager
          title="Operadoras"
          items={operadoras}
          onAdd={addOperadora}
          onRemove={removeOperadora}
          onReset={resetOperadoras}
        />

        <SettingsManager
          title="Categorias de Despesas"
          items={categorias}
          onAdd={addCategoria}
          onRemove={removeCategoria}
          onReset={resetCategorias}
          badgeClassName="bg-destructive/10 text-destructive"
        />

        <SettingsManager
          title="Formas de Pagamento"
          items={formasPagamento}
          onAdd={addFormaPagamento}
          onRemove={removeFormaPagamento}
          onReset={resetFormasPagamento}
        />

        <VendedoresManager />
        
        <SupervisoresManager />
      </div>
    </div>
  );
}