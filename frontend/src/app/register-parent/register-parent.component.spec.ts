import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterParentComponent } from './register-parent.component';

describe('RegisterParentComponent', () => {
  let component: RegisterParentComponent;
  let fixture: ComponentFixture<RegisterParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
