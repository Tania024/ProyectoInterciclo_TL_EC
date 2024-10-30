import { TestBed } from '@angular/core/testing';

import { EspaciosParqueaderoService } from './espacios-parqueadero.service';

describe('EspaciosParqueaderoService', () => {
  let service: EspaciosParqueaderoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaciosParqueaderoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
