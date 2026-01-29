import { useState, useEffect } from 'react';

// Default values that can be extended by user
const DEFAULT_OPERADORAS = [
  'Unimed FERJ',
  'Bradesco',
  'SulAmérica',
  'Amil',
  'Porto Seguro',
  'MedSênior',
  'Prevent Senior',
  'Leve Saúde',
];

const DEFAULT_CATEGORIAS_DESPESAS = [
  'Comissão',
  'Salários',
  'Aluguel',
  'Marketing',
  'Tecnologia',
  'Transporte',
  'Alimentação',
  'Impostos',
  'Outros',
];

const DEFAULT_FORMAS_PAGAMENTO = [
  'Dinheiro',
  'PIX',
  'Boleto',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Transferência Bancária',
  'Outros',
];

// LocalStorage keys
const STORAGE_KEYS = {
  operadoras: 'odisseia_operadoras',
  categorias: 'odisseia_categorias_despesas',
  formasPagamento: 'odisseia_formas_pagamento',
};

function getStoredValue<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return defaultValue;
}

function setStoredValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
}

export function useOperadoras() {
  const [operadoras, setOperadorasState] = useState<string[]>(() => 
    getStoredValue(STORAGE_KEYS.operadoras, DEFAULT_OPERADORAS)
  );

  const addOperadora = (nome: string) => {
    if (!nome.trim() || operadoras.includes(nome.trim())) return;
    const updated = [...operadoras, nome.trim()];
    setOperadorasState(updated);
    setStoredValue(STORAGE_KEYS.operadoras, updated);
  };

  const removeOperadora = (nome: string) => {
    const updated = operadoras.filter(op => op !== nome);
    setOperadorasState(updated);
    setStoredValue(STORAGE_KEYS.operadoras, updated);
  };

  const resetOperadoras = () => {
    setOperadorasState(DEFAULT_OPERADORAS);
    setStoredValue(STORAGE_KEYS.operadoras, DEFAULT_OPERADORAS);
  };

  return { operadoras, addOperadora, removeOperadora, resetOperadoras };
}

export function useCategoriasDespesas() {
  const [categorias, setCategoriasState] = useState<string[]>(() => 
    getStoredValue(STORAGE_KEYS.categorias, DEFAULT_CATEGORIAS_DESPESAS)
  );

  const addCategoria = (nome: string) => {
    if (!nome.trim() || categorias.includes(nome.trim())) return;
    const updated = [...categorias, nome.trim()];
    setCategoriasState(updated);
    setStoredValue(STORAGE_KEYS.categorias, updated);
  };

  const removeCategoria = (nome: string) => {
    const updated = categorias.filter(cat => cat !== nome);
    setCategoriasState(updated);
    setStoredValue(STORAGE_KEYS.categorias, updated);
  };

  const resetCategorias = () => {
    setCategoriasState(DEFAULT_CATEGORIAS_DESPESAS);
    setStoredValue(STORAGE_KEYS.categorias, DEFAULT_CATEGORIAS_DESPESAS);
  };

  return { categorias, addCategoria, removeCategoria, resetCategorias };
}

export function useFormasPagamento() {
  const [formasPagamento, setFormasPagamentoState] = useState<string[]>(() => 
    getStoredValue(STORAGE_KEYS.formasPagamento, DEFAULT_FORMAS_PAGAMENTO)
  );

  const addFormaPagamento = (nome: string) => {
    if (!nome.trim() || formasPagamento.includes(nome.trim())) return;
    const updated = [...formasPagamento, nome.trim()];
    setFormasPagamentoState(updated);
    setStoredValue(STORAGE_KEYS.formasPagamento, updated);
  };

  const removeFormaPagamento = (nome: string) => {
    const updated = formasPagamento.filter(fp => fp !== nome);
    setFormasPagamentoState(updated);
    setStoredValue(STORAGE_KEYS.formasPagamento, updated);
  };

  const resetFormasPagamento = () => {
    setFormasPagamentoState(DEFAULT_FORMAS_PAGAMENTO);
    setStoredValue(STORAGE_KEYS.formasPagamento, DEFAULT_FORMAS_PAGAMENTO);
  };

  return { formasPagamento, addFormaPagamento, removeFormaPagamento, resetFormasPagamento };
}