import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConnectionTreeSelectorComponent } from "./connection-tree-selector.component";

describe("ConnectionTreeSelectorComponent", () => {
  let component: ConnectionTreeSelectorComponent;
  let fixture: ComponentFixture<ConnectionTreeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionTreeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTreeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
