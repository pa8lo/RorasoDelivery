import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGpsComponent } from './no-gps.component';

describe('NoGpsComponent', () => {
  let component: NoGpsComponent;
  let fixture: ComponentFixture<NoGpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoGpsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
