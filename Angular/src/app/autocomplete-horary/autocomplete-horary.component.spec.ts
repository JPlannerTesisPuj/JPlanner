import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteHoraryComponent } from './autocomplete-horary.component';

describe('AutocompleteHoraryComponent', () => {
  let component: AutocompleteHoraryComponent;
  let fixture: ComponentFixture<AutocompleteHoraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteHoraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteHoraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
