import { ResultadoFornecedorForm } from './../../../shared/models/resultado-fornecedor-form';
import { Router } from '@angular/router';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

import { Fornecedor } from 'src/app/shared/models/fornecedor';
import { empty, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from 'src/app/shared/form-validator';
import { FornecedorService } from 'src/app/shared/services/fornecedor.service';
import { FornecedorModalComponent } from './fornecedor/fornecedor-modal.component';
import { RamoSetor } from 'src/app/shared/models/ramo-setor';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css'],
})
export class FornecedorComponent implements OnInit {
  title: string = 'Fornecedor';

  ramoSetor!: RamoSetor;

  fornecedores!: Observable<Fornecedor[]>;
  ramoSetores!: Observable<RamoSetor[]>;

  //paginação
  paginaAtual: number = 1;
  pageSize!: number;
  count = 0;
  totalElements!: number;

  //ordenação front
  key: string = 'InAtivo';
  reverse: boolean = false;

  //argumento abrirModal
  fornecedor!: Fornecedor;

  //busca e paginação
  fornecedoresResults!: Observable<Fornecedor[]>;
  ramoSetoresResults!: Observable<RamoSetor[]>;
  buscaResults!: Fornecedor[];
  error$ = new Subject<boolean>();
  queryField!: FormGroup;

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: FornecedorService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.queryField = this.formBuilder.group({
      nmFornecedor: [
        null,
        [Validators.minLength(3), Validators.maxLength(200)],
      ],
      inAtivo: ['-1'],
    });
    this.pegarLista();
  }

  //paginação
  pegarParams(
    page: number,
    inAtivo?: number,
    nmFornecedor?: string,
    nmRamoSetor?: String
  ): any {
    let params: any = {};

    if (page) {
      params['page'] = page - 1;
    }
    if (inAtivo !== undefined) {
      params['inAtivo'] = inAtivo;
    }
    if (nmFornecedor) {
      params['nmFornecedor'] = nmFornecedor;
    }
    if (nmRamoSetor) {
      params['nmRamoSetor'] = nmRamoSetor;
    }
    return params;
  }

  pegarLista() {
    const params = this.pegarParams(this.paginaAtual);

    this.service.list(params).subscribe(
      (response) => {
        this.fornecedoresResults = response?.fornecedores;
        this.ramoSetoresResults = response?.ramoSetores;
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
      'Erro ao carregar cadastros de fornecedores. Tente novamente mais tarde.'
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
    fornecedor: Fornecedor,
    tipoForm: string,
    novoCadastro: boolean,
    editavel: boolean
  ) {
    const modalRef = this.modalService.open(FornecedorModalComponent);
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.fornecedor = fornecedor;
    modalRef.componentInstance.tipoForm = tipoForm;
    modalRef.componentInstance.novoCadastro = novoCadastro;
    modalRef.componentInstance.editavel = editavel;

    const resultadoForm: Promise<ResultadoFornecedorForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoFornecedorForm>) {
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
      let nmFornecedorValue = this.queryField.get('nmFornecedor')?.value;
      let nmRamoSetorValue = this.queryField.get(
        'Fornecedor.nmRamoSetor'
      )?.value;
      this.paginaAtual = page ? page : 1;
      const params = this.pegarParams(
        this.paginaAtual,
        situacaoValue,
        nmFornecedorValue,
        nmRamoSetorValue
      );

      this.service.list(params).subscribe(
        (response) => {
          this.buscaResults = response.fornecedores;
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
