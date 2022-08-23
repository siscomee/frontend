import { Router } from '@angular/router';
import { MensagemConfirmService } from './../../../shared/services/mensagem-confirm.service';
import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RamoSetorModalComponent } from './ramo-setor-modal/ramo-setor-modal.component';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from 'src/app/shared/form-validator';
import { ResultadoRamoSetorForm } from 'src/app/shared/models/resultado-ramo-setor-form';
import { RamoSetorService } from 'src/app/shared/services/ramo-setor.service';
import { RamoSetor } from 'src/app/shared/models/ramo-setor';

@Component({
  selector: 'app-ramo-setor',
  templateUrl: './ramo-setor.component.html',
  styleUrls: ['./ramo-setor.component.css'],
})
export class RamoSetorComponent implements OnInit {
  title: string = 'Ramo';

  //paginação
  paginaAtual: number = 1;
  pageSize!: number;
  count = 0;
  totalElements!: number;

  //ordenação front
  key: string = 'InAtivo';
  reverse: boolean = false;

  //argumento abrirModal
  ramoSetor!: RamoSetor;

  //busca e paginação
  ramoSetoresResults!: Observable<RamoSetor[]>;
  buscaResults!: RamoSetor[];
  error$ = new Subject<boolean>();
  queryField!: FormGroup;

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: RamoSetorService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.queryField = this.formBuilder.group({
      nmRamoSetor: [null, [Validators.minLength(3), Validators.maxLength(45)]],
      inAtivo: ['-1'],
    });
    this.pegarLista();
  }

  //paginação
  pegarParams(page: number, inAtivo?: number, nmRamoSetor?: string): any {
    let params: any = {};

    if (page) {
      params['page'] = page - 1;
    }
    if (inAtivo !== undefined) {
      params['inAtivo'] = inAtivo;
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
      'Erro ao carregar cadastros de ramos (Setores). Tente novamente mais tarde.'
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
    ramoSetor: RamoSetor,
    tipoForm: string,
    novoCadastro: boolean,
    editavel: boolean
  ) {
    const modalRef = this.modalService.open(RamoSetorModalComponent);
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.ramoSetor = ramoSetor;
    modalRef.componentInstance.tipoForm = tipoForm;
    modalRef.componentInstance.novoCadastro = novoCadastro;
    modalRef.componentInstance.editavel = editavel;

    const resultadoForm: Promise<ResultadoRamoSetorForm> = modalRef.result;
    this.onResultadoForm(resultadoForm);
  }

  onResultadoForm(resultadoForm: Promise<ResultadoRamoSetorForm>) {
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
      let idValue = this.queryField.get('id')?.value;
      let nmRamoSetorValue = this.queryField.get('nmRamoSetor')?.value;
      this.paginaAtual = page ? page : 1;
      const params = this.pegarParams(
        this.paginaAtual,
        situacaoValue,
        nmRamoSetorValue
      );

      this.service.list(params).subscribe(
        (response) => {
          this.buscaResults = response.ramoSetores;
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
