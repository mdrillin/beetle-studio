import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCardComponent } from './view-card.component';
import { PatternFlyNgModule } from "patternfly-ng";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@core/logger.service";
import { View } from "@dataservices//shared/view.model";

describe('ViewCardComponent', () => {
  let component: ViewCardComponent;
  let fixture: ComponentFixture<ViewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCardComponent ],
      imports: [
        PatternFlyNgModule,
        RouterTestingModule
      ],
      providers: [
        LoggerService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCardComponent);
    component = fixture.componentInstance;

    component.view = new View();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
