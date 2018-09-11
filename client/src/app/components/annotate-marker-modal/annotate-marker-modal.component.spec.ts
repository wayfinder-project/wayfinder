import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotateMarkerModalComponent } from './annotate-marker-modal.component';

describe('AnnotateMarkerModalComponent', () => {
  let component: AnnotateMarkerModalComponent;
  let fixture: ComponentFixture<AnnotateMarkerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotateMarkerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotateMarkerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
