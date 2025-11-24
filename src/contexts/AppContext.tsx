import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Venda, Produto, Cliente, Conta } from '@/types';
import { mockVendas, mockProdutos, mockClientes, mockContas } from '@/data/mockData';

interface AppContextType {
  vendas: Venda[];
  produtos: Produto[];
  clientes: Cliente[];
  contas: Conta[];
  addVenda: (venda: Venda) => void;
  updateVenda: (id: string, venda: Partial<Venda>) => void;
  deleteVenda: (id: string) => void;
  addProduto: (produto: Produto) => void;
  updateProduto: (id: string, produto: Partial<Produto>) => void;
  deleteProduto: (id: string) => void;
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vendas, setVendas] = useState<Venda[]>(mockVendas);
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [contas] = useState<Conta[]>(mockContas);

  const addVenda = (venda: Venda) => {
    setVendas(prev => [venda, ...prev]);
  };

  const updateVenda = (id: string, vendaUpdate: Partial<Venda>) => {
    setVendas(prev => prev.map(v => v.id === id ? { ...v, ...vendaUpdate } : v));
  };

  const deleteVenda = (id: string) => {
    setVendas(prev => prev.filter(v => v.id !== id));
  };

  const addProduto = (produto: Produto) => {
    setProdutos(prev => [produto, ...prev]);
  };

  const updateProduto = (id: string, produtoUpdate: Partial<Produto>) => {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...produtoUpdate } : p));
  };

  const deleteProduto = (id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const addCliente = (cliente: Cliente) => {
    setClientes(prev => [cliente, ...prev]);
  };

  const updateCliente = (id: string, clienteUpdate: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...clienteUpdate } : c));
  };

  const deleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        vendas,
        produtos,
        clientes,
        contas,
        addVenda,
        updateVenda,
        deleteVenda,
        addProduto,
        updateProduto,
        deleteProduto,
        addCliente,
        updateCliente,
        deleteCliente,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
