import { Produto } from './produto';

export interface ResultadoProdutoForm {
  record: Produto;
  tipoCrud: string;
  status: boolean;
}
