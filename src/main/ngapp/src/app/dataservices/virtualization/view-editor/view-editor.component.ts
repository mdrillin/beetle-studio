/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, TemplateRef, ViewEncapsulation } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { Action, ActionConfig, ToolbarConfig, ToolbarView } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-editor",
  templateUrl: "./view-editor.component.html",
  styleUrls: ["./view-editor.component.css"],
  providers: [ ViewEditorService ]
})
export class ViewEditorComponent implements OnInit {

  public cssEditorType: string;
  public showDescription = false;
  public toolbarConfig: ToolbarConfig;

  private logger: LoggerService;

  //
  // Editor CSS types.
  //
  private readonly canvasOnlyCssType = "view-editor-canvas-only";
  private readonly fullEditorCssType = "view-editor-full";
  private readonly resultsOnlyCssType = "view-editor-results-only";

  //
  // Toolbar action IDs
  //
  private readonly addCompositionActionId = "addCompositionActionId";
  private readonly addSourceActionId = "addSourceActionId";
  private readonly deleteActionId = "deleteActionId";
  private readonly errorsActionId = "errorsActionId";
  private readonly infosActionId = "infosActionId";
  private readonly redoActionId = "redoActionId";
  private readonly saveActionId = "saveActionId";
  private readonly undoActionId = "undoActionId";
  private readonly warningsActionId = "warningsActionId";

  constructor( logger: LoggerService ) {
    this.logger = logger;
  }

  /**
   * Callback for when a view icon is clicked on the toolbar.
   *
   * @param {ToolbarView} toolbarView the toolbar view representing the editor configuration to display
   */
  public editorConfigChange( toolbarView: ToolbarView ): void {
    if ( toolbarView.id !== this.cssEditorType ) {
      this.cssEditorType = toolbarView.id;
    }
  }

  /**
   * @returns {string} the current CSS type of the editor
   */
  public get editorCssType(): string {
    return this.cssEditorType;
  }

  /**
   * Callback for when the toolbar is configured.
   *
   * @param {TemplateRef<any>} addSourceTemplate the template for the add source toolbar button
   * @param {TemplateRef<any>} addCompositionTemplate the template for the add composition toolbar button
   * @param {TemplateRef<any>} undoTemplate the template for the undo toolbar button
   * @param {TemplateRef<any>} redoTemplate the template for the redo toolbar button
   * @param {TemplateRef<any>} saveTemplate the template for the save toolbar button
   * @param {TemplateRef<any>} deleteTemplate the template for the delete toolbar button
   * @param {TemplateRef<any>} errorsTemplate the template for the show errors toolbar button
   * @param {TemplateRef<any>} warningsTemplate the template for the show warnings toolbar button
   * @param {TemplateRef<any>} infosTemplate the template for the show infos toolbar button
   * @returns {ActionConfig}
   */
  public getActionConfig( addSourceTemplate: TemplateRef< any >,
                          addCompositionTemplate: TemplateRef< any >,
                          undoTemplate: TemplateRef< any >,
                          redoTemplate: TemplateRef< any >,
                          saveTemplate: TemplateRef< any >,
                          deleteTemplate: TemplateRef< any >,
                          errorsTemplate: TemplateRef< any >,
                          warningsTemplate: TemplateRef< any >,
                          infosTemplate: TemplateRef< any > ): ActionConfig {
    return {
      primaryActions: [
        {
          disabled: !this.canAddSource(),
          id: this.addSourceActionId,
          template: addSourceTemplate,
          title: "Add Source",
          tooltip: "Add Source"
        },
        {
          disabled: !this.canAddComposition(),
          id: this.addCompositionActionId,
          template: addCompositionTemplate,
          title: "Add Composition",
          tooltip: "Add Composition"
        },
        {
          disabled: !this.canUndo(),
          id: this.undoActionId,
          template: undoTemplate,
          title: "Undo",
          tooltip: "Undo"
        },
        {
          disabled: !this.canRedo(),
          id: this.redoActionId,
          template: redoTemplate,
          title: "Redo",
          tooltip: "Redo"
        },
        {
          disabled: !this.canSave(),
          id: this.saveActionId,
          template: saveTemplate,
          title: "Save",
          tooltip: "Save"
        },
        {
          disabled: !this.canDelete(),
          id: this.deleteActionId,
          template: deleteTemplate,
          title: "Delete",
          tooltip: "Delete the selection"
        },
        {
          disabled: !this.hasErrors(),
          id: this.errorsActionId,
          template: errorsTemplate,
          title: "Errors",
          tooltip: "Error messages"
        },
        {
          disabled: !this.hasWarnings(),
          id: this.warningsActionId,
          template: warningsTemplate,
          title: "Warnings",
          tooltip: "Warning messages"
        },
        {
          disabled: !this.hasInfos(),
          id: this.infosActionId,
          template: infosTemplate,
          title: "Infos",
          tooltip: "Info messages"
        }
      ],
      moreActions: [
      ],
    } as ActionConfig;
  }

  /**
   * Callback for when a toolbar button is clicked.
   *
   * @param {Action} action the toolbar action that was clicked
   */
  public handleAction( action: Action ): void {
    switch ( action.id ) {
      case this.addCompositionActionId:
        this.doAddComposition();
        break;
      case this.addSourceActionId:
        this.doAddSource();
        break;
      case this.deleteActionId:
        this.doDelete();
        break;
      case this.errorsActionId:
        this.doDisplayLogMessages( this.errorsActionId );
        break;
      case this.infosActionId:
        this.doDisplayLogMessages( this.infosActionId );
        break;
      case this.redoActionId:
        this.doRedo();
        break;
      case this.saveActionId:
        this.doSave();
        break;
      case this.undoActionId:
        this.doUndo();
        break;
      case this.warningsActionId:
        this.doDisplayLogMessages( this.warningsActionId );
        break;
      default:
        this.logger.error( `Unhandled action '${action.id}'` );
    }
  }

  /**
   * Indicates if the canvas and properties areas should be shown.
   *
   * @returns {boolean} `true` if areas should be shown
   */
  public get isShowingCanvas(): boolean {
    return this.cssEditorType === this.canvasOnlyCssType || this.cssEditorType === this.fullEditorCssType;
  }

  /**
   * Indicates if the results area should be shown.
   *
   * @returns {boolean} `true` if area should be shown
   */
  public get isShowingResults(): boolean {
    return this.cssEditorType === this.resultsOnlyCssType || this.cssEditorType === this.fullEditorCssType;
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.cssEditorType = this.fullEditorCssType;

    this.toolbarConfig = {
      views: [
        {
          id: this.fullEditorCssType,
          iconStyleClass: "fa fa-file-text-o",
          tooltip: "Show editor and results"
        },
        {
          id: this.canvasOnlyCssType,
          iconStyleClass: "fa fa-file-image-o",
          tooltip: "Show editor only"
        },
        {
          id: this.resultsOnlyCssType,
          iconStyleClass: "fa fa-table",
          tooltip: "Show results only"
        }
      ]
    } as ToolbarConfig;
  }

  private canDelete(): boolean {
    // TODO implement canDelete
    return false;
  }

  private canRedo(): boolean {
    // TODO implement canRedo
    return false;
  }

  private canSave(): boolean {
    // TODO implement canSave
    return false;
  }

  private canUndo(): boolean {
    // TODO implement canUndo
    return false;
  }

  private hasErrors(): boolean {
    // TODO implement hasErrors
    return false;
  }

  private hasInfos(): boolean {
    // TODO implement hasInfos
    return false;
  }

  private hasWarnings(): boolean {
    // TODO implement hasWarnings
    return false;
  }

  private canAddComposition(): boolean {
    // TODO implement canAddComposition
    return true;
  }

  private canAddSource(): boolean {
    // TODO implement canAddSource
    return true;
  }

  private doAddComposition(): void {
    // TODO implement doAddComposition
  }

  private doAddSource(): void {
    // TODO implement doAddSource
  }

  private doDelete(): void {
    // TODO implement doDelete
  }

  private doDisplayLogMessages( actionId: string ): void {
    // TODO implement doDisplayLogMessages
    switch ( actionId ) {
      case this.errorsActionId:
        break;
      case this.infosActionId:
        break;
      case this.warningsActionId:
        break;
      default:
        break;
    }
  }

  private doRedo(): void {
    // TODO implement doRedo
  }

  private doSave(): void {
    // TODO implement doSave
  }

  private doUndo(): void {
    // TODO implement doUndo
  }

}
