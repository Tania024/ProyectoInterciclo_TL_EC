import { TestBed } from '@angular/core/testing';

import { PerfilsService } from './perfils.service';

describe('PerfilsService', () => {
  let service: PerfilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
