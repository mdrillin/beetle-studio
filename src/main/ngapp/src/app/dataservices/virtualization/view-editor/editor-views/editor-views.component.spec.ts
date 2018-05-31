import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorViewsComponent } from './editor-views.component';

describe('EditorViewsComponent', () => {
  let component: EditorViewsComponent;
  let fixture: ComponentFixture<EditorViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
