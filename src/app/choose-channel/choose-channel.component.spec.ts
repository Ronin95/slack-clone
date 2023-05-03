import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseChannelComponent } from './choose-channel.component';

describe('ChooseChannelComponent', () => {
  let component: ChooseChannelComponent;
  let fixture: ComponentFixture<ChooseChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
