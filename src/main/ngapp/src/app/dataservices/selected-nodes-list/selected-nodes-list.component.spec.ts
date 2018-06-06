import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { SelectedNodesListComponent } from "@dataservices/selected-nodes-list/selected-nodes-list.component";
import { PatternFlyNgModule } from "patternfly-ng";

describe("SelectedNodesListComponent", () => {
  let component: SelectedNodesListComponent;
  let fixture: ComponentFixture<SelectedNodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule, RouterTestingModule ],
      declarations: [ SelectedNodesListComponent, SelectedNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedNodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
