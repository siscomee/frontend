import {
  tap,
  catchError,
  switchMap,
  map,
  first,
  delay,
  take,
} from 'rxjs/operators';
import { Produto } from '../models/produto';
import { CrudService } from '../crud-service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensagemConfirmService } from './mensagem-confirm.service';
import { AbstractControl } from '@angular/forms';
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

  listarTipos() {
    return this.http
      .get<Produto[]>(`${environment.API}produto/tipoDeProdutos`)
      .pipe(delay(500), tap(console.log));
  }

  unicidade(idTipoDeProduto: Number, nmProduto: String, idProduto: Number) {
    return this.http
      .get<Produto[]>(
        `${environment.API}produto/unicidade/` +
          idTipoDeProduto +
          '/' +
          nmProduto +
          '/' +
          idProduto
      )
      .pipe(tap(console.log));
  }

  inativar(id: any) {
    return this.http
      .get<Produto[]>(`${environment.API}produto/inativar/` + id)
      .pipe(tap(console.log));
  }

  filtrar(idTipoDeProduto: Number, nmProduto: String, situacao: String) {
    let nmProdutoDs = nmProduto != '' ? nmProduto : 'nulo';

    return this.http
      .get<Produto[]>(
        `${environment.API}produto/filtrar/` +
          idTipoDeProduto +
          '/' +
          nmProdutoDs +
          '/' +
          situacao
      )
      .pipe(delay(1000), tap(console.log));
  }
}
