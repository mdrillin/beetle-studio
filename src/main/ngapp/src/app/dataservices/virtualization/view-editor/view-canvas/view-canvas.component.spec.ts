import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCanvasComponent } from './view-canvas.component';
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { LoggerService } from "@core/logger.service";

describe('ViewCanvasComponent', () => {
  let component: ViewCanvasComponent;
  let fixture: ComponentFixture<ViewCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCanvasComponent ],
      providers: [
        LoggerService,
        ViewEditorService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
