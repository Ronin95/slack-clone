import { Component, OnInit } from '@angular/core';
import { Workspace } from 'src/modules/workspaces.class';

@Component({
  selector: 'app-new-workspace-dialog',
  templateUrl: './new-workspace-dialog.component.html',
  styleUrls: ['./new-workspace-dialog.component.scss']
})
export class NewWorkspaceDialogComponent implements OnInit {
  workspace = new Workspace()
  workspaceName: string | undefined;

  constructor() { }

  ngOnInit() {
  }

  async createNewWorkspace() {
    if(!this.workspace.workspaceDescription) {this.workspace.workspaceDescription = '-'}
    this.workspace.created = new Date();
    // this.angularFirestore
    //   .collection('workspace')
    //   .add(this.workspace.toJSON());
  }

}
