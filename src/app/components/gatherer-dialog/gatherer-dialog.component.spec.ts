import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GathererDialogComponent } from './gatherer-dialog.component';

describe('GathererDialogComponent', () => {
  let component: GathererDialogComponent;
  let fixture: ComponentFixture<GathererDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GathererDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GathererDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
