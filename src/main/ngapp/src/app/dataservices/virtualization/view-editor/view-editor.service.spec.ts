import { TestBed, inject } from '@angular/core/testing';

import { ViewEditorService } from './view-editor.service';
import { LoggerService } from "@core/logger.service";

describe('ViewEditorSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        ViewEditorService
      ]
    });
  });

  it('should be created', inject([ViewEditorService], ( service: ViewEditorService) => {
    expect(service).toBeTruthy();
  }));
});
