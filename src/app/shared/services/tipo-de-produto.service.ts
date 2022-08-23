import {
  tap,
  catchError,
  switchMap,
  map,
  first,
  delay,
  take,
} from 'rxjs/operators';
import { TipoDeProduto } from '../models/tipo-de-produto';
import { CrudService } from '../crud-service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensagemConfirmService } from './mensagem-confirm.service';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TipoDeProdutoService extends CrudService<TipoDeProduto> {
  constructor(
    protected http: HttpClient,
    protected mensagem: MensagemConfirmService
  ) {
    super(http, `${environment.API}tipoProduto`, mensagem);
  }

  unicidade(param: string, id: number | null) {
    let params = new HttpParams();
    params = param
      ? params.set('dsTipoProduto', param)
      : params.set('dsTipoProduto', '');
    return this.http
      .get<TipoDeProduto[]>(`${environment.API}tipoProduto/unicidade`, {
        params,
      })
      .pipe(
        tap(console.log),
        map((dados: { dsTipoProduto: string; id: number }[]) =>
          dados.filter((v) => v.id != id && v.dsTipoProduto == param)
        ),
        tap(console.log),
        map((dados: any[]) => dados.length > 0),
        tap(console.log)
      );
  }
}
