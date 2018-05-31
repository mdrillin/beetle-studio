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

import { ViewEditorEventSource } from "@dataservices/virtualization/view-editor/event/view-editor-event-source.enum";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";

export class ViewEditorEvent {

  private readonly _args: any[] = [];
  private readonly _source: ViewEditorEventSource;
  private readonly _type: ViewEditorEventType;

  /**
   * Factory method to create an event.
   *
   * @param {ViewEditorEventSource} source the source of the event
   * @param {ViewEditorEventType} type the type of event
   * @param {object[]} args the optional args
   * @returns {ViewEditorEvent} the created event
   */
  public static create( source: ViewEditorEventSource,
                        type: ViewEditorEventType,
                        args?: any[] ): ViewEditorEvent {
    return new ViewEditorEvent( source, type, args );
  }

  private constructor( source: ViewEditorEventSource,
                       type: ViewEditorEventType,
                       args?: any[] ) {
    this._source = source;
    this._type = type;

    if ( args ) {
      this._args = args;
    }
  }

  /**
   * @returns {any[]} the optional args to the event (never `null` but can be empty)
   */
  public get args(): any[] {
    return this._args;
  }

  /**
   * @returns {ViewEditorEventSource} the event source
   */
  public get source(): ViewEditorEventSource {
    return this._source;
  }

  /**
   * @returns {boolean} `true` if the canvas editor part was the source of the event
   */
  public sourceIsCanvas(): boolean {
    return this.source === ViewEditorEventSource.CANVAS;
  }

  /**
   * @returns {boolean} `true` if the editor was the source of the event
   */
  public sourceIsEditor(): boolean {
    return this.source === ViewEditorEventSource.EDITOR;
  }

  /**
   * @returns {boolean} `true` if the header editor part was the source of the event
   */
  public sourceIsHeader(): boolean {
    return this.source === ViewEditorEventSource.HEADER;
  }

  /**
   * @returns {boolean} `true` if the message log part was the source of the event
   */
  public sourceIsMessageLog(): boolean {
    return this.source === ViewEditorEventSource.MESSAGE_LOG;
  }

  /**
   * @returns {boolean} `true` if the preview editor part was the source of the event
   */
  public sourceIsPreview(): boolean {
    return this.source === ViewEditorEventSource.PREVIEW;
  }

  /**
   * @returns {boolean} `true` if the properties editor part was the source of the event
   */
  public sourceIsProperties(): boolean {
    return this.source === ViewEditorEventSource.PROPERTIES;
  }

  /**
   * @returns {string} a string representation of the event
   */
  public toString(): string {
    return `event type: ${this.type}, source: ${this.source}, arg count: ${this.args.length}`;
  }

  /**
   * @returns {ViewEditorEventType} the event type
   */
  public get type(): ViewEditorEventType {
    return this._type;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.CANVAS_SELECTION_CHANGED`
   */
  public typeIsCanvasSelectionChanged(): boolean {
    return this.type === ViewEditorEventType.CANVAS_SELECTION_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.EDITOR_CONFIG_CHANGED`
   */
  public typeIsEditorConfigChanged(): boolean {
    return this.type === ViewEditorEventType.EDITOR_CONFIG_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.LOG_MESSAGE_ADDED`
   */
  public typeIsLogMessageAdded(): boolean {
    return this.type === ViewEditorEventType.LOG_MESSAGE_ADDED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.LOG_MESSAGE_DELETED`
   */
  public typeIsLogMessageDeleted(): boolean {
    return this.type === ViewEditorEventType.LOG_MESSAGE_DELETED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.LOG_MESSAGES_CLEARED`
   */
  public typeIsLogMessagesCleared(): boolean {
    return this.type === ViewEditorEventType.LOG_MESSAGES_CLEARED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.PREVIEW_RESULTS_CHANGED`
   */
  public typeIsPreviewResultsChanged(): boolean {
    return this.type === ViewEditorEventType.PREVIEW_RESULTS_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.READONLY_CHANGED`
   */
  public typeIsReadonlyChanged(): boolean {
    return this.type === ViewEditorEventType.READONLY_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.VIEW_CHANGED`
   */
  public typeIsViewChanged(): boolean {
    return this.type === ViewEditorEventType.VIEW_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.VIEW_DESCRIPTION_CHANGED`
   */
  public typeIsViewDescriptionChanged(): boolean {
    return this.type === ViewEditorEventType.VIEW_DESCRIPTION_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.VIEW_NAME_CHANGED`
   */
  public typeIsViewNameChanged(): boolean {
    return this.type === ViewEditorEventType.VIEW_NAME_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.VIEW_VALID_CHANGED`
   */
  public typeIsViewValidChanged(): boolean {
    return this.type === ViewEditorEventType.VIEW_VALID_CHANGED;
  }

}
