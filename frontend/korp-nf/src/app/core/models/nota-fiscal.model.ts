export interface ItemNota {
  id?: number;
  notaFiscalId?: number;
  produtoId: number;
  quantidade: number;
}

export interface NotaFiscal {
  id?: number;
  numero?: number;
  status?: string;
  criadoEm?: string;
  itens: ItemNota[];
}