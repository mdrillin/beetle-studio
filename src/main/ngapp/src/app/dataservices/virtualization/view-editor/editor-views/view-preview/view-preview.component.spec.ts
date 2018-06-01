import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ViewPreviewComponent } from "./view-preview.component";
import { PatternFlyNgModule } from "patternfly-ng";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { LoggerService } from "@core/logger.service";

describe("ViewPreviewComponent", () => {
  let component: ViewPreviewComponent;
  let fixture: ComponentFixture<ViewPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule ],
      declarations: [ ViewPreviewComponent ],
      providers: [ LoggerService, ViewEditorService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
