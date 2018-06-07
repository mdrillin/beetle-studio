import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerService } from "@core/logger.service";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { ViewCanvasComponent } from '@dataservices/virtualization/view-editor/view-canvas/view-canvas.component';
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { PatternFlyNgModule } from "patternfly-ng";

describe('ViewCanvasComponent', () => {
  let component: ViewCanvasComponent;
  let fixture: ComponentFixture<ViewCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule ],
      declarations: [ ViewCanvasComponent, SelectedNodeComponent ],
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
