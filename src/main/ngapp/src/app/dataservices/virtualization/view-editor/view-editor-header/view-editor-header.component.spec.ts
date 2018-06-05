import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditorHeaderComponent } from './view-editor-header.component';
import { FormsModule } from "@angular/forms";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { LoggerService } from "@core/logger.service";

describe('ViewEditorHeaderComponent', () => {
  let component: ViewEditorHeaderComponent;
  let fixture: ComponentFixture<ViewEditorHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ ViewEditorHeaderComponent ],
      providers: [ LoggerService, ViewEditorService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
