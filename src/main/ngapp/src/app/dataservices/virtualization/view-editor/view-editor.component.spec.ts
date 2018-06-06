import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { SelectionService } from "@core/selection.service";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { ViewEditorComponent } from '@dataservices/virtualization/view-editor/view-editor.component';
import { ViewCanvasComponent } from "@dataservices/virtualization/view-editor/view-canvas/view-canvas.component";
import { ConnectionTableDialogComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-table-dialog.component";
import { ConnectionTreeSelectorComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-tree-selector/connection-tree-selector.component";
import { EditorViewsComponent } from "@dataservices/virtualization/view-editor/editor-views/editor-views.component";
import { MessageLogComponent } from "@dataservices/virtualization/view-editor/editor-views/message-log/message-log.component";
import { ViewPreviewComponent } from "@dataservices/virtualization/view-editor/editor-views/view-preview/view-preview.component";
import { ViewEditorHeaderComponent } from "@dataservices/virtualization/view-editor/view-editor-header/view-editor-header.component";
import { TreeModule } from "angular-tree-component";
import { TabsModule } from "ngx-bootstrap";
import { PatternFlyNgModule } from "patternfly-ng";

describe('ViewEditorComponent', () => {
  let component: ViewEditorComponent;
  let fixture: ComponentFixture<ViewEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        FormsModule,
        PatternFlyNgModule,
        RouterTestingModule,
        TabsModule.forRoot(),
        TreeModule
      ],
      declarations: [
        ConnectionTableDialogComponent,
        ConnectionTreeSelectorComponent,
        EditorViewsComponent,
        MessageLogComponent,
        SelectedNodeComponent,
        ViewCanvasComponent,
        ViewEditorComponent,
        ViewEditorHeaderComponent,
        ViewPreviewComponent
      ],
      providers: [
        SelectionService
      ]
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
