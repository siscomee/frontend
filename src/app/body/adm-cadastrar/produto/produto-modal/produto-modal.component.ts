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

import { ResultadoProdutoForm } from '../../../../shared/models/resultado-produto-form';
import { ProdutoService } from '../../../../shared/services/produto.service';
import { Produto } from '../../../../shared/models/produto';
import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';

@Component({
  selector: 'app-produto-modal',
  templateUrl: './produto-modal.component.html',
  styleUrls: ['./produto-modal.component.css'],
})
export class ProdutoModalComponent implements OnInit {
  formModal!: FormGroup;
  produtos!: Observable<Produto[]>;
  tipoDeProdutos!: Observable<TipoDeProduto[]>;

  idTipoProduto: number = 0;

  @Input() title!: string;
  @Input() public produto!: Produto;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;
  error$: any;
  mensagemConfirmService: any;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public toastService: ToastService,
    private service: ProdutoService
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      usuarioIdAtualiza: [1],
      dtUltAtualiza: [new Date().toISOString()],
      id: [],
      nmProduto: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
        [this.codigoExistente.bind(this)],
      ],
      vlProduto: [null, [Validators.required]],
      tpMedida: [null, [Validators.required]],
      qtdProduto: [null, [Validators.required]],
      tipoProdutoId: [null, [Validators.required]],
      inAtivo: ['1'],
    });
    if (this.produto != undefined) {
      this.formModal.patchValue({
        id: this.produto.id,
        nmProduto: this.produto.nmProduto,
        vlProduto: this.produto.vlProduto,
        tpMedida: this.produto.tpMedida,
        qtdProduto: this.produto.qtdProduto,
        tipoProdutoId: this.produto.tipoProdutoId.toString().indexOf,
        inAtivo: this.produto.inAtivo.toString(),
        usuarioIdAtualiza: this.produto.usuarioIdAtualiza,
        dtUltAtualiza: this.produto.dtUltAtualiza,
      });
    }

    this.tipoDeProdutos = this.service.listarTipoDeProdutos().pipe(
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
      this.service.save(this.formModal?.value).subscribe((res: Produto) => {
        let resultado!: ResultadoProdutoForm;

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

  editarCadastroTela(res: ResultadoProdutoForm) {
    this.produto.nmProduto = res.record.nmProduto;
    this.produto.vlProduto = res.record.vlProduto;
    this.produto.tpMedida = res.record.tpMedida;
    this.produto.qtdProduto = res.record.qtdProduto;
    this.produto.tipoProdutoId = res.record.tipoProdutoId;
    this.produto.inAtivo = res.record.inAtivo;
    this.produto.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.produto.dtUltAtualiza = res.record.dtUltAtualiza;
  }

  onDeletar() {
    this.inativar();
    this.service.remove(this.formModal.value).subscribe((res: Produto) => {
      let resultado: ResultadoProdutoForm;
      if (res) {
        resultado = { record: res, tipoCrud: 'd', status: true };
      } else {
        this.formModal.patchValue({ inAtivo: 1 });
        this.produto.inAtivo = this.formModal.get('inAtivo')?.value;
        resultado = { record: res, tipoCrud: '', status: true };
      }
      console.log(resultado);
      this.activeModal.close(resultado);
    });
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.produto.inAtivo = this.formModal.get('inAtivo')?.value;
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
    this.idTipoProduto = e.value;
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
