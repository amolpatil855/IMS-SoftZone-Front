import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable } from "rxjs/Rx";
import * as _ from "lodash/index";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  FormControl
} from "@angular/forms";
import {
  ConfirmationService,
  DataTableModule,
  LazyLoadEvent,
  SelectItem,
  TRISTATECHECKBOX_VALUE_ACCESSOR
} from "primeng/primeng";
import { UploadService } from "../../_services/upload.service";
import { MessageService } from "../../../../../_services/message.service";
import { GlobalErrorHandler } from "../../../../../_services/error-handler.service";
import { Helpers } from "../../../../../helpers";
import { Upload } from "../../_models/upload";
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./upload.component.html",
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {
  uploadObj: Upload;
  selectedProductMaster: string;
  tableNameList = [];
  @ViewChild('selectedProduct')
  selectedProduct: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandler,
    private fileUploadService: UploadService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.uploadObj = new Upload();
    this.uploadObj.MstFWRShade = null;
    this.tableNameList.push({ label: '--Select--', value: null });
    this.tableNameList.push({ label: 'Accessories', value: 'Accessories' });
    this.tableNameList.push({ label: 'Collections', value: 'Collections' });
    this.tableNameList.push({ label: 'Patterns', value: 'Patterns' });
    this.tableNameList.push({ label: 'Collections', value: 'Collections' });
    this.tableNameList.push({ label: 'Tailors', value: 'Tailors' });
    this.tableNameList.push({ label: 'FoamDensity', value: 'FoamDensity' });
    this.tableNameList.push({ label: 'FoamSize', value: 'FoamSize' });
    this.tableNameList.push({ label: 'FoamSuggestedMM', value: 'FoamSuggestedMM' });
    this.tableNameList.push({ label: 'FoamQuality', value: 'FoamQuality' });
    this.tableNameList.push({ label: 'FWRDesign', value: 'FWRDesign' });
    this.tableNameList.push({ label: 'FWRShade', value: 'FWRShade' });
    this.tableNameList.push({ label: 'FWRQualityCutRoleRate', value: 'FWRQualityCutRoleRate' });
    this.tableNameList.push({ label: 'FWRQualityFlatRate', value: 'FWRQualityFlatRate' });
    this.tableNameList.push({ label: 'MattressSize', value: 'MattressSize' });
    this.tableNameList.push({ label: 'MattressThickness', value: 'MattressThickness' });
    this.tableNameList.push({ label: 'MattressQuality', value: 'MattressQuality' });
  }

  onUploadFile(fileInput: any, e) {
    console.log(fileInput);
    if(this.uploadObj.MstFWRShade != null)
    {
      Helpers.setLoading(true);
      this.fileUploadService.uploadFile(this.uploadObj.MstFWRShade, e.target.files[0])
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.uploadObj.MstFWRShade = null;
          this.selectedProduct.nativeElement.value = "";
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
    
  }

}
