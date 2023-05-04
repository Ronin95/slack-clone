import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewWorkspaceDialogComponent } from './new-workspace-dialog/new-workspace-dialog.component';


@Component({
  selector: 'app-workspace-column',
  templateUrl: './workspace-column.component.html',
  styleUrls: ['./workspace-column.component.scss']
})
export class WorkspaceColumnComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  ngOnInit() {}

  openNewWorkspaceDialog(): void {
    this.dialog.open(NewWorkspaceDialogComponent, {
      width: '400px',
    });
  }


}



