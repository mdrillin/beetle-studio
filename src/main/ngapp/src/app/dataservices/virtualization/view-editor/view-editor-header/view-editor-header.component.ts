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

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ViewEditorEventSource } from "@dataservices/virtualization/view-editor/event/view-editor-event-source.enum";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-editor-header",
  templateUrl: "./view-editor-header.component.html",
  styleUrls: ["./view-editor-header.component.css"]
})
export class ViewEditorHeaderComponent implements OnInit {

  private logger: LoggerService;
  private editorService: ViewEditorService;

  constructor( editorService: ViewEditorService,
               logger: LoggerService ) {
    this.editorService = editorService;
    this.logger = logger;
  }

  public ngOnInit(): void {
    // nothing to do
  }

  /**
   * @returns {boolean} `true` if view being edited is readonly
   */
  public get readOnly(): boolean {
    return this.editorService.isReadOnly();
  }

  /**
   * @returns {string} the view description
   */
  public get viewDescription(): string {
    return this.editorService.getViewDescription();
  }

  /**
   * @param {string} newDescription the new description
   */
  public set viewDescription( newDescription: string ) {
    this.editorService.setViewDescription( newDescription, ViewEditorEventSource.HEADER );
  }

  /**
   * Called when text in the view description textarea changes.
   *
   * @param {string} newDescription the new description of the view
   */
  public viewDescriptionChanged( newDescription: string ): void {
    this.viewDescription = newDescription;
  }

  /**
   * @returns {string} the view name
   */
  public get viewName(): string {
    if ( this.editorService.getEditorView() ) {
      return this.editorService.getViewName();
    }

    // should always have a view so shouldn't get here
    this.logger.debug( "View editor service does not have a selected view" );
    return "< unknown >";
  }

  /**
   * @param {string} newName the new name of the view
   */
  public set viewName( newName: string ) {
    this.editorService.setViewName( newName, ViewEditorEventSource.HEADER );
  }

  /**
   * Called when text in the view name texteditor changes.
   *
   * @param {string} newName the new name of the view
   */
  public viewNameChanged( newName: string ): void {
    this.viewName = newName;
  }

  /**
   * @returns {string} the name of the dataservice of the view being edited
   */
  public get virtualizationName(): string {
    const virtName = this.editorService.getEditorVirtualization();

    if ( virtName ) {
      return virtName.getId();
    }

    // should always have a virtualization name so shouldn't get here
    this.logger.debug( "View editor service does not have a selected virtualizaiton" );
    return "< unknown >";
  }

}
