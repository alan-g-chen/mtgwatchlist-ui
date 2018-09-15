import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtgWatchlistComponent } from './mtg-watchlist.component';

describe('MtgWatchlistComponent', () => {
  let component: MtgWatchlistComponent;
  let fixture: ComponentFixture<MtgWatchlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtgWatchlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtgWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
