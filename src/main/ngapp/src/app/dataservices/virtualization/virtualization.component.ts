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
import { NewDataservice } from "@dataservices/shared/new-dataservice.model";
import { VdbService } from "@dataservices/shared/vdb.service";

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
  private createInProgress = false;

  private selectionService: SelectionService;
  private dataserviceService: DataserviceService;
  private modalService: BsModalService;
  private vdbService: VdbService;
  private router: Router;
  private logger: LoggerService;
  private noViewsConfig: EmptyStateConfig;
  private nameVirtualizationConfig: EmptyStateConfig;
  private currentVirtualization: Dataservice = null;
  private originalName: string;
  private newVirtualization: NewDataservice = null;

  constructor( selectionService: SelectionService, dataserviceService: DataserviceService,
               vdbService: VdbService, modalService: BsModalService, router: Router, logger: LoggerService ) {
    this.selectionService = selectionService;
    this.dataserviceService = dataserviceService;
    this.vdbService = vdbService;
    this.modalService = modalService;
    this.router = router;
    this.logger = logger;
    this.createViewPropertyForm();
  }

  public ngOnInit(): void {
    // If there is a virtualization selection, edit it.  Otherwise create a new virtualization
    if (this.selectionService.hasSelectedVirtualization) {
      this.currentVirtualization = this.selectionService.getSelectedVirtualization();
      this.originalName = this.currentVirtualization.getId();
      this.initForm(this.currentVirtualization.getId(), this.currentVirtualization.getDescription(), false);
      // Init views
      this.views = this.currentVirtualization.getViews();
      this.setViewsEditableState(true);
    } else {
      this.originalName = "";
      this.newVirtualization = this.dataserviceService.newDataserviceInstance(this.originalName, "");
      this.initForm(this.newVirtualization.getId(), this.newVirtualization.getDescription(), true);
      // Init Views
      this.views = [];
    }
  }

  /**
   * Get new virtualization status
   * @returns {boolean} true if the virtualization has not yet been named
   */
  public get isNew( ): boolean {
    return this.newVirtualization && this.newVirtualization !== null;
  }

  /**
   * Get the virtualization views
   * @returns {View[]} the views
   */
  public get allViews( ): View[] {
    return this.views;
  }

  /**
   * Determine if the virtualization has a pending name change
   * @returns {boolean} 'true' if pending name change
   */
  public get hasPendingNameChange( ): boolean {
    return this.originalName !== this.viewPropertyForm.controls["name"].value.toString();
  }

  /**
   * Save the dataservice using the current name value.  This cannot be invoked unless there are pending changes,
   * and the name is valid.
   */
  public onSaveName( ): void {
    const theName = this.viewPropertyForm.controls["name"].value.toString();
    const theDescription = this.viewPropertyForm.controls["description"].value.toString();

    // If this is a brand new dataservice, create it
    if (this.isNew) {
      const self = this;
      this.createInProgress = true;
      this.newVirtualization.setId(theName);
      this.newVirtualization.setDescription(theDescription);
      this.dataserviceService
        .createDataservice(this.newVirtualization)
        .subscribe(
          (wasSuccess) => {
            // After create of dataservice, remove 'newVirtualization'
            self.newVirtualization = null;
            // Set the current virtualization to the newly created virtualization
            self.selectDataservice(theName);
          },
          (error) => {
            self.logger.error("[VirtualizationComponent] Error creating virtualization: %o", error);
            self.createInProgress = false;
          }
        );
      // Existing dataservice - update it
    } else {
      // TODO: Determine action for rename of existing
    }
  }

  /**
   * Handler for dataservice name changes.
   * @param {AbstractControl} input
   */
  public handleNameChanged( input: AbstractControl ): void {
    const self = this;

    this.dataserviceService.isValidName( input.value ).subscribe(
      ( errorMsg ) => {
        if ( errorMsg ) {
          // only update if error has changed
          if ( errorMsg !== self.nameValidationError ) {
            self.nameValidationError = errorMsg;
          }
          self.setViewsEditableState(false);
        } else { // name is valid
          self.nameValidationError = "";
          if (self.hasPendingNameChange) {
            self.setViewsEditableState(false);
          } else {
            self.setViewsEditableState(true);
          }
        }
      },
      ( error ) => {
        self.logger.error( "[handleNameChanged] Error: %o", error );
      } );
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
   * The configuration for empty state with brand new virtualization.  (Prompts user to name the virtualization)
   * @returns {EmptyStateConfig} the empty state config
   */
  public get newVirtualizationConfig(): EmptyStateConfig {
    if ( !this.nameVirtualizationConfig ) {
      this.nameVirtualizationConfig = {
        iconStyleClass: "pficon-warning-triangle-o",
        info: "Please enter a name for the virtualization and save it",
        title: "Enter VirtualizationName"
      } as EmptyStateConfig;
    }

    return this.nameVirtualizationConfig;
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
    // Setting the selected view null indicates new view
    this.selectionService.setSelectedView( this.currentVirtualization, null );

    const link: string[] = [ DataservicesConstants.viewPath ];
    this.logger.log("[VirtualizationComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /**
   * Handle Edit of the specified View
   * @param {string} viewName
   */
  public onEdit(viewName: string): void {
    // Sets the selected view in the service
    const selectedView =  this.views.find((x) => x.getName() === viewName);
    this.selectionService.setSelectedView( this.currentVirtualization, selectedView );

    const link: string[] = [ DataservicesConstants.viewPath ];
    this.logger.log("[VirtualizationComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  public onSelected( view: View ): void {
    this.selectionService.setSelectedView( this.currentVirtualization, view );
  }

  // ----------------
  // Private Methods
  // ----------------

  /**
   * Deletes the specified view
   * @param {string} viewName the name of the view
   */
  private onDeleteView(viewName: string): void {
    const selectedView =  this.views.find((x) => x.getName() === viewName);
    const vdbName = this.currentVirtualization.getServiceVdbName();
    const modelName = this.currentVirtualization.getServiceViewModel();
    // Note: we can only doDelete selected items that we can see in the UI.
    this.logger.log("[VirtualizationComponent] Deleting selected Virtualization View.");
    const self = this;
    this.vdbService
      .deleteView(vdbName, modelName, selectedView.getName())
      .subscribe(
        (wasSuccess) => {
          self.removeViewFromList(selectedView);
        },
        (error) => {
          self.logger.error("[VirtualizationComponent] Error deleting the view: %o", error);
        }
      );
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

  /*
   * Init the form values
   * @param {string} name the dataservice name
   * @param {string} description the dataservice description
   * @param {boolean} nameEditable 'true' if can edit the name
   */
  private initForm(name: string, descr: string, nameEditable: boolean): void {
    this.viewPropertyForm.controls["name"].setValue(name);
    this.viewPropertyForm.controls["description"].setValue(name);
    if (!nameEditable) {
      this.viewPropertyForm.get("name").disable();
    }
  }

  /*
   * Select the specified Dataservice.
   * @param {string} dsName the name of the dataservice
   */
  private selectDataservice(dsName: string): void {
    const self = this;
    this.dataserviceService
      .getAllDataservices()
      .subscribe(
        (dataservices) => {
          for (const ds of dataservices) {
            if (ds.getId() === dsName) {
              self.currentVirtualization = ds;
              self.originalName = this.currentVirtualization.getId();
              self.initForm(this.currentVirtualization.getId(), this.currentVirtualization.getDescription(), false);
            }
          }
          self.createInProgress = false;
        },
        (error) => {
          self.logger.error("[VirtualizationComponent] Error selecting the virtualization: %o", error);
          self.createInProgress = false;
        }
      );
  }

  /*
   * Set the editable state of all views.
   * @param {boolean} isEditable the editable state
   */
  private setViewsEditableState(isEditable: boolean): void {
    for (const view of this.views) {
      view.editable = isEditable;
    }
  }

  /*
   * Remove the specified View from the list of views
   * @param {View} view the view to remove
   */
  private removeViewFromList(view: View): void {
    this.views.splice(this.views.indexOf(view), 1);
  }

}
