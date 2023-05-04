import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewWorkspaceComponent } from './create-new-workspace.component';

describe('CreateNewWorkspaceComponent', () => {
  let component: CreateNewWorkspaceComponent;
  let fixture: ComponentFixture<CreateNewWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
