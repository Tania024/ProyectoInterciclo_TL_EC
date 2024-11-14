import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionClientesComponent } from './administracion-clientes.component';

describe('AdministracionClientesComponent', () => {
  let component: AdministracionClientesComponent;
  let fixture: ComponentFixture<AdministracionClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
