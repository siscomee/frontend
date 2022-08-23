import { Fornecedor } from './fornecedor';

export interface ResultadoFornecedorForm {
  record: Fornecedor;
  tipoCrud: string;
  status: boolean;
}
