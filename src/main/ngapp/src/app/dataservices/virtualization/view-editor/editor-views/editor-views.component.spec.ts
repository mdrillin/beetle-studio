import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { EditorViewsComponent } from '@dataservices/virtualization/view-editor/editor-views/editor-views.component';
import { MessageLogComponent } from "@dataservices/virtualization/view-editor/editor-views/message-log/message-log.component";
import { ViewPreviewComponent } from "@dataservices/virtualization/view-editor/editor-views/view-preview/view-preview.component";
import { TabsModule } from "ngx-bootstrap";
import { PatternFlyNgModule } from "patternfly-ng";

describe('EditorViewsComponent', () => {
  let component: EditorViewsComponent;
  let fixture: ComponentFixture<EditorViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PatternFlyNgModule,
        TabsModule.forRoot()
      ],
      declarations: [
        EditorViewsComponent,
        MessageLogComponent,
        ViewPreviewComponent
      ],
      providers: [
        LoggerService,
        ViewEditorService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
