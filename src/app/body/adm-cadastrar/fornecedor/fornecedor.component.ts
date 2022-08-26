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

  paginaAtual: number = 1;
  key: string = 'InAtivo';
  reverse: boolean = false;

  fornecedor!: Fornecedor;
  RamoSetor!: RamoSetor;

  fornecedores!: Observable<Fornecedor[]>;
  ramoSetores!: Observable<RamoSetor[]>;

  idRamo: number = 0;
  nmFornecedor: String = '';
  situacao: String = '-1';

  error$ = new Subject<boolean>();

  constructor(
    public modalService: NgbModal,
    private mensagemConfirmService: MensagemConfirmService,
    private service: FornecedorService,
    private router: Router
  ) {}

  setOrder(value: string) {
    if (this.key === value) {
      this.reverse = !this.reverse;
    }

    this.key = value;
  }

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

    console.log(fornecedor);

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
      'Erro ao carregar fornecedores. Tente novamente mais tarde...'
    );
  }

  onRefresh() {
    this.fornecedores = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );

    this.ramoSetores = this.service.listarTipos().pipe(
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
    if (this.nmFornecedor.length > 0 && this.nmFornecedor.length < 3) {
      this.mensagemConfirmService.infoToaster(
        'Informe pelo menos (3) caracteres para fornecedor.'
      );
    } else {
      this.fornecedores = this.service
        .filtrar(this.idRamo, this.nmFornecedor, this.situacao)
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
    this.idRamo = e.value;
  }

  onChangeDs(e: any) {
    console.log(e.value);
    this.nmFornecedor = e.value;
  }

  onChangeSituacao(e: any) {
    console.log(e.value);
    this.situacao = e.value;
  }
}
