import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVendedores } from '@/hooks/useVendedores';
import { useVendedoresCRUD } from '@/hooks/useVendedoresCRUD';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function VendedoresManager() {
  const { vendedores, isLoading } = useVendedores();
  const { createVendedor, updateVendedor, deleteVendedor, isCreating, isUpdating, isDeleting } = useVendedoresCRUD();
  const [newVendedor, setNewVendedor] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNome, setEditingNome] = useState('');

  const handleCreate = () => {
    if (newVendedor.trim()) {
      createVendedor(newVendedor.trim());
      setNewVendedor('');
    }
  };

  const handleStartEdit = (id: string, nome: string) => {
    setEditingId(id);
    setEditingNome(nome);
  };

  const handleSaveEdit = () => {
    if (editingId && editingNome.trim()) {
      updateVendedor({ id: editingId, nome: editingNome.trim() });
      setEditingId(null);
      setEditingNome('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingNome('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendedores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar novo vendedor */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-vendedor" className="sr-only">Novo Vendedor</Label>
            <Input
              id="new-vendedor"
              placeholder="Nome do vendedor"
              value={newVendedor}
              onChange={(e) => setNewVendedor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <Button onClick={handleCreate} disabled={isCreating || !newVendedor.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Lista de vendedores */}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : vendedores.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum vendedor cadastrado</p>
          ) : (
            vendedores.map((vendedor) => (
              <div key={vendedor.id} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {editingId === vendedor.id ? (
                  <>
                    <Input
                      value={editingNome}
                      onChange={(e) => setEditingNome(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="flex-1"
                    />
                    <Button size="icon" variant="ghost" onClick={handleSaveEdit} disabled={isUpdating}>
                      <Check className="h-4 w-4 text-success" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{vendedor.nome}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStartEdit(vendedor.id, vendedor.nome)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" disabled={isDeleting}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover o vendedor "{vendedor.nome}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteVendedor(vendedor.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}