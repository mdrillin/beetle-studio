import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { LoggerService } from "@core/logger.service";
import { SelectionService } from "@core/selection.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { View } from "@dataservices/shared/view.model";
import { ConfirmDialogComponent } from "@shared/confirm-dialog/confirm-dialog.component";
import { BsModalService } from "ngx-bootstrap";
import { ActionConfig, EmptyStateConfig } from "patternfly-ng";

@Component({
  selector: "app-virtualization",
  templateUrl: "./virtualization.component.html",
  styleUrls: ["./virtualization.component.css"]
})
export class VirtualizationComponent implements OnInit {

  public readonly virtualizationsLink = DataservicesConstants.dataservicesRootPath;

  public viewPropertyForm: FormGroup;
  public nameValidationError = "";
  public views: View[] = [];
  public selectedViews: View[] = [];

  private selectionService: SelectionService;
  private dataserviceService: DataserviceService;
  private modalService: BsModalService;
  private router: Router;
  private logger: LoggerService;
  private noViewsConfig: EmptyStateConfig;
  private currentVirtualization: Dataservice = null;

  constructor( selectionService: SelectionService, dataserviceService: DataserviceService,
               modalService: BsModalService, router: Router, logger: LoggerService ) {
    this.selectionService = selectionService;
    this.dataserviceService = dataserviceService;
    this.modalService = modalService;
    this.router = router;
    this.logger = logger;
    this.createViewPropertyForm();
  }

  public ngOnInit(): void {
    // If there is a virtualization selection, edit it.  Otherwise create a new virtualization
    if (this.selectionService.hasSelectedVirtualization) {
      this.currentVirtualization = this.selectionService.getSelectedVirtualization();
    } else {
      this.currentVirtualization = new Dataservice();
      this.currentVirtualization.setId("newVirtualization");
      this.currentVirtualization.setDescription(null);
    }

    // Set the initial form values
    const dsName = this.currentVirtualization.getId();
    const dsDescr = this.currentVirtualization.getDescription();
    this.viewPropertyForm.controls["name"].setValue(dsName);
    this.viewPropertyForm.controls["description"].setValue(dsDescr);

    // Disable name changes on edit
    if (this.selectionService.hasSelectedVirtualization) {
      this.viewPropertyForm.get("name").disable();
    }

    // Get views
    this.views = this.currentVirtualization.getViews();
  }

  /**
   * Get the virtualization views
   * @returns {View[]} the views
   */
  public get allViews( ): View[] {
    return this.views;
  }

  /**
   * Handler for dataservice name changes.
   * @param {AbstractControl} input
   */
  public handleNameChanged( input: AbstractControl ): void {
    const self = this;

    // this.dataserviceService.isValidName( input.value ).subscribe(
    //   ( errorMsg ) => {
    //     if ( errorMsg ) {
    //       // only update if error has changed
    //       if ( errorMsg !== self.nameValidationError ) {
    //         self.nameValidationError = errorMsg;
    //       }
    //     } else { // name is valid
    //       self.nameValidationError = "";
    //     }
    //     self.updatePage2aValidStatus();
    //   },
    //   ( error ) => {
    //     self.logger.error( "[handleNameChanged] Error: %o", error );
    //   } );
  }

  /*
   * Return the name valid state
   */
  public get nameValid(): boolean {
    return this.nameValidationError == null || this.nameValidationError.length === 0;
  }

  /**
   * The configuration for empty state (no views)
   * @returns {EmptyStateConfig} the empty state config
   */
  public get viewsEmptyConfig(): EmptyStateConfig {
    if ( !this.noViewsConfig ) {
      const actionConfig = {
        primaryActions: [
          {
            id: "createViewActionId",
            title: "Add View",
            tooltip: "Add a view"
          }
        ]
      } as ActionConfig;

      this.noViewsConfig = {
        actions: actionConfig,
        iconStyleClass: "pficon-warning-triangle-o",
        info: "No views are defined for this virtualization. Please click below to create a view.",
        title: "No Views Defined"
      } as EmptyStateConfig;
    }

    return this.noViewsConfig;
  }

  /**
   * Handle Delete of the specified View
   * @param {string} viewName
   */
  public onDelete(viewName: string): void {
    // Dialog Content
    const message = "Do you really want to delete View '" + viewName + "'?";
    const initialState = {
      title: "Confirm Delete",
      bodyContent: message,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete"
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    modalRef.content.confirmAction.take(1).subscribe((value) => {
      this.onDeleteView(viewName);
    });
  }

  /**
   * Handle request for new View
   */
  public onNew(): void {
    this.selectionService.setSelectedView(this.currentVirtualization, null);

    alert("Go to View Editor - for New View ");

    // const link: string[] = [ DataservicesConstants.virtualizationPath ];
    // this.logger.log("[DataservicesPageComponent] Navigating to: %o", link);
    // this.router.navigate(link).then(() => {
    //   // nothing to do
    // });
  }

  /**
   * Handle Edit of the specified View
   * @param {string} viewName
   */
  public onEdit(viewName: string): void {
    const selectedView =  this.views.find((x) => x.getName() === viewName);

    alert("Go to View Editor - Edit View " + selectedView.getName());

    // Sets the selected view and edit mode before transferring
    // this.wizardService.setSelectedDataservice(selectedService);
    // this.wizardService.setEdit(true);
    //
    // const link: string[] = [ DataservicesConstants.virtualizationPath ];
    // this.logger.log("[DataservicesPageComponent] Navigating to: %o", link);
    // this.router.navigate(link).then(() => {
    //   // nothing to do
    // });
  }

  // ----------------
  // Private Methods
  // ----------------

  /**
   * Deletes the specified view
   * @param {string} viewName the name of the view
   */
  private onDeleteView(viewName: string): void {
    const selectedService =  this.views.find((x) => x.getName() === viewName);

    // Note: we can only doDelete selected items that we can see in the UI.
    this.logger.log("[VirtualizationComponent] Deleting selected Virtualization Vies.");
    const self = this;
    // this.dataserviceService
    //   .deleteDataservice(selectedService.getId())
    //   .subscribe(
    //     (wasSuccess) => {
    //       self.undeployVdb(selectedService.getServiceVdbName());
    //       self.removeDataserviceFromList(selectedService);
    //     },
    //     (error) => {
    //       self.error(error, "Error deleting the dataservice");
    //     }
    //   );
  }

  /*
   * Creates the view property form
   */
  private createViewPropertyForm(): void {
    // New Virtualization is allowed to edit the name - handle name changes
    if (!this.selectionService.hasSelectedVirtualization) {
      this.viewPropertyForm = new FormGroup({
        name: new FormControl( "", this.handleNameChanged.bind( this ) ),
        description: new FormControl("")
      });
      // Responds to basic property changes - updates the page status
      this.viewPropertyForm.valueChanges.subscribe((val) => {
        // this.updatePage2aValidStatus( );
      });
      // Edit Virtualization is not allowed to edit the name
    } else {
      this.viewPropertyForm = new FormGroup({
        name: new FormControl( "" ),
        description: new FormControl("")
      });
    }
  }

}
