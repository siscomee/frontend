import { TipoDeProduto } from './tipo-de-produto';

export interface ResultadoTipoDeProdutoForm {
  record: TipoDeProduto;
  tipoCrud: string;
  status: boolean;
}
