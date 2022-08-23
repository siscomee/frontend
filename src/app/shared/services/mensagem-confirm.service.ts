import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensagemConfirmService {

  constructor(private toastService: ToastService) {}

  abrirToast(
    resultadoForm: Promise<any>
  ): void {
    resultadoForm.then((resultado: any) => {
        if (resultado) {
          if (resultado.tipoCrud == 'u') {
            if (resultado.status) {
              console.log('Dado editado');
              // toaster for CRUD\Update
              this.successToaster('Operação realizada com sucesso!');
            }
          }
          if (resultado.tipoCrud == 'd') {
            if (resultado.status) {
              console.log('Dado deletado');
              // toaster for CRUD\Delete
              this.successToaster('Exclusão efetuada com sucesso.');


            }
          }
          if (resultado.tipoCrud == 'c') {
            if (resultado.status) {
              console.log('Dado criado');
              // toaster for CRUD\Create
              this.successToaster('Operação realizada com sucesso!');

            }
          }
          if (resultado.tipoCrud == '') {
            console.log('Form cancelado');
            this.errorToaster('Houve um erro, tente novamente');
          }
        }
      })
      .catch(() => {
        console.log('Form cancelado');
      });
  }

  successToaster(bodyText: string) {
    this.toastService.show(bodyText, {
      classname: 'bg-success text-light',
      autohide: true,
    });
  }

  errorToaster(bodyText: string) {
    this.toastService.show(bodyText, {
      classname: 'bg-danger  text-light',
      delay: 10000,
      autohide: true,
    });
  }

  infoToaster(bodyText: string) {
    this.toastService.show(bodyText, {
      classname: 'bg-info  text-light',
      delay: 10000,
      autohide: true,
    });
  }


}
