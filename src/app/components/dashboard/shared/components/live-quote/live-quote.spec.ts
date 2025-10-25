import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveQuoteComponent } from './live-quote';

describe('LiveQuoteComponent', () => {
  let component: LiveQuoteComponent;
  let fixture: ComponentFixture<LiveQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
