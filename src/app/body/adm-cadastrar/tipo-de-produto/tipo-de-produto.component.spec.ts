import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeProdutoComponent } from './tipo-de-produto.component';

describe('TipoDeProdutoComponent', () => {
  let component: TipoDeProdutoComponent;
  let fixture: ComponentFixture<TipoDeProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoDeProdutoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
