import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FormValidator } from 'src/app/shared/form-validator';
import { first, map, tap } from 'rxjs/operators';
import { RamoSetorService } from 'src/app/shared/services/ramo-setor.service';
import { ResultadoRamoSetorForm } from 'src/app/shared/models/resultado-ramo-setor-form';
import { RamoSetor } from 'src/app/shared/models/ramo-setor';

@Component({
  selector: 'app-ramo-setor-modal',
  templateUrl: './ramo-setor-modal.component.html',
  styleUrls: ['./ramo-setor-modal.component.css'],
})
export class RamoSetorModalComponent implements OnInit {
  formModal!: FormGroup;

  @Input() title!: string;
  @Input() public ramoSetor!: RamoSetor;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public toastService: ToastService,
    private service: RamoSetorService
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      id: [],
      nmRamoSetor: [
        null,
        [Validators.required, Validators.maxLength(45)],
        [this.codigoExistente.bind(this)],
      ],
      inAtivo: ['1'],
      usuarioIdAtualiza: ['1'],
      dtUltAtualiza: [new Date().toISOString()],
    });
    if (this.ramoSetor != undefined) {
      this.formModal.patchValue({
        id: this.ramoSetor.id,
        nmRamoSetor: this.ramoSetor.nmRamoSetor,
        inAtivo: this.ramoSetor.inAtivo.toString(),
        usuarioIdAtualiza: this.ramoSetor.usuarioIdAtualiza,
        dtUltAtualiza: this.ramoSetor.dtUltAtualiza,
      });
    }
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
      this.service.save(this.formModal?.value).subscribe((res: RamoSetor) => {
        let resultado!: ResultadoRamoSetorForm;

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

  editarCadastroTela(res: ResultadoRamoSetorForm) {
    this.ramoSetor.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.ramoSetor.dtUltAtualiza = res.record.dtUltAtualiza;
    this.ramoSetor.nmRamoSetor = res.record.nmRamoSetor;
    this.ramoSetor.inAtivo = res.record.inAtivo;
  }

  onDeletar() {
    this.inativar();
    this.service.remove(this.formModal.value).subscribe((res: RamoSetor) => {
      let resultado: ResultadoRamoSetorForm;
      if (res) {
        resultado = { record: res, tipoCrud: 'd', status: true };
      } else {
        this.formModal.patchValue({ inAtivo: 1 });
        this.ramoSetor.inAtivo = this.formModal.get('inAtivo')?.value;
        resultado = { record: res, tipoCrud: '', status: true };
      }
      console.log(resultado);
      this.activeModal.close(resultado);
    });
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.ramoSetor.inAtivo = this.formModal.get('inAtivo')?.value;
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
}
