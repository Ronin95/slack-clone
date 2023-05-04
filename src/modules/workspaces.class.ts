export class Workspace {
  public workspaceName: string | any;
  public workspaceDescription: string | any;
  public created: Date | any;


  public toJSON() {
      return {
          workspaceName: this.workspaceName,
          workspaceDescription: this.workspaceDescription,
          created: this.created

      }
  }
}
