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

  listarRamoSetores() {
    return this.http
      .get<RamoSetor[]>(`${environment.API}fornecedor/ramoSetores`)
      .pipe(delay(1000), tap(console.log));
  }

  unicidade(param: string, id: number | null) {
    let params = new HttpParams();
    params = param
      ? params.set('nmFornecedor', param)
      : params.set('nmFornecedor', '');
    return this.http
      .get<Fornecedor[]>(`${environment.API}fornecedor/unicidade`, { params })
      .pipe(
        tap(console.log),
        map((dados: { nmFornecedor: string; id: number }[]) =>
          dados.filter((v) => v.id != id && v.nmFornecedor == param)
        ),
        tap(console.log),
        map((dados: any[]) => dados.length > 0),
        tap(console.log)
      );
  }
}
