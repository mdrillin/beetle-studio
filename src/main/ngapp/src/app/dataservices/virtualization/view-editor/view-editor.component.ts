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

import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { Action, ActionConfig, ToolbarConfig, ToolbarView } from "patternfly-ng";
import { SelectionService } from "@core/selection.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { Problem } from "@dataservices/virtualization/view-editor/editor-views/message-log/problem";
import { Subscription } from "rxjs/Subscription";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { BsModalService } from "ngx-bootstrap";
import { ConfirmDialogComponent } from "@shared/confirm-dialog/confirm-dialog.component";
import { ConnectionTableDialogComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-table-dialog.component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-editor",
  templateUrl: "./view-editor.component.html",
  styleUrls: ["./view-editor.component.css"],
  providers: [ ViewEditorService ]
})
export class ViewEditorComponent implements OnInit, OnDestroy {

  public readonly virtualizationsLink = DataservicesConstants.dataservicesRootPath;
  public readonly virtualizationLink = DataservicesConstants.virtualizationPath;

  public showDescription = false;
  public toolbarConfig: ToolbarConfig;

  private actionConfig: ActionConfig;
  private readonly editorService: ViewEditorService;
  private isNewView = false;
  private readonly logger: LoggerService;
  private readonly selectionService: SelectionService;
  private modalService: BsModalService;
  private subscription: Subscription;

  //
  // Editor CSS types.
  //
  private readonly canvasOnlyCssType = "view-editor-canvas-only";
  private readonly fullEditorCssType = "view-editor-full";
  private readonly resultsOnlyCssType = "view-editor-views-only";

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

  constructor( selectionService: SelectionService,
               logger: LoggerService,
               editorService: ViewEditorService,
               modalService: BsModalService ) {
    this.selectionService = selectionService;
    this.logger = logger;
    this.modalService = modalService;

    // this is the service that is injected into all the editor parts
    this.editorService = editorService;
  }

  private canAddComposition(): boolean {
    // TODO implement canAddComposition
    return this.isShowingCanvas;
  }

  private canAddSource(): boolean {
    // TODO implement canAddSource
    return this.isShowingCanvas;
  }

  private canDelete(): boolean {
    // TODO implement canDelete
    return this.isShowingCanvas;
  }

  private canRedo(): boolean {
    // TODO implement canRedo
    return this.isShowingCanvas;
  }

  private canSave(): boolean {
    return this.isShowingCanvas && this.editorService.hasChanges();
  }

  private canUndo(): boolean {
    // TODO implement canUndo
    return this.isShowingCanvas;
  }

  private doAddComposition(): void {
    // TODO implement doAddComposition
    alert( "Display add composition dialog" );
  }

  private doAddSource(): void {
    // Open Source selection dialog
    const initialState = {
      title: "Select View Source",
      cancelButtonText: "Cancel",
      okButtonText: "OK"
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(ConnectionTableDialogComponent, {initialState});
    modalRef.content.okAction.take(1).subscribe((selectedNodes) => {
      this.editorService.setViewSources( selectedNodes, ViewEditorPart.EDITOR );
    });
  }

  private doDelete(): void {
    // Dialog Content
    const message = "Do you really want to delete View '" + this.editorService.getViewName() + "'?";
    const initialState = {
      title: "Confirm Delete",
      bodyContent: message,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete"
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    modalRef.content.confirmAction.take(1).subscribe((value) => {
      this.deleteView();
    });
  }

  private deleteView( ): void {
    alert("Delete the view!");
  }

  private doDisplayLogMessages( actionId: string ): void {
    this.editorService.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                                     ViewEditorEventType.SHOW_EDITOR_PART,
                                                     [ ViewEditorPart.MESSAGE_LOG ] ) );
  }

  private doRedo(): void {
    // TODO implement doRedo
    this.logger.debug( "doRedo() here" );
  }

  private doSave(): void {
    // TODO implement doSave
    this.logger.debug( "doSave() here" );
  }

  private doUndo(): void {
    // TODO implement doUndo
    this.logger.debug( "doUndo() here" );
  }

  /**
   * Callback for when a view icon is clicked on the toolbar.
   *
   * @param {ToolbarView} toolbarView the toolbar view representing the editor configuration to display
   */
  public editorConfigChange( toolbarView: ToolbarView ): void {
    if ( toolbarView.id !== this.editorService.getEditorConfig() ) {
      this.editorService.setEditorConfig( toolbarView.id );
    }
  }

  /**
   * @returns {string} the current CSS type of the editor
   */
  public get editorCssType(): string {
    return this.editorService.getEditorConfig();
  }

  /**
   * @returns {number} the number of error messages
   */
  public get errorMsgCount(): number {
    return this.editorService.getErrorMessageCount();
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
    if ( !this.actionConfig ) {
      this.actionConfig = {
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
        moreActions: [],
      } as ActionConfig;
    }

    return this.actionConfig;
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
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ViewEditorComponent received event: " + event.toString() );

    if ( event.typeIsShowEditorPart() ) {
      if ( event.args.length !== 0 ) {
        // make sure the bottom area is showing if part is an additional editor view
        if ( ( event.args[ 0 ] === ViewEditorPart.PREVIEW || event.args[ 0 ] === ViewEditorPart.MESSAGE_LOG )
           && !this.isShowingAdditionalViews ) {
          this.editorService.setEditorConfig( this.fullEditorCssType );
        }
      }
    }
  }

  private hasErrors(): boolean {
    return true; // TODO this.errorMsgCount !== 0; (not working)
  }

  private hasInfos(): boolean {
    return true; // TODO this.infoMsgCount !== 0; (not working)
  }

  private hasWarnings(): boolean {
    return true; // TODO this.warningMsgCount !== 0; (not working)
  }

  /**
   * @returns {number} the number of informational messages
   */
  public get infoMsgCount(): number {
    return this.editorService.getInfoMessageCount();
  }

  /**
   * Indicates if the results area should be shown.
   *
   * @returns {boolean} `true` if area should be shown
   */
  public get isShowingAdditionalViews(): boolean {
    return this.editorCssType === this.resultsOnlyCssType || this.editorCssType === this.fullEditorCssType;
  }

  /**
   * Indicates if the canvas and properties areas should be shown.
   *
   * @returns {boolean} `true` if areas should be shown
   */
  public get isShowingCanvas(): boolean {
    return this.editorCssType === this.canvasOnlyCssType || this.editorCssType === this.fullEditorCssType;
  }

  /**
   * Cleanup code when destroying the editor.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.editorService.setEditorConfig( this.fullEditorCssType ); // this could be set via preference or last used config
    this.subscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );

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

    // TODO remove this when preview results are being set programmatically
    const employeeJson = {
      "columns": [
        {
          "name": "ssn",
          "label": "ssn",
          "type": "string"
        },
        {
          "name": "firstname",
          "label": "firstname",
          "type": "string"
        },
        {
          "name": "lastname",
          "label": "lastname",
          "type": "string"
        },
        {
          "name": "st_address",
          "label": "st_address",
          "type": "string"
        },
        {
          "name": "apt_number",
          "label": "apt_number",
          "type": "string"
        },
        {
          "name": "city",
          "label": "city",
          "type": "string"
        },
        {
          "name": "state",
          "label": "state",
          "type": "string"
        },
        {
          "name": "zipcode",
          "label": "zipcode",
          "type": "string"
        },
        {
          "name": "phone",
          "label": "phone",
          "type": "string"
        }
      ],
      "rows": [
        {
          "row": [
            "CST01002  ",
            "Joseph",
            "Smith",
            "1234 Main Street",
            "Apartment 56",
            "New York",
            "New York",
            "10174",
            "(646)555-1776"
          ]
        },
        {
          "row": [
            "CST01003  ",
            "Nicholas",
            "Ferguson",
            "202 Palomino Drive",
            "",
            "Pittsburgh",
            "Pennsylvania",
            "15071",
            "(412)555-4327"
          ]
        },
        {
          "row": [
            "CST01004  ",
            "Jane",
            "Aire",
            "15 State Street",
            "",
            "Philadelphia",
            "Pennsylvania",
            "19154",
            "(814)555-6789"
          ]
        },
        {
          "row": [
            "CST01005  ",
            "Charles",
            "Jones",
            "1819 Maple Street",
            "Apartment 17F",
            "Stratford",
            "Connecticut",
            "06614",
            "(203)555-3947"
          ]
        },
        {
          "row": [
            "CST01006  ",
            "Virginia",
            "Jefferson",
            "1710 South 51st Street",
            "Apartment 3245",
            "New York",
            "New York",
            "10175",
            "(718)555-2693"
          ]
        },
        {
          "row": [
            "CST01007  ",
            "Ralph",
            "Bacon",
            "57 Barn Swallow Avenue",
            "",
            "Charlotte",
            "North Carolina",
            "28205",
            "(704)555-4576"
          ]
        },
        {
          "row": [
            "CST01008  ",
            "Bonnie",
            "Dragon",
            "88 Cinderella Lane",
            "",
            "Jacksonville",
            "Florida",
            "32225",
            "(904)555-6514"
          ]
        },
        {
          "row": [
            "CST01009  ",
            "Herbert",
            "Smith",
            "12225 Waterfall Way",
            "Building 100, Suite 9",
            "Portland",
            "Oregon",
            "97220",
            "(971)555-7803"
          ]
        },
        {
          "row": [
            "CST01015  ",
            "Jack",
            "Corby",
            "1 Lone Star Way",
            "",
            "Dallas",
            "Texas",
            "75231",
            "(469)555-8023"
          ]
        },
        {
          "row": [
            "CST01019  ",
            "Robin",
            "Evers",
            "1814 Falcon Avenue",
            "",
            "Atlanta",
            "Georgia",
            "30355",
            "(470)555-4390"
          ]
        },
        {
          "row": [
            "CST01020  ",
            "Lloyd",
            "Abercrombie",
            "1954 Hughes Parkway",
            "",
            "Los Angeles",
            "California",
            "90099",
            "(213)555-2312"
          ]
        },
        {
          "row": [
            "CST01021  ",
            "Scott",
            "Watters",
            "24 Mariner Way",
            "",
            "Seattle",
            "Washington",
            "98124",
            "(206)555-6790"
          ]
        },
        {
          "row": [
            "CST01022  ",
            "Sandra",
            "King",
            "96 Lakefront Parkway",
            "",
            "Minneapolis",
            "Minnesota",
            "55426",
            "(651)555-9017"
          ]
        },
        {
          "row": [
            "CST01027  ",
            "Maryanne",
            "Peters",
            "35 Grand View Circle",
            "Apartment 5F",
            "Cincinnati",
            "Ohio",
            "45232",
            "(513)555-9067"
          ]
        },
        {
          "row": [
            "CST01034  ",
            "Corey",
            "Snyder",
            "1760 Boston Commons Avenue",
            "Suite 543",
            "Boston",
            "Massachusetts",
            "02136 ",
            "(617)555-3546"
          ]
        }
      ]
    };
    const results = new QueryResults( employeeJson );
    this.editorService.setPreviewResults( results, ViewEditorPart.EDITOR );

    if ( this.selectionService.getSelectedVirtualization() ) {
      this.editorService.setEditorVirtualization( this.selectionService.getSelectedVirtualization() );
    } else {
      // must have a virtualization selected
      this.editorService.addMessage( Message.create( Problem.ERR0100 ), ViewEditorPart.EDITOR );
    }

    if ( this.selectionService.getSelectedView() ) {
      this.editorService.setEditorView( this.selectionService.getSelectedView(), ViewEditorPart.EDITOR );

      if ( this.editorService.getViewName().length === 0 ) {
        this.editorService.addMessage( Message.create( Problem.ERR0110 ), ViewEditorPart.EDITOR );
      }
    } else {
      this.isNewView = true;
    }
  }

  /**
   * @returns {number} the number of warning messages
   */
  public get warningMsgCount(): number {
    return this.editorService.getWarningMessageCount();
  }

}
