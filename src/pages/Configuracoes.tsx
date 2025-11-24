import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
            <CardTitle>Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input id="razaoSocial" placeholder="Nome da empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contato@empresa.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 0000-0000" />
              </div>
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moeda">Moeda Padrão</Label>
              <Input id="moeda" value="BRL (R$)" disabled />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Input id="timezone" value="America/Sao_Paulo" disabled />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="formato-data">Formato de Data</Label>
              <Input id="formato-data" value="DD/MM/YYYY" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Alertas de Estoque Baixo</p>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando produtos estiverem abaixo do estoque mínimo
                </p>
              </div>
              <Button variant="outline">Ativado</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Contas a Vencer</p>
                <p className="text-sm text-muted-foreground">
                  Alertas sobre contas próximas ao vencimento
                </p>
              </div>
              <Button variant="outline">Ativado</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Novas Vendas</p>
                <p className="text-sm text-muted-foreground">
                  Notificações de novas vendas realizadas
                </p>
              </div>
              <Button variant="outline">Ativado</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
