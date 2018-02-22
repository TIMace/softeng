import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelParentComponent } from './panel-parent.component';

describe('PanelParentComponent', () => {
  let component: PanelParentComponent;
  let fixture: ComponentFixture<PanelParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
