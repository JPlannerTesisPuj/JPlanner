import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayClassesComponent } from './display-classes.component';

describe('DisplayClassesComponent', () => {
  let component: DisplayClassesComponent;
  let fixture: ComponentFixture<DisplayClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
