/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TipoDeProdutoService } from './tipo-de-produto.service';

describe('Service: TipoDeProduto', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoDeProdutoService],
    });
  });

  it('should ...', inject(
    [TipoDeProdutoService],
    (service: TipoDeProdutoService) => {
      expect(service).toBeTruthy();
    }
  ));
});
