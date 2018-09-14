import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkeroptionsModalComponent } from './markeroptions-modal.component';

describe('MarkeroptionsModalComponent', () => {
  let component: MarkeroptionsModalComponent;
  let fixture: ComponentFixture<MarkeroptionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkeroptionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkeroptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
