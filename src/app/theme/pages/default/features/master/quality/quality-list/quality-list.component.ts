import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { CollectionService } from '../../../../_services/collection.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Quality } from "../../../../_models/quality";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { QualityService } from '../../../../_services/quality.service';
import { HsnService } from '../../../../_services/hsn.service';
@Component({
  selector: "app-quality-list",
  templateUrl: "./quality-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class QualityListComponent implements OnInit {
  qualityForm: any;
  qualityObj: any;
  params: number;
  collectionList = [];
  categoriesCodeList = [];
  hsnCodeList = [];
  recordList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  states = [];
  isFormSubmitted: boolean = false;
  slectedCategory = null;
  tableEmptyMesssage = 'Loading...';
  disableFlatRate = false;
  disableRRP = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private qualityService: QualityService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private hsnService: HsnService,
    private collectionService: CollectionService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.params = null;
    this.getQualityList();
    this.newRecord();
    this.getHsnCodeList();
    this.getCategoryCodeList();
  }

  newRecord() {
    this.params = null;
    this.qualityForm = this.formBuilder.group({
      id: 0,
      qualityCode: ['', [Validators.required]],
      qualityName: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      collectionId: ['', [Validators.required]],
      description: [''],
      hsnId: ['', [Validators.required]],
      width: ['', [Validators.required]],
      size: ['', [Validators.required]],
      cutRate: [{ value: '', disabled: this.disableRRP }, [Validators.required]],
      roleRate: [{ value: '', disabled: this.disableRRP }, [Validators.required]],
      rrp: [{ value: '', disabled: this.disableRRP }, [Validators.required]],
      maxCutRateDisc: [{ value: '', disabled: this.disableRRP }, [Validators.required]],
      maxRoleRateDisc: [{ value: '', disabled: this.disableRRP }, [Validators.required]],
      flatRate: [{ value: '', disabled: this.disableFlatRate }, [Validators.required]],
      maxFlatRateDisc: [{ value: '', disabled: this.disableFlatRate }, [Validators.required]],
      custRatePerSqFeet: ['', [Validators.required]],
      maxDiscout: ['', [Validators.required]],
    });
    this.qualityForm.get('cutRate').enable();
    this.qualityForm.get('roleRate').enable();
    this.qualityForm.get('rrp').enable();
    this.qualityForm.get('maxCutRateDisc').enable();
    this.qualityForm.get('maxRoleRateDisc').enable();
    this.qualityForm.get('maxFlatRateDisc').enable();
    this.qualityForm.get('flatRate').enable();
    this.slectedCategory = null;
  }


  onChangeRRP(cutrate, flaterate) {
    if (cutrate.value) {
      this.disableFlatRate = true;
      flaterate.disable();
      this.qualityForm.get('maxFlatRateDisc').disable();
      this.disableRRP = false;
      this.qualityForm.patchValue({
        maxFlatRateDisc: '',
        flatRate: '',
      });
    }
    else {
      this.disableFlatRate = false;
      this.disableRRP = false;
      flaterate.enable();
      this.qualityForm.get('maxFlatRateDisc').enable();
    }
  }

  onChangeFlatRate(flaterate) {
    if (flaterate.value) {
      this.disableFlatRate = false;
      this.disableRRP = true;
      this.qualityForm.get('cutRate').disable();
      this.qualityForm.get('roleRate').disable();
      this.qualityForm.get('rrp').disable();
      this.qualityForm.get('maxCutRateDisc').disable();
      this.qualityForm.get('maxRoleRateDisc').disable();
      this.qualityForm.patchValue({
        roleRate: '',
        cutRate: '',
        rrp: '',
        maxCutRateDisc: '',
        maxRoleRateDisc: '',
      });
    }
    else {
      this.disableFlatRate = false;
      this.disableRRP = false;
      this.qualityForm.get('cutRate').enable();
      this.qualityForm.get('roleRate').enable();
      this.qualityForm.get('rrp').enable();
      this.qualityForm.get('maxCutRateDisc').enable();
      this.qualityForm.get('maxRoleRateDisc').enable();
    }
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

  getHsnCodeList() {
    this.hsnService.getHsnLookUp().subscribe(
      results => {
        this.hsnCodeList = results;
        this.hsnCodeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCategoryCodeList() {
    this.commonService.getCategoryCodes().subscribe(
      results => {
        this.categoriesCodeList = results;
        this.categoriesCodeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getQualityList() {
    this.qualityService.getAllQualitys().subscribe(
      results => {
        this.recordList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }


  getCollectionList(id) {
    this.collectionService.getCollectionLookUp(id).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first;
    this.search = event.globalFilter;
    this.getQualityList();
  }


  getQualityById(id) {
    this.qualityService.getQualityById(id).subscribe(
      results => {
        this.qualityObj = results;
        this.qualityForm.setValue({
          id: results.id,
          qualityCode: results.qualityCode,
          qualityName: results.qualityName,
          categoryId: results.categoryId,
          collectionId: results.collectionId,
          description: results.description,
          hsnId: results.hsnId,
          width: results.width,
          size: results.size,
          cutRate: results.cutRate,
          roleRate: results.roleRate,
          rrp: results.rrp,
          maxCutRateDisc: results.maxCutRateDisc,
          maxRoleRateDisc: results.maxRoleRateDisc,
          maxFlatRateDisc: results.maxFlatRateDisc,
          flatRate: results.flatRate,
          custRatePerSqFeet: results.custRatePerSqFeet,
          maxDiscout: results.maxDiscout,
        });
        this.slectedCategory = results.categoryId;
        console.log('this.collectionList', this.qualityObj);

        if (results.flatRate) {
          this.qualityForm.get('cutRate').disable();
          this.qualityForm.get('roleRate').disable();
          this.qualityForm.get('rrp').disable();
          this.qualityForm.get('maxCutRateDisc').disable();
          this.qualityForm.get('maxRoleRateDisc').disable();
          this.qualityForm.get('maxFlatRateDisc').enable();
          this.qualityForm.get('flatRate').enable();
        }
        else if (results.cutRate) {
          this.qualityForm.get('cutRate').enable();
          this.qualityForm.get('roleRate').enable();
          this.qualityForm.get('rrp').enable();
          this.qualityForm.get('maxCutRateDisc').enable();
          this.qualityForm.get('maxRoleRateDisc').enable();
          this.qualityForm.get('maxFlatRateDisc').disable();
          this.qualityForm.get('flatRate').disable();
        }
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (valid)
      this.saveQuality(value);
  }

  onChangeCategory(event) {
    if (this.slectedCategory) {
      this.getCollectionList(this.slectedCategory);
    }
    else {
      this.collectionList = [];
      this.collectionList.unshift({ label: '--Select--', value: null });
    }
    if (this.slectedCategory == 1) {
      this.qualityForm.patchValue({
        size: 0,
        custRatePerSqFeet: 0,
        collectionId: null,
        maxDiscout: 0,
        width: '',
        roleRate: '',
        cutRate: '',
        rrp: '',
        maxCutRateDisc: '',
        maxRoleRateDisc: '',
        maxFlatRateDisc: '',
        flatRate: '',
      });
    }
    else if (this.slectedCategory == 5 || this.slectedCategory == 6) {
      this.qualityForm.patchValue({
        width: 0,
        custRatePerSqFeet: 0,
        collectionId: null,
        maxDiscout: 0,
        size: '',
        roleRate: '',
        cutRate: '',
        rrp: '',
        maxCutRateDisc: '',
        maxRoleRateDisc: '',
        maxFlatRateDisc: '',
        flatRate: '',
      });

    }
    else if (this.slectedCategory == 4) {
      this.qualityForm.patchValue({
        width: 0,
        size: 0,
        collectionId: null,
        roleRate: 0,
        cutRate: 0,
        rrp: 0,
        maxCutRateDisc: 0,
        maxRoleRateDisc: 0,
        maxFlatRateDisc: 0,
        flatRate: 0,
        custRatePerSqFeet: '',
        maxDiscout: ''
      });

    }
    else if (this.slectedCategory == 2) {
      this.qualityForm.patchValue({
        width: 0,
        size: 0,
        roleRate: 0,
        collectionId: null,
        rrp: 0,
        cutRate: 0,
        maxCutRateDisc: 0,
        maxRoleRateDisc: 0,
        maxFlatRateDisc: 0,
        flatRate: 0,
        custRatePerSqFeet: 0,
        maxDiscout: ''
      });
    }

  }

  saveQuality(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.qualityService.updateQuality(value)
        .subscribe(
        results => {
          this.getQualityList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.qualityService.createQuality(value)
        .subscribe(
        results => {
          this.getQualityList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(quality: Quality) {
    this.collectionService.perPage = this.pageSize;
    this.collectionService.currentPos = this.page;
    this.params = quality.id;
    this.slectedCategory = null;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
    this.getQualityById(quality.id);

  }

  onDelete(quality: Quality) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.qualityService.deleteQuality(quality.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getQualityList();
            this.toggleDiv = false;
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
