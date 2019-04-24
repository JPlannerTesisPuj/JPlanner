import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseGuideComponent } from './use-guide.component';

describe('UseGuideComponent', () => {
  let component: UseGuideComponent;
  let fixture: ComponentFixture<UseGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
