import { TestBed, inject } from '@angular/core/testing';

import { ViewEditorService } from './view-editor.service';

describe('ViewEditorSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewEditorService]
    });
  });

  it('should be created', inject([ViewEditorService], ( service: ViewEditorService) => {
    expect(service).toBeTruthy();
  }));
});
