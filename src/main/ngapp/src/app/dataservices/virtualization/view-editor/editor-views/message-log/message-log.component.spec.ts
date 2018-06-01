import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLogComponent } from './message-log.component';
import { PatternFlyNgModule } from "patternfly-ng";
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";

describe('MessageLogComponent', () => {
  let component: MessageLogComponent;
  let fixture: ComponentFixture<MessageLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule ],
      declarations: [ MessageLogComponent ],
      providers: [ LoggerService, ViewEditorService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
