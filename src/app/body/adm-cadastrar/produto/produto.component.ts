import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormValidator } from './../../../shared/form-validator';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { ProdutoService } from '../../../shared/services/produto.service';
import { Produto } from '../../../shared/models/produto';
import { ProdutoModalComponent } from './produto-modal/produto-modal.component';
import { ResultadoProdutoForm } from '../../../shared/models/resultado-produto-form';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
  title: string = 'Produto';

  tipoDeProduto!: TipoDeProduto;

  produtos!: Observable<Produto[]>;
  tipoDeProdutos!: Observable<TipoDeProduto[]>;

  //paginação
  paginaAtual: number = 1;
  pageSize!: number;
  count = 0;
  totalElements!: number;

  //ordenação front
  key: string = 'InAtivo';
  reverse: boolean = false;

  //argumento abrirModal
  produto!: Produto;

  //busca e paginação
  produtosResult!: Observable<Produto[]>;
  buscaResults!: Produto[];
  error$ = new Subject<boolean>();
  queryField!: FormGroup;
  tipoDeProdutosResults: any;

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: ProdutoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.queryField = this.formBuilder.group({
      nmProduto: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      nuCnpj: [null],
      inAtivo: ['-1'],
    });
    this.pegarLista();
  }

  //paginação
  pegarParams(page: number, inAtivo?: number, nmProduto?: string): any {
    let params: any = {};

    if (page) {
      params['page'] = page - 1;
    }
    if (inAtivo !== undefined) {
      params['inAtivo'] = inAtivo;
    }
    if (nmProduto) {
      params['nmProduto'] = nmProduto;
    }
    return params;
  }

  pegarLista() {
    const params = this.pegarParams(this.paginaAtual);

    this.service.list(params).subscribe(
      (response) => {
        this.produtosResult = response?.produtos;
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
      'Erro ao carregar cadastros de produtos. Tente novamente mais tarde.'
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

    const resultadoForm: Promise<ResultadoProdutoForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoProdutoForm>) {
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
      let nmProdutoValue = this.queryField.get('nmProdutoValue')?.value;
      this.paginaAtual = page ? page : 1;
      const params = this.pegarParams(
        this.paginaAtual,
        situacaoValue,
        nmProdutoValue
      );

      this.service.list(params).subscribe(
        (response) => {
          this.buscaResults = response.produtos;
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

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e: any) {
    e.preventDefault();
    console.log('foi...');
  }
}
