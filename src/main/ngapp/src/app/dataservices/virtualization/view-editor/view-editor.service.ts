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

import { EventEmitter, Injectable, Output } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { View } from "@dataservices/shared/view.model";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventSource } from "@dataservices/virtualization/view-editor/event/view-editor-event-source.enum";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";

@Injectable()
export class ViewEditorService {

  /**
   * An event fired when the state of the service has changed.
   *
   * @type {EventEmitter<ViewEditorEvent>}
   */
  @Output() public editorEvent: EventEmitter< ViewEditorEvent > = new EventEmitter< ViewEditorEvent >();

  private _editorView: View;
  private _editorVirtualization: Dataservice;
  private _initialDescription: string;
  private _initialName: string;
  private _logger: LoggerService;
  private _previewResults: QueryResults;
  private _readOnly = false;
  private _viewIsValid = false;

  constructor( logger: LoggerService ) {
    this._logger = logger;
    // TODO remove this when fully implemented
    this._editorVirtualization = new Dataservice();
    this._editorVirtualization.setId( "MyAwesomeVirtualization" );
    this._editorView = new View();
    this._editorView.setName( "MyUnbelievableView" );
    this._editorView.setDescription( "This is the description for the view being edited." );
  }

  private fire( event: ViewEditorEvent ): void {
    this._logger.debug( "firing event ${event}" );
    this.editorEvent.emit( event );
  }

  /**
   * @returns {View} the view being edited or `null` if not set
   */
  public getEditorView(): View {
    return this._editorView;
  }

  /**
   * @returns {Dataservice} the virtualization of the view being edited or `null` if not set
   */
  public getEditorVirtualization(): Dataservice {
    return this._editorVirtualization;
  }

  /**
   * @returns {QueryResults} the preview results or `null` if not set
   */
  public getPreviewResults(): QueryResults {
    return this._previewResults;
  }

  /**
   * @returns {string} the view description or `null` if view has not been set
   */
  public getViewDescription(): string {
    if ( this._editorView ) {
      return this._editorView.getDescription();
    }

    return null;
  }

  /**
   * @returns {string} the view name or `null` if view has not been set
   */
  public getViewName(): string {
    if ( this._editorView ) {
      return this._editorView.getName();
    }

    return null;
  }

  /**
   * @returns {boolean} `true` if editor is readonly or has not been set
   */
  public isReadOnly(): boolean {
    return this._readOnly;
  }

  /**
   * Sets the view being edited. This is called when the editor is first constructed and can only be called once.
   * Subsequent calls are ignored.
   *
   * @param {View} view the view being edited
   */
  public setEditorView( view: View ): void {
    if ( !this._editorView ) {
      this._editorView = view;
      this._initialDescription = this._editorView.getDescription();
      this._initialName = this._editorView.getName();
    } else {
      this._logger.debug( "setEditorView called more than once" );
    }
  }

  /**
   * Sets the virtualization whose view is being edited. This is called when the editor is first constructed and can
   * only be called once. Subsequent calls are ignored.
   *
   * @param {Dataservice} virtualization the virtualization of the view being edited
   */
  public setEditorVirtualization( virtualization: Dataservice ): void {
    if ( !this._editorVirtualization ) {
      this._editorVirtualization = virtualization;
    } else {
      this._logger.debug( "setEditorVirtualization called more than once" );
    }
  }

  /**
   * Sets the preview results. Fires a `ViewEditorEventType.PREVIEW_RESULTS_CHANGED` event having the results as an
   * argument.
   *
   * @param {QueryResults} results the new preview results
   * @param {ViewEditorEventSource} source the source making the update
   */
  public setPreviewResults( results: QueryResults,
                            source: ViewEditorEventSource ): void {
    this._previewResults = results;
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.PREVIEW_RESULTS_CHANGED, [ results ] ) );
  }

  /**
   * Sets the readonly property of the editor. Fires a `ViewEditorEventType.READONLY_CHANGED` event having the
   * readonly property as an argument.
   *
   * @param {boolean} newReadOnly the new readonly value
   * @param {ViewEditorEventSource} source the source making the update
   */
  public setReadOnly( newReadOnly: boolean,
                      source: ViewEditorEventSource ): void {
    if ( this._readOnly !== newReadOnly ) {
      this._readOnly = newReadOnly;
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.READONLY_CHANGED, [ newReadOnly ] ) );
    }
  }

  /**
   * Sets the view description to the new value. Fires a `ViewEditorEventType.VIEW_DESCRIPTION_CHANGED` event
   * having the new description as an argument.
   *
   * @param {string} newDescription the new view description
   * @param {ViewEditorEventSource} source the source making the update
   */
  public setViewDescription( newDescription: string,
                             source: ViewEditorEventSource ): void {
    this._editorView.setDescription( newDescription );
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_DESCRIPTION_CHANGED, [ newDescription ] ) );
  }

  /**
   * Sets the view validation status to the new value. Fires a `ViewEditorEventType.VIEW_VALIDATION_CHANGED` event
   * having the new value as an argument.
   *
   * @param {string} newValidState the new view validation state
   * @param {ViewEditorEventSource} source the source making the update
   */
  public setViewIsValid( newValidState: boolean,
                         source: ViewEditorEventSource ): void {
    if ( this._viewIsValid !== newValidState ) {
      this._viewIsValid = newValidState;
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_DESCRIPTION_CHANGED, [ this._viewIsValid ] ) );
    }
  }

  /**
   * Sets the view name to the new value. Fires a `ViewEditorEventType.VIEW_NAME_CHANGED` event having the new name
   * as an argument.
   *
   * @param {string} newName the new view name
   * @param {ViewEditorEventSource} source the source making the update
   */
  public setViewName( newName: string,
                      source: ViewEditorEventSource ): void {
    this._editorView.setName( newName );
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_NAME_CHANGED, [ newName ] ) );
  }

  /**
   * @returns {boolean} `true` if the view is valid
   */
  public viewIsValid(): boolean {
    return this._viewIsValid;
  }

}
