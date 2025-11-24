import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import { formatCurrency, formatCPFCNPJ, formatPhone, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';

export default function Clientes() {
  const { clientes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome/Razão Social</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Total Comprado</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-accent cursor-pointer">
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCPFCNPJ(cliente.cpfCnpj)}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{formatPhone(cliente.telefone)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(cliente.totalComprado)}
                  </TableCell>
                  <TableCell>
                    {cliente.ultimaCompra ? formatDate(cliente.ultimaCompra) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cliente.status)}>
                      {getStatusLabel(cliente.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
