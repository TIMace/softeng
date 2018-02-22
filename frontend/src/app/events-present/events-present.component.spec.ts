import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsPresentComponent } from './events-present.component';

describe('EventsPresentComponent', () => {
  let component: EventsPresentComponent;
  let fixture: ComponentFixture<EventsPresentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsPresentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPresentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
