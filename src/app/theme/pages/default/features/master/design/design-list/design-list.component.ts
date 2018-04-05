import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { DesignService } from '../../../../_services/design.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Design } from "../../../../_models/design";
@Component({
  selector: "app-design-list",
  templateUrl: "./design-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class DesignListComponent implements OnInit {

  designForm: any;
  designObj: any;
  params: number;
  designList = [];
  categoryList: SelectItem[];
  selectedCategory = null;
  selectedCollection = null;
  selectedQuality = null;
  collectionList = [];
  qualityList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  isFormSubmitted: boolean = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    this.newRecord();
  }

  newRecord() {
    this.params = null;
    this.designObj = {
      categoryId: null,
      collectionId: null,
      qualityId: null,
      designCode: '',
      designName: '',
      description: '',
    };
    this.selectedCategory = null;
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.selectedCollection = null;
    this.selectedQuality = null;
    this.disabled = false;
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.disabled = false;
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.disabled = false;
    this.newRecord();
  }
  getDesignsList() {
    Helpers.setLoading(true);
    this.designService.getAllDesigns(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.designList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getCategoryLookUp() {
    Helpers.setLoading(true);
    this.designService.getCategoryLookUp().subscribe(
      results => {
        this.categoryList = results;
        this.categoryList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onCategoryClick() {
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.selectedCollection = null;
    this.selectedQuality = null;
    if (this.selectedCategory != null) {
      Helpers.setLoading(true);
      this.designService.getCollectionLookUp(this.selectedCategory).subscribe(
        results => {
          this.collectionList = results;
          this.collectionList.unshift({ label: '--Select--', value: null });
          this.selectedCollection = this.designObj.collectionId;
          if (this.selectedCollection > 0) {
            this.onCollectionClick();
          }
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCollectionClick() {

    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.selectedQuality = null;
    if (this.selectedCollection != null) {
      Helpers.setLoading(true);
      this.designService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.qualityList = results;
          this.qualityList.unshift({ label: '--Select--', value: null });
          this.selectedQuality = this.designObj.qualityId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  loadLazy(event: LazyLoadEvent) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    //imitate db connection over a network
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getDesignsList();
    this.getCategoryLookUp();
  }

  getdesignById(id) {
    Helpers.setLoading(true);
    this.designService.getDesignById(id).subscribe(
      results => {
        this.designObj = results;
        this.selectedCategory = this.designObj.categoryId;
        if (this.selectedCategory > 0) {
          this.onCategoryClick();
        }
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    this.isFormSubmitted = true;
    if (!valid)
      return;
    if (this.designObj.id > 0) {

    }
    else {
      this.designObj.categoryId = value.selectedCategory;
      this.designObj.collectionId = value.selectedCollection;
      this.designObj.qualityId = value.selectedQuality;
    }
    this.saveDesign(this.designObj);
  }

  saveDesign(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.designService.updateDesign(value)
        .subscribe(
        results => {
          this.getDesignsList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.isFormSubmitted = false;
          this.newRecord();
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.designService.createDesign(value)
        .subscribe(
        results => {
          this.getDesignsList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.isFormSubmitted = false;
          this.newRecord();
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(design: Design) {
    this.designService.perPage = this.pageSize;
    this.designService.currentPos = this.page;
    this.getdesignById(design.id);
    this.params = design.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(design: Design) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.designService.deleteDesign(design.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getDesignsList();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }
}
