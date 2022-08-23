import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeProdutoModalComponent } from './tipo-de-produto-modal.component';

describe('TipoDeProdutoModalComponent', () => {
  let component: TipoDeProdutoModalComponent;
  let fixture: ComponentFixture<TipoDeProdutoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoDeProdutoModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeProdutoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
