import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceColumnComponent } from './workspace-column.component';

describe('WorkspaceColumnComponent', () => {
  let component: WorkspaceColumnComponent;
  let fixture: ComponentFixture<WorkspaceColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
