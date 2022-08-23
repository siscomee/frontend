import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensagem-form',
  templateUrl: './mensagem-form.component.html',
  styleUrls: ['./mensagem-form.component.css'],
})
export class MensagemFormComponent {
  @Input() title!: string;
  @Input() mensagem!: string;
  @Input() btnOkText!: string;
  @Input() btnCancelText!: string;
  constructor(public activeModal: NgbActiveModal) {}


  public decline() {
    this.activeModal.close(false);
  }
  public accept() {
    this.activeModal.close(true);
  }
  public dismiss() {
    this.activeModal.dismiss();
  }
}
