import { TestBed, inject } from '@angular/core/testing';

import { RamoSetorService } from './ramo-setor.service';

describe('RamoSetorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RamoSetorService],
    });
  });

  it('should...', inject([RamoSetorService], (service: RamoSetorService) => {
    expect(service).toBeTruthy();
  }));
});
