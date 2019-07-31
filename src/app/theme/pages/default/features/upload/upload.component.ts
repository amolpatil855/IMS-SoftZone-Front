import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
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
  @ViewChild('selectedFile')
  selectedFile: ElementRef;
  constructor(
    private globalErrorHandler: GlobalErrorHandler,
    private fileUploadService: UploadService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.uploadObj = new Upload();
    this.uploadObj.MstFWRShade = null;
    this.tableNameList.push({ label: '--Select--', value: null });
    this.tableNameList.push({ label: 'Accessories', value: 'Accessory' });
    this.tableNameList.push({ label: 'Collections', value: 'Collection' });
    this.tableNameList.push({ label: 'Patterns', value: 'Pattern' });
    this.tableNameList.push({ label: 'PatternDetails', value: 'PatternDetails' });
    this.tableNameList.push({ label: 'Tailors', value: 'Tailor' });
    this.tableNameList.push({ label: 'FoamDensity', value: 'MstFomDensity' });
    this.tableNameList.push({ label: 'FoamSize', value: 'MstFomSize' });
    this.tableNameList.push({ label: 'FoamSuggestedMM', value: 'MstFomSuggestedMM' });
    this.tableNameList.push({ label: 'FoamQuality', value: 'FoamQuality' });
    this.tableNameList.push({ label: 'FWRDesign', value: 'MstFWRDesign' });
    this.tableNameList.push({ label: 'FWRShade', value: 'MstFWRShade' });
    this.tableNameList.push({ label: 'FWRQualityCutRoleRate', value: 'FWRQualityCutRoleRate' });
    this.tableNameList.push({ label: 'FWRQualityFlatRate', value: 'FWRQualityFlatRate' });
    this.tableNameList.push({ label: 'MattressSize', value: 'MattressSize' });
    this.tableNameList.push({ label: 'MattressThickness', value: 'MattressThickness' });
    this.tableNameList.push({ label: 'MattressQuality', value: 'MattressQuality' });
  }

  onUploadFile() {
    if (this.uploadObj.MstFWRShade != null && this.selectedFile.nativeElement.files.length > 0) {
      Helpers.setLoading(true);
      this.fileUploadService.uploadFile(this.uploadObj.MstFWRShade, this.selectedFile.nativeElement.files[0])
        .subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: results.type, detail: "File Uploaded Successfully" });
            this.uploadObj.MstFWRShade = null;
            this.selectedFile.nativeElement.value = "";
            if (results.message) {
              this.fileUploadService.downloadFile(results.message);
            }
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
    }
  }

}
