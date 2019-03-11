import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySubjectsComponent } from './display-subjects.component';

describe('DisplaySubjectsComponent', () => {
  let component: DisplaySubjectsComponent;
  let fixture: ComponentFixture<DisplaySubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
