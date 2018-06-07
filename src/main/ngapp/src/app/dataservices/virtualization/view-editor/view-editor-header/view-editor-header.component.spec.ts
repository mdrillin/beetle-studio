import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorHeaderComponent } from '@dataservices/virtualization/view-editor/view-editor-header/view-editor-header.component';

describe('ViewEditorHeaderComponent', () => {
  let component: ViewEditorHeaderComponent;
  let fixture: ComponentFixture<ViewEditorHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
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
