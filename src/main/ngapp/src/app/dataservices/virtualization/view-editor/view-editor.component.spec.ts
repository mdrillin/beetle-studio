import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditorComponent } from './view-editor.component';
import { CoreModule } from "@core/core.module";
import { ViewEditorHeaderComponent } from "@dataservices/virtualization/view-editor/view-editor-header/view-editor-header.component";
import { PatternFlyNgModule } from "patternfly-ng";
import { ViewCanvasComponent } from "@dataservices/virtualization/view-editor/view-canvas/view-canvas.component";
import { EditorViewsComponent } from "@dataservices/virtualization/view-editor/editor-views/editor-views.component";
import { ViewPreviewComponent } from "@dataservices/virtualization/view-editor/editor-views/view-preview/view-preview.component";
import { TabDirective, TabsetComponent } from "ngx-bootstrap";
import { MessageLogComponent } from "@dataservices/virtualization/view-editor/editor-views/message-log/message-log.component";
import { FormsModule } from "@angular/forms";

describe('ViewEditorComponent', () => {
  let component: ViewEditorComponent;
  let fixture: ComponentFixture<ViewEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule,  ],
      declarations: [ EditorViewsComponent, ViewEditorComponent, ViewEditorHeaderComponent,
                      ViewCanvasComponent, ViewPreviewComponent, TabDirective, TabsetComponent,
                      MessageLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
