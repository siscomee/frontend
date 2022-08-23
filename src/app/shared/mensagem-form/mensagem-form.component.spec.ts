import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemFormComponent } from './mensagem-form.component';

describe('MensagemFormComponent', () => {
  let component: MensagemFormComponent;
  let fixture: ComponentFixture<MensagemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensagemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensagemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
