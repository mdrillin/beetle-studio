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

  /**
   * @returns {string} a string representation of the event
   */
  public toString = (): string => {
    return "type: ${this.type}, source: ${this.source}, arg count: ${this.args.length}";
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
   * @returns {ViewEditorEventType} the event type
   */
  public get type(): ViewEditorEventType {
    return this._type;
  }

}
