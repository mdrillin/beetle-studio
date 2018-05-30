import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditorHeaderComponent } from './view-editor-header.component';

describe('ViewEditorHeaderComponent', () => {
  let component: ViewEditorHeaderComponent;
  let fixture: ComponentFixture<ViewEditorHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditorHeaderComponent ]
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
