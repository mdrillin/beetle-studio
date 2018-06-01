import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VirtualizationComponent } from "./virtualization.component";
import { CoreModule } from "@core/core.module";
import {ControlContainer, FormControlDirective, FormsModule, NgControl} from "@angular/forms";
import { PatternFlyNgModule } from "patternfly-ng";
import { ViewCardsComponent } from "@dataservices/virtualization/view-cards/view-cards.component";

describe("VirtualizationComponent", () => {
  let component: VirtualizationComponent;
  let fixture: ComponentFixture<VirtualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule ],
      declarations: [ VirtualizationComponent, ViewCardsComponent ]
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
