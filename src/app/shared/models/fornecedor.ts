export interface Fornecedor {
  id: number;
  nmFornecedor: string;
  nuCnpj: string;
  nuTelefone: string;
  ramoSetorId: number;
  nmRamoSetor: string;
  inAtivo: any;
  usuarioIdAtualiza: number;
  dtUltAtualiza: Date;
}
