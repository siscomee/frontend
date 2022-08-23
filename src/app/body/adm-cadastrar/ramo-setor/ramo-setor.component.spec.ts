import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RamoSetorComponent } from './ramo-setor.component';

describe('RamoSetorComponent', () => {
  let component: RamoSetorComponent;
  let fixture: ComponentFixture<RamoSetorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RamoSetorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RamoSetorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
