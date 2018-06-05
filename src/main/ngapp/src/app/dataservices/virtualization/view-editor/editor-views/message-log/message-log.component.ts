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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { Subscription } from "rxjs/Subscription";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { EmptyStateConfig, NgxDataTableConfig, TableConfig } from "patternfly-ng";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.css']
})
export class MessageLogComponent implements OnInit, OnDestroy {

  public columns: any[];
  private emptyStateConfig: EmptyStateConfig;
  public ngxConfig: NgxDataTableConfig;
  public tableConfig: TableConfig;
  public rows: any[] = [];

  private readonly editorService: ViewEditorService;
  private readonly logger: LoggerService;
  private subscription: Subscription;

  constructor( logger: LoggerService,
               editorService: ViewEditorService ) {
    this.logger = logger;
    this.editorService = editorService;
  }

  private clearMessages(): void {
    if ( this.rows && this.rows.length !== 0 ) {
      this.rows = [];
    }
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "MessageLogComponent received event: " + event.toString() );

    if ( event.typeIsLogMessageAdded() ) {
      this.rows.push( event.args[ 0 ] );
    } else if ( event.typeIsLogMessageDeleted() ) {
      const deletedMsg = event.args[ 0 ];
      const index = this.rows.findIndex( ( msg ) => msg.id === deletedMsg.id );

      if ( index !== -1 ) {
        this.rows.splice( index, 1 );
      }
    } else if ( event.typeIsLogMessagesCleared() ) {
      this.clearMessages();
    }
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
    this.subscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );

    this.columns = [
      {
        prop: "id"
      },
      {
        prop: "type"
      },
      {
        prop: "description"
      },
      {
        prop: "context"
      },
    ];

    this.rows = this.editorService.getMessages();

    this.ngxConfig = {
      headerHeight: 40,
      rowHeight: 20,
      scrollbarH: true,
      scrollbarV: true
    } as NgxDataTableConfig;

    this.emptyStateConfig = {
      title: "No messages found"
    } as EmptyStateConfig;

    this.tableConfig = {
      emptyStateConfig: this.emptyStateConfig
    } as TableConfig;
  }

}
