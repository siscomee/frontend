import { TestBed } from '@angular/core/testing';

import { MensagemConfirmService } from './mensagem-confirm.service';

describe('MensagemConfirmService', () => {
  let service: MensagemConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensagemConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
