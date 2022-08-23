import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamoSetorModalComponent } from './ramo-setor-modal.component';

describe('RamoSetorModalComponent', () => {
  let component: RamoSetorModalComponent;
  let fixture: ComponentFixture<RamoSetorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RamoSetorModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RamoSetorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
