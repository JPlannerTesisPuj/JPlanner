import { TestBed } from '@angular/core/testing';

import { ReadJsonFileService } from './read-json-file.service';

describe('ReadJsonFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadJsonFileService = TestBed.get(ReadJsonFileService);
    expect(service).toBeTruthy();
  });
});
