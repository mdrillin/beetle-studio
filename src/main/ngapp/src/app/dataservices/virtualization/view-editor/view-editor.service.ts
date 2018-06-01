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
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { Problem } from "@dataservices/virtualization/view-editor/editor-views/message-log/problem";
import { SchemaNode } from "@connections/shared/schema-node.model";

@Injectable()
export class ViewEditorService {

  /**
   * An event fired when the state of the service has changed.
   *
   * @type {EventEmitter<ViewEditorEvent>}
   */
  @Output() public editorEvent: EventEmitter< ViewEditorEvent > = new EventEmitter();

  private _editorConfig: string;
  private _editorView: View;
  private _editorVirtualization: Dataservice;
  private _initialDescription: string;
  private _initialName: string;
  private _logger: LoggerService;
  private _messages: Message[] = [];
  private _previewResults: QueryResults;
  private _readOnly = false;
  private _viewIsValid = false;
  private _viewNameIsEmpty = false;

  constructor( logger: LoggerService ) {
    this._logger = logger;
  }

  /**
   * @param {Message} msg the message being added
   * @param {ViewEditorPart} source the source that is adding the message
   */
  public addMessage( msg: Message,
                     source: ViewEditorPart ): void {
    this._messages.push( msg );
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGE_ADDED, [ msg ] ) );
  }

  /**
   * Clears all log messages.
   *
   * @param {ViewEditorPart} source the source that is deleting the message
   */
  public clearMessages( source: ViewEditorPart ): void {
    this._messages.length = 0;
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGES_CLEARED ) );
  }

  /**
   * @param {string} msgId the ID of the message being deleted
   * @param {ViewEditorPart} source the source that is deleting the message
   */
  public deleteMessage( msgId: string,
                        source: ViewEditorPart ): void {
    const index = this._messages.findIndex( ( msg ) => msg.id === msgId );

    if ( index !== -1 ) {
      const deleted = this._messages.splice( index, 1 );
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGE_DELETED, [ deleted[ 0 ] ] ) );
    }
  }

  /**
   * @param {ViewEditorEvent} event the event to broadcast
   */
  public fire( event: ViewEditorEvent ): void {
    this._logger.debug( "firing event: " + event );
    this.editorEvent.emit( event );
  }

  /**
   * @returns {string} the editor's CSS class
   */
  public getEditorConfig(): string {
    return this._editorConfig;
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
   * @returns {number} the number of error messages
   */
  public getErrorMessageCount(): number {
    return this.getErrorMessages().length;
  }

  /**
   * @returns {Message[]} the error messages
   */
  public getErrorMessages(): Message[] {
    return this._messages.filter( ( msg ) => msg.isError() );
  }

  /**
   * @returns {number} the number of informational messages
   */
  public getInfoMessageCount(): number {
    return this.getInfoMessages().length;
  }

  /**
   * @returns {Message[]} the informational messages
   */
  public getInfoMessages(): Message[] {
    return this._messages.filter( ( msg ) => msg.isInfo() );
  }

  /**
   * @returns {Message[]} the log messages (error, warning, and info)
   */
  public getMessages(): Message[] {
    return this._messages;
  }

  /**
   * @returns {QueryResults} the preview results or `null` if not set
   */
  public getPreviewResults(): QueryResults {
    return this._previewResults;
  }

  /**
   * @returns {string} the view description (never `null` but can be empty)
   */
  public getViewDescription(): string {
    if ( this._editorView && this._editorView.getDescription() ) {
      return this._editorView.getDescription();
    }

    return "";
  }

  /**
   * @returns {string} the view name (never `null` but can be empty)
   */
  public getViewName(): string {
    if ( this._editorView ) {
      return this._editorView.getName();
    }

    return "";
  }

  /**
   * @returns {number} the number of warning messages
   */
  public getWarningMessageCount(): number {
    return this.getWarningMessages().length;
  }

  /**
   * @returns {Message[]} the warning messages
   */
  public getWarningMessages(): Message[] {
    return this._messages.filter( ( msg ) => msg.isWarning() );
  }

  /**
   * @returns {boolean} `true` if the editor has unsaved changes
   */
  public hasChanges(): boolean {
    // TODO this is not working since save button does not enable after making changes
    return this._initialName !== this.getViewName() || this._initialDescription !== this.getViewDescription();
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
   * @param {string} newCssClass the editor's CSS class
   */
  public setEditorConfig( newCssClass: string ): void {
    if ( this._editorConfig !== newCssClass ) {
      this._editorConfig = newCssClass;
      this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_CONFIG_CHANGED, [ newCssClass ] ) );
    }
  }

  /**
   * Sets the view being edited. This should only be called once. Subsequent calls are ignored. Fires a
   * `ViewEditorEventType.VIEW_CHANGED` event having the view as an argument.
   *
   * @param {View} view the view being edited
   * @param {ViewEditorPart} source the source making the update
   */
  public setEditorView( view: View,
                        source: ViewEditorPart ): void {
    if ( !this._editorView ) {
      this._editorView = view;
      this._initialDescription = this._editorView.getDescription();
      this._initialName = this._editorView.getName();
      this._viewNameIsEmpty = this._initialName ? this._initialName.length === 0 : true;
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_CHANGED, [ this._editorView ] ) );
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
   * @param {ViewEditorPart} source the source making the update
   */
  public setPreviewResults( results: QueryResults,
                            source: ViewEditorPart ): void {
    this._previewResults = results;
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.PREVIEW_RESULTS_CHANGED, [ results ] ) );
  }

  /**
   * Sets the readonly property of the editor. Fires a `ViewEditorEventType.READONLY_CHANGED` event having the
   * readonly property as an argument.
   *
   * @param {boolean} newReadOnly the new readonly value
   * @param {ViewEditorPart} source the source making the update
   */
  public setReadOnly( newReadOnly: boolean,
                      source: ViewEditorPart ): void {
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
   * @param {ViewEditorPart} source the source making the update
   */
  public setViewDescription( newDescription: string,
                             source: ViewEditorPart ): void {
    this._editorView.setDescription( newDescription );
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_DESCRIPTION_CHANGED, [ newDescription ] ) );
  }

  /**
   * Sets the view sources to the new value. Fires a `ViewEditorEventType.VIEW_SOURCES_CHANGED` event
   * having the new sources as an argument.
   *
   * @param {SchemaNode[]} newSources the array of new view sources
   * @param {ViewEditorEventSource} source the source making the update
   */
  public setViewSources( newSources: SchemaNode[],
                         source: ViewEditorPart ): void {
    this._editorView.setSources( newSources );
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_SOURCES_CHANGED, [ newSources ] ) );
  }

  /**
   * Sets the view validation status to the new value. Fires a `ViewEditorEventType.VIEW_VALIDATION_CHANGED` event
   * having the new value as an argument.
   *
   * @param {string} newValidState the new view validation state
   * @param {ViewEditorPart} source the source making the update
   */
  public setViewIsValid( newValidState: boolean,
                         source: ViewEditorPart ): void {
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
   * @param {ViewEditorPart} source the source making the update
   */
  public setViewName( newName: string,
                      source: ViewEditorPart ): void {
    this._editorView.setName( newName );

    const oldIsEmpty = this._viewNameIsEmpty;
    this._viewNameIsEmpty = newName ? newName.length === 0 : true;

    if ( oldIsEmpty !== this._viewNameIsEmpty ) {
      if ( oldIsEmpty ) {
        this.deleteMessage( Problem.ERR0110.id, source );
      } else {
        this.addMessage( Message.create( Problem.ERR0110 ), source );
      }
    }

    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_NAME_CHANGED, [ newName ] ) );
  }

  /**
   * @returns {boolean} `true` if the view is valid
   */
  public viewIsValid(): boolean {
    return this._viewIsValid;
  }

}
