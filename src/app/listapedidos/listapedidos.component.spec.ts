import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListapedidosComponent } from './listapedidos.component';

describe('ListapedidosComponent', () => {
  let component: ListapedidosComponent;
  let fixture: ComponentFixture<ListapedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListapedidosComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListapedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
