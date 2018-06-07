import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { ConnectionSchemaTreeComponent } from "@dataservices/connection-schema-tree/connection-schema-tree.component";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { SelectedNodesListComponent } from "@dataservices/selected-nodes-list/selected-nodes-list.component";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { TreeModule } from "angular-tree-component";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  WizardModule } from "patternfly-ng";
import { ConnectionNodeSelectorComponent } from "./connection-node-selector.component";

describe("ConnectionNodeSelectorComponent", () => {
  let component: ConnectionNodeSelectorComponent;
  let fixture: ComponentFixture<ConnectionNodeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        TreeModule,
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        WizardModule
      ],
      declarations: [ ConnectionNodeSelectorComponent, ConnectionSchemaTreeComponent, SelectedNodesListComponent,
                      SelectedNodeComponent ],
      providers: [
        LoggerService, NotifierService, WizardService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionNodeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it("should be created", () => {
  //   expect(component).toBeTruthy();
  // });
});
