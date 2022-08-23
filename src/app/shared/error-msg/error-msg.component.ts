import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css'],
})
export class ErrorMsgComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() label!: string;

  constructor() {}

  ngOnInit(): void {}

  static getErrorMsg(
    fieldName: string,
    validatorName: string,
    validatorValue?: any
  ) {
    const config: any = {
      'required': `${fieldName} não preenchido.`,
      'minlength': `Informe pelo menos  ${validatorValue.requiredLength} caracteres para  ${fieldName}.`,
      'maxlength': `${fieldName} pode ter no máximo ${validatorValue.requiredLength} caracteres.`,
      'pattern': `Campo inválido`,
      'codigoExiste': `Informação já cadastrada.`,
    };

    console.log(validatorName);

    return config[validatorName];
  }

  get errorMessage() {
    for (const propertyName in this.control?.errors) {
      if (
        this.control?.errors?.hasOwnProperty(propertyName) &&
        this.control?.touched
      ) {
        return ErrorMsgComponent.getErrorMsg(
            this.label,
            propertyName,
            this.control?.errors[propertyName]);
      }
    }

    return null;
  }
}
