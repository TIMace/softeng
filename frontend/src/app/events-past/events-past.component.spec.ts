import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsPastComponent } from './events-past.component';

describe('EventsPastComponent', () => {
  let component: EventsPastComponent;
  let fixture: ComponentFixture<EventsPastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsPastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
