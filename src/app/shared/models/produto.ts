export interface Produto {
  id: number;
  nmProduto: string;
  vlProduto: number;
  tpMedida: string;
  qtdProduto: number;
  inAtivo: number;
  tipoProdutoId: number;
  usuarioIdAtualiza: number;
  dtUltAtualiza: Date;
}
