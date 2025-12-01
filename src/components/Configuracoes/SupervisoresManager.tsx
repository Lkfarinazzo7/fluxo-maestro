import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupervisores } from '@/hooks/useSupervisores';
import { useSupervisoresCRUD } from '@/hooks/useSupervisoresCRUD';
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

export function SupervisoresManager() {
  const { supervisores, isLoading } = useSupervisores();
  const { createSupervisor, updateSupervisor, deleteSupervisor, isCreating, isUpdating, isDeleting } = useSupervisoresCRUD();
  const [newSupervisor, setNewSupervisor] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNome, setEditingNome] = useState('');

  const handleCreate = () => {
    if (newSupervisor.trim()) {
      createSupervisor(newSupervisor.trim());
      setNewSupervisor('');
    }
  };

  const handleStartEdit = (id: string, nome: string) => {
    setEditingId(id);
    setEditingNome(nome);
  };

  const handleSaveEdit = () => {
    if (editingId && editingNome.trim()) {
      updateSupervisor({ id: editingId, nome: editingNome.trim() });
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
        <CardTitle>Supervisores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar novo supervisor */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-supervisor" className="sr-only">Novo Supervisor</Label>
            <Input
              id="new-supervisor"
              placeholder="Nome do supervisor"
              value={newSupervisor}
              onChange={(e) => setNewSupervisor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <Button onClick={handleCreate} disabled={isCreating || !newSupervisor.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Lista de supervisores */}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : supervisores.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum supervisor cadastrado</p>
          ) : (
            supervisores.map((supervisor) => (
              <div key={supervisor.id} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {editingId === supervisor.id ? (
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
                    <span className="flex-1 font-medium">{supervisor.nome}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStartEdit(supervisor.id, supervisor.nome)}
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
                            Tem certeza que deseja remover o supervisor "{supervisor.nome}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteSupervisor(supervisor.id)}>
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