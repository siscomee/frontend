import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormValidator } from './../../../shared/form-validator';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { TipoDeProdutoService } from 'src/app/shared/services/tipo-de-produto.service';
import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';
import { TipoDeProdutoModalComponent } from './tipo-de-produto-modal/tipo-de-produto-modal.component';
import { ResultadoTipoDeProdutoForm } from 'src/app/shared/models/resultado-tipo-de-produto-form';

@Component({
  selector: 'app-tipo-de-produto',
  templateUrl: './tipo-de-produto.component.html',
  styleUrls: ['./tipo-de-produto.component.css'],
})
export class TipoDeProdutoComponent implements OnInit {
  title: string = 'Tipo de produto';

  //paginação
  paginaAtual: number = 1;
  pageSize!: number;
  count = 0;
  totalElements!: number;

  //ordenação front
  key: string = 'InAtivo';
  reverse: boolean = false;

  //argumento abrirModal
  tipoProduto!: TipoDeProduto;

  //busca e paginação
  tipoProdutos!: Observable<TipoDeProduto[]>;
  buscaResults!: TipoDeProduto[];
  error$ = new Subject<boolean>();
  queryField!: FormGroup;
  tipoProdutosResult: any;

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: TipoDeProdutoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.queryField = this.formBuilder.group({
      dsTipoProduto: [
        null,
        [Validators.minLength(3), Validators.maxLength(100)],
      ],
      inAtivo: ['-1'],
    });
    this.pegarLista();
  }

  //paginação
  pegarParams(page: number, inAtivo?: number, dsTipoProduto?: string): any {
    let params: any = {};

    if (page) {
      params['page'] = page - 1;
    }
    if (inAtivo !== undefined) {
      params['inAtivo'] = inAtivo;
    }
    if (dsTipoProduto) {
      params['dsTipoProduto'] = dsTipoProduto;
    }
    return params;
  }

  pegarLista() {
    const params = this.pegarParams(this.paginaAtual);

    this.service.list(params).subscribe(
      (response) => {
        this.tipoProdutosResult = response?.tipoProdutos;
        this.pageSize = response?.paginaItens;
        this.count = response?.itensTotal;
      },
      (error) => {
        console.log(error);
        this.handleError();
      }
    );
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster(
      'Erro ao carregar cadastros de tipos de produtos. Tente novamente mais tarde.'
    );
  }

  handlePageChange(event: number): void {
    this.paginaAtual = event;
    console.log(event);
    if (this.buscaResults) {
      this.onBuscar(event);
    } else this.pegarLista();
  }

  setOrder(value: string) {
    if (this.key === value) {
      this.reverse = !this.reverse;
    }

    this.key = value;
  }

  //modal
  abrirModal(
    tipoDeProduto: TipoDeProduto,
    tipoForm: string,
    novoCadastro: boolean,
    editavel: boolean
  ) {
    const modalRef = this.modalService.open(TipoDeProdutoModalComponent);
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.tipoDeProduto = tipoDeProduto;
    modalRef.componentInstance.tipoForm = tipoForm;
    modalRef.componentInstance.novoCadastro = novoCadastro;
    modalRef.componentInstance.editavel = editavel;

    const resultadoForm: Promise<ResultadoTipoDeProdutoForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoTipoDeProdutoForm>) {
    resultadoForm
      .then((form) => {
        if (form.tipoCrud !== 'c') {
          this.mensagemConfirmService.abrirToast(resultadoForm);
        } else {
          this.mensagemConfirmService.abrirToast(resultadoForm);
          this.refreshPage();
        }
      })
      .catch(() => {
        console.log('Manter página');
      });
  }

  refreshPage() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }

  //busca
  verificaCampo(campo: string) {
    return this.queryField.get(campo)?.errors;
  }

  aplicaCssErro(campo: string) {
    return { 'is-invalid': this.verificaCampo(campo) };
  }

  onBuscar(page?: number) {
    if (this.queryField.valid) {
      let situacaoValue =
        Number(this.queryField.get('inAtivo')?.value) === -1
          ? undefined
          : Number(this.queryField.get('inAtivo')?.value);
      let dsTipoProdutoValue = this.queryField.get('dsTipoProduto')?.value;
      this.paginaAtual = page ? page : 1;
      const params = this.pegarParams(
        this.paginaAtual,
        situacaoValue,
        dsTipoProdutoValue
      );

      this.service.list(params).subscribe(
        (response) => {
          this.buscaResults = response.tipoProdutos;
          this.pageSize = response.paginaItens;
          this.count = response.itensTotal;
        },
        (error) => {
          console.log(error);
          this.handleError();
        }
      );
    } else {
      FormValidator.verificaValidacoesForm(this.queryField);
    }
  }
}
