import { ResultadoProdutoForm } from '../../../shared/models/resultado-produto-form';
import { Router } from '@angular/router';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

import { Produto } from '../../../shared/models/produto';
import { empty, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidator } from './../../../shared/form-validator';
import { ProdutoService } from '../../../shared/services/produto.service';
import { ProdutoModalComponent } from './produto-modal/produto-modal.component';
import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
  title: string = 'Produto';

  paginaAtual: number = 1;
  key: string = 'InAtivo';
  reverse: boolean = false;

  produto!: Produto;
  TipoDeProduto!: TipoDeProduto;

  produtos!: Observable<Produto[]>;
  tipoDeProdutos!: Observable<TipoDeProduto[]>;

  idTipoDeProduto: number = 0;
  nmProduto: String = '';
  situacao: String = '-1';

  error$ = new Subject<boolean>();

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: ProdutoService,
    private router: Router
  ) {}

  setOrder(value: string) {
    if (this.key === value) {
      this.reverse = !this.reverse;
    }

    this.key = value;
  }

  abrirModal(
    produto: Produto,
    tipoForm: string,
    novoCadastro: boolean,
    editavel: boolean
  ) {
    const modalRef = this.modalService.open(ProdutoModalComponent);
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.produto = produto;
    modalRef.componentInstance.tipoForm = tipoForm;
    modalRef.componentInstance.novoCadastro = novoCadastro;
    modalRef.componentInstance.editavel = editavel;

    console.log(produto);

    const resultadoForm: Promise<ResultadoProdutoForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoProdutoForm>) {
    resultadoForm
      .then((form) => {
        if (form.tipoCrud !== 'c') {
          this.mensagemConfirmService.abrirToast(resultadoForm);
          this.refresh();
        } else {
          this.mensagemConfirmService.abrirToast(resultadoForm);
          this.refresh();
        }
      })
      .catch(() => {
        console.log('Manter página');
      });
  }

  ngOnInit(): void {
    this.onRefresh();
  }

  refresh() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster(
      'Erro ao carregar produtos. Tente novamente mais tarde...'
    );
  }

  onRefresh() {
    this.produtos = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );

    this.tipoDeProdutos = this.service.listarTipos().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
  }

  filtrar() {
    // validar min. caracteres
    if (this.nmProduto.length > 0 && this.nmProduto.length < 3) {
      this.mensagemConfirmService.infoToaster(
        'Informe pelo menos (3) caracteres para produto.'
      );
    } else {
      this.produtos = this.service
        .filtrar(this.idTipoDeProduto, this.nmProduto, this.situacao)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error$.next(true);
            this.handleError();
            return empty();
          })
        );
    }
  }

  onChangeTipo(e: any) {
    console.log(e.value);
    this.idTipoDeProduto = e.value;
  }

  onChangeDs(e: any) {
    console.log(e.value);
    this.nmProduto = e.value;
  }

  onChangeSituacao(e: any) {
    console.log(e.value);
    this.situacao = e.value;
  }
}
