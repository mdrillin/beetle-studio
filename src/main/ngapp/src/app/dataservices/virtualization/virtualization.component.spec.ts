import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VirtualizationComponent } from "./virtualization.component";

describe("VirtualizationComponent", () => {
  let component: VirtualizationComponent;
  let fixture: ComponentFixture<VirtualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
