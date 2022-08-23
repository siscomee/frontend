import { FormDebugComponent } from './form-debug/form-debug.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensagemFormComponent } from './mensagem-form/mensagem-form.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { ToastComponent } from './toast/toast.component';


@NgModule({
  declarations: [
    MensagemFormComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    FormFieldComponent,
    ToastComponent
  ],
  imports: [CommonModule, NgbModule, FormsModule],
  exports: [
    MensagemFormComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    FormFieldComponent,
    ToastComponent
  ],
})
export class SharedModule {}
