import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDespesasCRUD, DespesaFormData } from '@/hooks/useDespesasCRUD';
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';

interface ImportedRow {
  categoria: string;
  tipo: 'fixa' | 'variavel';
  fornecedor: string;
  valor: number;
  data_prevista: string;
  data_paga?: string;
  forma_pagamento: string;
  status: 'previsto' | 'pago';
  valid: boolean;
  errors: string[];
}

export function ExcelImportDialog() {
  const [open, setOpen] = useState(false);
  const [importedData, setImportedData] = useState<ImportedRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createDespesa, isCreating } = useDespesasCRUD();

  const parseExcelDate = (value: any): string => {
    if (!value) return '';
    
    // If it's already a string in YYYY-MM-DD format
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    
    // If it's a string in DD/MM/YYYY format
    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const parts = value.split('/');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // If it's an Excel date number
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
      }
    }
    
    // Try parsing as Date
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      // ignore
    }
    
    return '';
  };

  const validateRow = (row: any): ImportedRow => {
    const errors: string[] = [];
    
    // Validate categoria
    const categoria = String(row['Categoria'] || row['categoria'] || '').trim();
    if (!categoria) errors.push('Categoria é obrigatória');
    
    // Validate tipo
    let tipo: 'fixa' | 'variavel' = 'variavel';
    const tipoRaw = String(row['Tipo'] || row['tipo'] || '').toLowerCase().trim();
    if (tipoRaw === 'fixa' || tipoRaw === 'fixo') {
      tipo = 'fixa';
    } else if (tipoRaw === 'variavel' || tipoRaw === 'variável') {
      tipo = 'variavel';
    } else if (tipoRaw) {
      errors.push('Tipo deve ser "fixa" ou "variavel"');
    }
    
    // Validate fornecedor
    const fornecedor = String(row['Fornecedor'] || row['fornecedor'] || '').trim();
    if (!fornecedor) errors.push('Fornecedor é obrigatório');
    
    // Validate valor
    const valorRaw = row['Valor'] || row['valor'];
    const valor = parseFloat(String(valorRaw).replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    if (valor <= 0) errors.push('Valor deve ser maior que zero');
    
    // Validate data_prevista
    const dataPrevista = parseExcelDate(row['Data prevista'] || row['data_prevista'] || row['Data Prevista']);
    if (!dataPrevista) errors.push('Data prevista é obrigatória');
    
    // Parse data_paga (optional)
    const dataPaga = parseExcelDate(row['Data paga'] || row['data_paga'] || row['Data Paga']);
    
    // Validate forma_pagamento
    const formaPagamento = String(row['Forma de pagamento'] || row['forma_pagamento'] || row['Forma Pagamento'] || '').trim();
    if (!formaPagamento) errors.push('Forma de pagamento é obrigatória');
    
    // Validate status
    let status: 'previsto' | 'pago' = 'previsto';
    const statusRaw = String(row['Status'] || row['status'] || '').toLowerCase().trim();
    if (statusRaw === 'pago' || statusRaw === 'paga') {
      status = 'pago';
    } else if (statusRaw === 'previsto' || statusRaw === 'pendente') {
      status = 'previsto';
    } else if (statusRaw) {
      errors.push('Status deve ser "previsto" ou "pago"');
    }
    
    return {
      categoria,
      tipo,
      fornecedor,
      valor,
      data_prevista: dataPrevista,
      data_paga: dataPaga || undefined,
      forma_pagamento: formaPagamento,
      status,
      valid: errors.length === 0,
      errors,
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const validatedData = jsonData.map(validateRow);
        setImportedData(validatedData);
        
        const validCount = validatedData.filter(r => r.valid).length;
        const invalidCount = validatedData.length - validCount;
        
        toast({
          title: 'Planilha carregada',
          description: `${validCount} linhas válidas, ${invalidCount} com erros`,
        });
      } catch (error) {
        toast({
          title: 'Erro ao ler arquivo',
          description: 'Verifique se o arquivo é uma planilha Excel válida (.xlsx ou .xls)',
          variant: 'destructive',
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    const validRows = importedData.filter(r => r.valid);
    if (validRows.length === 0) {
      toast({
        title: 'Nenhum dado válido',
        description: 'Corrija os erros na planilha antes de importar',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const row of validRows) {
      try {
        const despesaData: DespesaFormData = {
          nome: `${row.categoria} - ${row.fornecedor}`,
          valor: row.valor,
          categoria: row.categoria,
          tipo: row.tipo,
          fornecedor: row.fornecedor,
          recorrente: false,
          data_prevista: row.data_prevista,
          data_paga: row.data_paga,
          forma_pagamento: row.forma_pagamento,
          status: row.status,
        };
        
        createDespesa(despesaData);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    setIsImporting(false);
    setImportedData([]);
    setOpen(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: 'Importação concluída',
      description: `${successCount} despesas importadas com sucesso${errorCount > 0 ? `, ${errorCount} erros` : ''}`,
    });
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Categoria': 'Salários',
        'Tipo': 'fixa',
        'Fornecedor': 'Empresa XYZ',
        'Valor': 1500.00,
        'Data prevista': '2025-01-15',
        'Data paga': '',
        'Forma de pagamento': 'Transferência Bancária',
        'Status': 'previsto',
      },
      {
        'Categoria': 'Marketing',
        'Tipo': 'variavel',
        'Fornecedor': 'Agência ABC',
        'Valor': 2500.50,
        'Data prevista': '2025-01-20',
        'Data paga': '2025-01-20',
        'Forma de pagamento': 'PIX',
        'Status': 'pago',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Despesas');
    XLSX.writeFile(wb, 'modelo_importacao_despesas.xlsx');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Importar Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Despesas do Excel</DialogTitle>
          <DialogDescription>
            Faça upload de uma planilha Excel com as colunas: Categoria, Tipo, Fornecedor, Valor, Data prevista, Data paga, Forma de pagamento, Status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="excel-file">Arquivo Excel</Label>
              <Input
                id="excel-file"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="mt-1"
              />
            </div>
            <div className="pt-6">
              <Button variant="outline" onClick={downloadTemplate}>
                Baixar Modelo
              </Button>
            </div>
          </div>

          {importedData.length > 0 && (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data Prevista</TableHead>
                      <TableHead>Data Paga</TableHead>
                      <TableHead>Forma Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((row, index) => (
                      <TableRow key={index} className={row.valid ? '' : 'bg-destructive/10'}>
                        <TableCell>
                          {row.valid ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <span title={row.errors.join(', ')}>
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{row.categoria}</TableCell>
                        <TableCell>{row.tipo}</TableCell>
                        <TableCell>{row.fornecedor}</TableCell>
                        <TableCell>{formatCurrency(row.valor)}</TableCell>
                        <TableCell>{row.data_prevista}</TableCell>
                        <TableCell>{row.data_paga || '-'}</TableCell>
                        <TableCell>{row.forma_pagamento}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {importedData.filter(r => r.valid).length} de {importedData.length} linhas válidas
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImportedData([])}>
                    Limpar
                  </Button>
                  <Button onClick={handleImport} disabled={isImporting || isCreating}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isImporting ? 'Importando...' : 'Importar Despesas'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}