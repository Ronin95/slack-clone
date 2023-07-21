import { Component, Input, OnInit } from '@angular/core';
import { setBlockType } from 'prosemirror-commands';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { Editor } from 'ngx-editor';
import { isNodeActive } from 'ngx-editor/helpers';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss'],
})
export class CustomMenuComponent implements OnInit {
  constructor(
    public channelService: ChannelService
  ) {}

  @Input() editor!: Editor;
  isActive = false;
  isDisabled = false;

  /**
   * The `onClick` method is a callback function that is triggered when the custom menu component is clicked. It takes a
   * `MouseEvent` object as a parameter.
   * 
   * @method
   * @name onClick
   * @kind method
   * @memberof CustomMenuComponent
   * @param {MouseEvent} e
   * @returns {void}
   */
  onClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.execute(state, dispatch);
  }

  /**
   * The `execute` method in the `CustomMenuComponent` class is responsible for executing a specific action based on the
   * current state of the editor.
   * 
   * @method
   * @name execute
   * @kind method
   * @memberof CustomMenuComponent
   * @param {EditorState} state
   * @param {((tr: Transaction) => void) | undefined} dispatch?
   * @returns {boolean}
   */
  execute(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const { schema } = state;

    if (this.isActive) {
      return setBlockType(schema.nodes['paragraph'])(state, dispatch);
    }

    return setBlockType(schema.nodes['code_mirror'])(state, dispatch);
  }

  update = (view: EditorView) => {
    const { state } = view;
    const { schema } = state;
    this.isActive = isNodeActive(state, schema.nodes['code_mirror']);
    this.isDisabled = !this.execute(state); // returns true if executable
  };

  /**
   * The `ngOnInit()` method is a lifecycle hook in Angular that is called after the component has been initialized. In this
   * specific code, the `ngOnInit()` method is used to initialize and configure a plugin for the editor.
   * 
   * @method
   * @name ngOnInit
   * @kind method
   * @memberof CustomMenuComponent
   * @returns {void}
   */
  ngOnInit(): void {
    const plugin = new Plugin({
      key: new PluginKey(`custom-menu-codemirror`),
      view: () => {
        return {
          update: this.update,
        };
      },
    });

    this.editor.registerPlugin(plugin);
  }
}