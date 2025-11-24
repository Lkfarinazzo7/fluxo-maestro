import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Contrato, Entrada, Saida } from '@/types';
import { mockContratos, mockEntradas, mockSaidas } from '@/data/mockData';

interface AppContextType {
  contratos: Contrato[];
  entradas: Entrada[];
  saidas: Saida[];
  addContrato: (contrato: Contrato) => void;
  updateContrato: (id: string, contrato: Partial<Contrato>) => void;
  deleteContrato: (id: string) => void;
  addEntrada: (entrada: Entrada) => void;
  updateEntrada: (id: string, entrada: Partial<Entrada>) => void;
  deleteEntrada: (id: string) => void;
  addSaida: (saida: Saida) => void;
  updateSaida: (id: string, saida: Partial<Saida>) => void;
  deleteSaida: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [contratos, setContratos] = useState<Contrato[]>(mockContratos);
  const [entradas, setEntradas] = useState<Entrada[]>(mockEntradas);
  const [saidas, setSaidas] = useState<Saida[]>(mockSaidas);

  const addContrato = (contrato: Contrato) => {
    setContratos(prev => [contrato, ...prev]);
  };

  const updateContrato = (id: string, contratoUpdate: Partial<Contrato>) => {
    setContratos(prev => prev.map(c => c.id === id ? { ...c, ...contratoUpdate } : c));
  };

  const deleteContrato = (id: string) => {
    setContratos(prev => prev.filter(c => c.id !== id));
  };

  const addEntrada = (entrada: Entrada) => {
    setEntradas(prev => [entrada, ...prev]);
  };

  const updateEntrada = (id: string, entradaUpdate: Partial<Entrada>) => {
    setEntradas(prev => prev.map(e => e.id === id ? { ...e, ...entradaUpdate } : e));
  };

  const deleteEntrada = (id: string) => {
    setEntradas(prev => prev.filter(e => e.id !== id));
  };

  const addSaida = (saida: Saida) => {
    setSaidas(prev => [saida, ...prev]);
  };

  const updateSaida = (id: string, saidaUpdate: Partial<Saida>) => {
    setSaidas(prev => prev.map(s => s.id === id ? { ...s, ...saidaUpdate } : s));
  };

  const deleteSaida = (id: string) => {
    setSaidas(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        contratos,
        entradas,
        saidas,
        addContrato,
        updateContrato,
        deleteContrato,
        addEntrada,
        updateEntrada,
        deleteEntrada,
        addSaida,
        updateSaida,
        deleteSaida,
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
