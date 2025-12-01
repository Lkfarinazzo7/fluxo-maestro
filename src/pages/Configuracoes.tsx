import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { VendedoresManager } from '@/components/Configuracoes/VendedoresManager';
import { SupervisoresManager } from '@/components/Configuracoes/SupervisoresManager';

export default function Configuracoes() {
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

        <Card>
          <CardHeader>
            <CardTitle>Operadoras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Operadoras Cadastradas</Label>
              <div className="flex flex-wrap gap-2">
                {['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Hapvida', 'Porto Seguro Saúde'].map((op) => (
                  <div key={op} className="px-3 py-1 bg-muted rounded-md text-sm">
                    {op}
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline">Gerenciar Operadoras</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Categorias de Receitas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Comissão Bancária', 'Bonificação', 'Consultoria', 'Serviços'].map((cat) => (
                    <div key={cat} className="px-3 py-1 bg-success/10 text-success rounded-md text-sm">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Categorias de Despesas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Salários', 'Aluguel', 'Marketing', 'Energia', 'Internet', 'Contador', 'Software', 'Impostos'].map((cat) => (
                    <div key={cat} className="px-3 py-1 bg-destructive/10 text-destructive rounded-md text-sm">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button variant="outline">Gerenciar Categorias</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formas de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Formas Disponíveis</Label>
              <div className="flex flex-wrap gap-2">
                {['PIX', 'Transferência Bancária', 'Boleto', 'Cartão de Crédito', 'Débito Automático'].map((forma) => (
                  <div key={forma} className="px-3 py-1 bg-muted rounded-md text-sm">
                    {forma}
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline">Gerenciar Formas de Pagamento</Button>
          </CardContent>
        </Card>

        <VendedoresManager />
        
        <SupervisoresManager />
      </div>
    </div>
  );
}
