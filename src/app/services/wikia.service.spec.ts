import { TestBed } from '@angular/core/testing';

import { WikiaService } from './wikia.service';

describe('WikiaService', () => {
  let service: WikiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
