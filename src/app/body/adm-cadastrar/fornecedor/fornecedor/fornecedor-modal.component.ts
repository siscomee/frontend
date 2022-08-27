import { FornecedorService } from './../../../../shared/services/fornecedor.service';
import { Fornecedor } from 'src/app/shared/models/fornecedor';
import { ResultadoFornecedorForm } from 'src/app/shared/models/resultado-fornecedor-form';
import { RamoSetor } from 'src/app/shared/models/ramo-setor';

import { switchMap, delay, map, tap, first, catchError } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidator } from './../../../../shared/form-validator';
import { ToastService } from 'src/app/shared/services/toast.service';
import { empty, Observable, Subject } from 'rxjs';
import { MensagemConfirmService } from 'src/app/shared/services/mensagem-confirm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fornecedor-modal',
  templateUrl: './fornecedor-modal.component.html',
  styleUrls: ['./fornecedor-modal.component.css'],
})
export class FornecedorModalComponent implements OnInit {
  formModal!: FormGroup;
  resultado!: ResultadoFornecedorForm;
  ramoSetores!: Observable<RamoSetor[]>;
  fornecedoresUnicidade!: Observable<Fornecedor[]>;

  idRamo: number = 0;
  nmFornecedor: String = '';
  situacao: String = '-1';

  error$ = new Subject<boolean>();

  @Input() title!: string;
  @Input() public fornecedor!: Fornecedor;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private service: FornecedorService,
    private mensagemConfirmService: MensagemConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      id: [null],
      usuarioIdAtualiza: [1],
      dtUltAtualiza: [new Date().toISOString()],
      ramoSetorId: [null, [Validators.required]],
      nmFornecedor: [null, [Validators.required, Validators.maxLength(100)]],
      nuCnpj: [null, [Validators.required]],
      nuTelefone: [null, [Validators.required]],
      inAtivo: ['1'],
    });
    if (this.fornecedor != undefined) {
      this.formModal.patchValue({
        id: this.fornecedor.id.toString(),
        ramoSetorId: this.fornecedor.ramoSetorId.toString(),
        nmFornecedor: this.fornecedor.nmFornecedor,
        nuCnpj: this.fornecedor.nuCnpj,
        nuTelefone: this.fornecedor.nuTelefone,
        inAtivo: this.fornecedor.inAtivo.toString(),
        usuarioIdAtualiza: this.fornecedor.usuarioIdAtualiza,
        dtUltAtualiza: this.fornecedor.dtUltAtualiza,
      });
    }

    this.ramoSetores = this.service.listarTipos().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  converterInAtivo() {
    this.formModal.patchValue({
      inAtivo: Number(this.formModal.get('inAtivo')?.value),
    });
    this.formModal.patchValue({
      ramoSetorId: Number(this.formModal.get('ramoSetorId')?.value),
    });
  }

  async onSalvar() {
    this.converterInAtivo();

    if (this.formModal.valid) {
      if ((await this.validarUnicidade()) == false) {
        this.mensagemConfirmService.infoToaster('Informação já cadastrada.');
        return;
      }

      this.service.save(this.formModal.value).subscribe((res: Fornecedor) => {
        let resultado: ResultadoFornecedorForm = {
          record: res,
          tipoCrud: '',
          status: false,
        };
        if (res) {
          if (res.id == this.formModal.get('id')?.value) {
            resultado = { record: res, tipoCrud: 'u', status: true };

            let currentUrl = this.router.url;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate([currentUrl]);
          } else {
            resultado = { record: res, tipoCrud: 'c', status: true };
          }
        }

        console.log(res);
        this.activeModal.close(resultado);
      });
    } else {
      this.verificaValidacoesForm(this.formModal);
      console.log('fomulário não está válido');
    }
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster(
      'Erro ao carregar cadastros de fornecedores. Tente novamente mais tarde...'
    );
  }

  cadastrar(fornecedor: any) {
    fornecedor.date = new Date();
    this.resultado = {
      record: this.fornecedor,
      tipoCrud: 'c',
      status: true,
    };

    const crudResult = this.service.save(this.formModal.value);

    console.log(this.resultado);

    this.activeModal.close(this.resultado);
  }

  editarCadastroTela(res: ResultadoFornecedorForm) {
    this.fornecedor.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.fornecedor.dtUltAtualiza = res.record.dtUltAtualiza;
    this.fornecedor.nmFornecedor = res.record.nmFornecedor;
    this.fornecedor.nuCnpj = res.record.nuCnpj;
    this.fornecedor.nuTelefone = res.record.nuTelefone;
    this.fornecedor.ramoSetorId = res.record.ramoSetorId;
    this.fornecedor.inAtivo = res.record.inAtivo;
  }

  cadastrando() {
    if (this.formModal.valid) {
      this.cadastrar(this.formModal.value);
    } else {
      this.verificaValidacoesForm(this.formModal);
      console.log('fomulário não está válido');
    }
  }

  Ondeletar() {
    this.inativar();

    this.service
      .inativar(this.formModal.get('id')?.value)
      .subscribe((res: any) => {
        let resultado: ResultadoFornecedorForm;
        if (res) {
          resultado = { record: res, tipoCrud: 'd', status: true };
        } else {
          this.formModal.patchValue({ inAtivo: 1 });
          this.fornecedor.inAtivo = this.formModal.get('inAtivo')?.value;
          resultado = { record: res, tipoCrud: '', status: true };
        }
        console.log(resultado);
        this.activeModal.close(resultado);
      });
  }

  async validarUnicidade() {
    let unico = false;

    const response = await this.service
      .unicidade(
        this.formModal.get('ramoSetorId')?.value,
        this.formModal.get('nmFornecedor')?.value,
        this.formModal.get('id')?.value
      )
      .toPromise();

    response == true ? (unico = true) : (unico = false);

    return unico;
  }

  onChangeTipo(e: any) {
    console.log(e.value);
    this.idRamo = e.value;
  }

  cancelando() {
    this.resultado = {
      record: this.fornecedor,
      tipoCrud: '',
      status: true,
    };
    this.activeModal.close();
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.fornecedor.inAtivo = this.formModal.get('inAtivo')?.value;
  }

  verificaCampo(campo: string) {
    return (
      this.formModal.get(campo)?.errors && this.formModal.get(campo)?.touched
    );
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

  aplicaCssErro(campo: string) {
    const classeCss = 'is-invalid';

    return { 'is-invalid': this.verificaCampo(campo) };
  }
}
