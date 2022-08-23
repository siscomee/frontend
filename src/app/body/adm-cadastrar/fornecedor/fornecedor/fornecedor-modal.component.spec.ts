import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorModalComponent } from './fornecedor-modal.component';

describe('DocumentoPorTipoModalComponent', () => {
  let component: FornecedorModalComponent;
  let fixture: ComponentFixture<FornecedorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FornecedorModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
