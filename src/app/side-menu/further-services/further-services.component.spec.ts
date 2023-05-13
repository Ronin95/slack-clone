import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurtherServicesComponent } from './further-services.component';

describe('FurtherServicesComponent', () => {
  let component: FurtherServicesComponent;
  let fixture: ComponentFixture<FurtherServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FurtherServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FurtherServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
