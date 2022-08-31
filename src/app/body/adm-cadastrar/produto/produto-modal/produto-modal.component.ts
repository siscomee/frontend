import { ProdutoService } from '../../../../shared/services/produto.service';
import { Produto } from '../../../../shared/models/produto';
import { ResultadoProdutoForm } from '../../../../shared/models/resultado-produto-form';
import { TipoDeProduto } from 'src/app/shared/models/tipo-de-produto';

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
  selector: 'app-produto-modal',
  templateUrl: './produto-modal.component.html',
  styleUrls: ['./produto-modal.component.css'],
})
export class ProdutoModalComponent implements OnInit {
  formModal!: FormGroup;
  resultado!: ResultadoProdutoForm;
  tiposDeProdutos!: Observable<TipoDeProduto[]>;
  produtosUnicidade!: Observable<Produto[]>;

  idTipoDeProduto: number = 0;
  nmProduto: String = '';
  situacao: String = '-1';

  error$ = new Subject<boolean>();

  @Input() title!: string;
  @Input() public produto!: Produto;
  @Input() public novoCadastro!: boolean;
  @Input() public tipoForm!: string;
  @Input() public editavel!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private service: ProdutoService,
    private mensagemConfirmService: MensagemConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formModal = this.formBuilder.group({
      id: [null],
      usuarioIdAtualiza: [1],
      dtUltAtualiza: [new Date().toISOString()],
      tipoProdutoId: [null, [Validators.required]],
      nmProduto: [null, [Validators.required, Validators.maxLength(100)]],
      vlProduto: [null, [Validators.required]],
      tpMedida: [null, [Validators.required]],
      qtdProduto: [null, [Validators.required]],
      inAtivo: ['1'],
    });
    if (this.produto != undefined) {
      this.formModal.patchValue({
        id: this.produto.id.toString(),
        tipoProdutoId: this.produto.tipoProdutoId.toString(),
        nmProduto: this.produto.nmProduto,
        vlProduto: this.produto.vlProduto,
        tpMedida: this.produto.tpMedida,
        qtdProduto: this.produto.qtdProduto,
        inAtivo: this.produto.inAtivo.toString(),
        usuarioIdAtualiza: this.produto.usuarioIdAtualiza,
        dtUltAtualiza: this.produto.dtUltAtualiza,
      });
    }

    this.tiposDeProdutos = this.service.listarTipos().pipe(
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
      tipoProdutoId: Number(this.formModal.get('tipoProdutoId')?.value),
    });
  }

  async onSalvar() {
    this.converterInAtivo();

    if (this.formModal.valid) {
      if ((await this.validarUnicidade()) == false) {
        this.mensagemConfirmService.infoToaster('Informação já cadastrada.');
        return;
      }

      this.service.save(this.formModal.value).subscribe((res: Produto) => {
        let resultado: ResultadoProdutoForm = {
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
      'Erro ao carregar cadastros de produtos. Tente novamente mais tarde...'
    );
  }

  cadastrar(produto: any) {
    produto.date = new Date();
    this.resultado = {
      record: this.produto,
      tipoCrud: 'c',
      status: true,
    };

    const crudResult = this.service.save(this.formModal.value);

    console.log(this.resultado);

    this.activeModal.close(this.resultado);
  }

  editarCadastroTela(res: ResultadoProdutoForm) {
    this.produto.usuarioIdAtualiza = res.record.usuarioIdAtualiza;
    this.produto.dtUltAtualiza = res.record.dtUltAtualiza;
    this.produto.nmProduto = res.record.nmProduto;
    this.produto.vlProduto = res.record.vlProduto;
    this.produto.tpMedida = res.record.tpMedida;
    this.produto.qtdProduto = res.record.qtdProduto;
    this.produto.tipoProdutoId = res.record.tipoProdutoId;
    this.produto.inAtivo = res.record.inAtivo;
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

  async validarUnicidade() {
    let unico = false;

    const response = await this.service
      .unicidade(
        this.formModal.get('tipoProdutoId')?.value,
        this.formModal.get('nmProduto')?.value,
        this.formModal.get('id')?.value
      )
      .toPromise();

    response == true ? (unico = true) : (unico = false);

    return unico;
  }

  onChangeTipo(e: any) {
    console.log(e.value);
    this.idTipoDeProduto = e.value;
  }

  cancelando() {
    this.resultado = {
      record: this.produto,
      tipoCrud: '',
      status: true,
    };
    this.activeModal.close();
  }

  inativar() {
    this.formModal.patchValue({ inAtivo: 0 });
    this.produto.inAtivo = this.formModal.get('inAtivo')?.value;
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
