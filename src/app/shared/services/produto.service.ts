import {
  tap,
  catchError,
  switchMap,
  map,
  first,
  delay,
  take,
} from 'rxjs/operators';
import { CrudService } from '../crud-service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensagemConfirmService } from './mensagem-confirm.service';
import { AbstractControl } from '@angular/forms';
import { Produto } from '../models/produto';
import { TipoDeProduto } from '../models/tipo-de-produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService extends CrudService<Produto> {
  constructor(
    protected http: HttpClient,
    protected mensagem: MensagemConfirmService
  ) {
    super(http, `${environment.API}produto`, mensagem);
  }

  listarTipoDeProdutos() {
    return this.http
      .get<TipoDeProduto[]>(`${environment.API}produto/tipoProdutos`)
      .pipe(delay(1000), tap(console.log));
  }

  unicidade(param: string, id: number | null) {
    let params = new HttpParams();
    params = param
      ? params.set('nmProduto', param)
      : params.set('nmProduto', '');
    return this.http
      .get<Produto[]>(`${environment.API}produto/unicidade`, { params })
      .pipe(
        tap(console.log),
        map((dados: { nmProduto: string; id: number }[]) =>
          dados.filter((v) => v.id != id && v.nmProduto == param)
        ),
        tap(console.log),
        map((dados: any[]) => dados.length > 0),
        tap(console.log)
      );
  }
}
