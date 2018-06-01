import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorViewsComponent } from './editor-views.component';
import { ViewPreviewComponent } from "@dataservices/virtualization/view-editor/editor-views/view-preview/view-preview.component";
import { TabDirective, TabsetComponent } from "ngx-bootstrap";
import { MessageLogComponent } from "@dataservices/virtualization/view-editor/editor-views/message-log/message-log.component";
import { PatternFlyNgModule } from "patternfly-ng";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {CodemirrorModule} from "ng2-codemirror";

describe('EditorViewsComponent', () => {
  let component: EditorViewsComponent;
  let fixture: ComponentFixture<EditorViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule  ],
      declarations: [ EditorViewsComponent, MessageLogComponent,
                      ViewPreviewComponent, TabDirective, TabsetComponent ]
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
