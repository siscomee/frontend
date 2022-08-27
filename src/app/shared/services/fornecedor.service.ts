import {
  tap,
  catchError,
  switchMap,
  map,
  first,
  delay,
  take,
} from 'rxjs/operators';
import { Fornecedor } from '../models/fornecedor';
import { CrudService } from '../crud-service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensagemConfirmService } from './mensagem-confirm.service';
import { AbstractControl } from '@angular/forms';
import { RamoSetor } from '../models/ramo-setor';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService extends CrudService<Fornecedor> {
  constructor(
    protected http: HttpClient,
    protected mensagem: MensagemConfirmService
  ) {
    super(http, `${environment.API}fornecedor`, mensagem);
  }

  listarTipos() {
    return this.http
      .get<RamoSetor[]>(`${environment.API}fornecedor/ramoSetores`)
      .pipe(delay(500), tap(console.log));
  }

  unicidade(idRamo: Number, nmFornecedor: String, idFornecedor: Number) {
    return this.http
      .get<Fornecedor[]>(
        `${environment.API}fornecedor/unicidade/` +
          idRamo +
          '/' +
          nmFornecedor +
          '/' +
          idFornecedor
      )
      .pipe(tap(console.log));
  }

  inativar(id: any) {
    return this.http
      .get<Fornecedor[]>(`${environment.API}fornecedor/inativar/` + id)
      .pipe(tap(console.log));
  }

  filtrar(idRamo: Number, nmFornecedor: String, situacao: String) {
    let nmFornecedorDs = nmFornecedor != '' ? nmFornecedor : 'nulo';

    return this.http
      .get<Fornecedor[]>(
        `${environment.API}fornecedor/filtrar/` +
          idRamo +
          '/' +
          nmFornecedorDs +
          '/' +
          situacao
      )
      .pipe(delay(1000), tap(console.log));
  }
}
