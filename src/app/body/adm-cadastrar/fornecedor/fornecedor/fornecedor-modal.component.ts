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
import { empty, Observable } from 'rxjs';

@Component({
  selector: 'app-fornecedor-modal',
  templateUrl: './fornecedor-modal.component.html',
  styleUrls: ['./fornecedor-modal.component.css'],
})
export class FornecedorModalComponent implements OnInit {
  formModal!: FormGroup;
  fornecedores!: Observable<Fornecedor[]>;
  ramoSetores!: Observable<RamoSetor[]>;

  idRamoSetor: number = 0;

  @Input() title!: string;
  @Input() public fornecedor!: Fornecedor;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;
  error$: any;
  mensagemConfirmService: any;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public toastService: ToastService,
    private service: FornecedorService
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      usuarioIdAtualiza: ['1'],
      dtUltAtualiza: [new Date().toISOString()],
      id: [],
      nmFornecedor: [
        null,
        [Validators.required, Validators.maxLength(200)],
        [this.codigoExistente.bind(this)],
      ],
      nuCnpj: ['', [Validators.required]],
      nuTelefone: ['', [Validators.required]],
      ramoSetorId: [null, [Validators.required]],
      inAtivo: ['1'],
    });
    if (this.fornecedor != undefined) {
      this.formModal.patchValue({
        id: this.fornecedor.id,
        nmFornecedor: this.fornecedor.nmFornecedor,
        nuCnpj: this.fornecedor.nuCnpj,
        nuTelefone: this.fornecedor.nuTelefone,
        ramoSetorId: this.fornecedor.ramoSetorId.toString().indexOf,
        inAtivo: this.fornecedor.inAtivo.toString(),
        usuarioIdAtualiza: this.fornecedor.usuarioIdAtualiza,
        dtUltAtualiza: this.fornecedor.dtUltAtualiza,
      });
    }

    this.ramoSetores = this.service.listarRamoSetores().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
  }

  private handleError() {
    this.mensagemConfirmService.errorToaster('Carregando...');
  }

  verificaCampo(campo: string) {
    return (
      this.formModal.get(campo)?.errors && this.formModal.get(campo)?.touched
    );
  }
  aplicaCssErro(campo: string) {
    return { 'is-invalid': this.verificaCampo(campo) };
  }

  converterInAtivo() {
    this.formModal.patchValue({
      inAtivo: Number(this.formModal.get('inAtivo')?.value),
    });
  }

  onSalvar() {
    this.converterInAtivo();

    if (this.formModal.valid) {
      this.service.save(this.formModal.value).subscribe((res: Fornecedor) => {
        let resultado!: ResultadoFornecedorForm;
        console.log(resultado, 'resultado');

        if (res.id == this.formModal.get('id')?.value) {
          resultado = { record: res, tipoCrud: 'u', status: true };
          this.editarCadastroTela(resultado);
          console.log('atualizado');
        } else {
          resultado = { record: res, tipoCrud: 'c', status: true };
          console.log('criado');
        }
        console.log(res);
        this.activeModal.close(resultado);
      });
    } else {
      FormValidator.verificaValidacoesForm(this.formModal);
      this.formModal.get('inAtivo')?.value === 1
        ? this.formModal.get('inAtivo')?.setValue('1')
        : this.formModal.get('inAtivo')?.setValue('0');
      console.log('fomulário não está válido');
    }
  }

  editarCadastroTela(res: ResultadoFornecedorForm) {
    this.fornecedor.nmFornecedor = res.record.nmFornecedor;
    this.fornecedor.nuCnpj = res.record.nuCnpj;
    this.fornecedor.nuTelefone = res.record.nuTelefone;
    this.fornecedor.ramoSetorId = res.record.ramoSetorId;
    this.fornecedor.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.fornecedor.dtUltAtualiza = res.record.dtUltAtualiza;
    this.fornecedor.inAtivo = res.record.inAtivo;
  }

  onDeletar() {
    this.inativar();
    this.service.remove(this.formModal.value).subscribe((res: Fornecedor) => {
      let resultado: ResultadoFornecedorForm;

      if (res) {
        resultado = { record: res, tipoCrud: 'd', status: true };
      } else {
        this.formModal.patchValue({ inAtivo: 1 });
        this.fornecedor.inAtivo = this.formModal.get('inAtivo')?.value;
        resultado = { record: res, tipoCrud: '', status: true };
      }
      this.activeModal.close(resultado);
    });
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.fornecedor.inAtivo = this.formModal.get('inAtivo')?.value;
  }

  codigoExistente(control: FormControl) {
    return this.service
      .unicidade(control.value, this.formModal.get('id')?.value)
      .pipe(
        map((existe) => (existe ? { codigoExiste: true } : null)),
        tap(console.log),
        first()
      );
  }

  onChangeTipo(e: any) {
    console.log(e.value);
    this.idRamoSetor = e.value;
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
