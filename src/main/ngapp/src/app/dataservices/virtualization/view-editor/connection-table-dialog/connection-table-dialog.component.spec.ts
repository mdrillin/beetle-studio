import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConnectionTableDialogComponent } from "./connection-table-dialog.component";

describe("ConnectionTableDialogComponent", () => {
  let component: ConnectionTableDialogComponent;
  let fixture: ComponentFixture<ConnectionTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
