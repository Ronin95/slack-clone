import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelOnDisplayComponent } from './channel-on-display.component';

describe('ChannelOnDisplayComponent', () => {
  let component: ChannelOnDisplayComponent;
  let fixture: ComponentFixture<ChannelOnDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelOnDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelOnDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
