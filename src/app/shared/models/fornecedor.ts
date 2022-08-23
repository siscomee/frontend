export interface Fornecedor {
  id: number;
  nmFornecedor: string;
  nuCnpj: string;
  nuTelefone: string;
  inAtivo: number;
  ramoSetorId: number;
  nmRamoSetor: string;
  usuarioIdAtualiza: number;
  dtUltAtualiza: Date;
}
