import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AppSettings } from '../../../../../../../app-settings';
import { CompanyService } from '../../../../_services/company.service';
import { Company } from "../../../../_models/company";
import { Helpers } from "../../../../../../../helpers";

@Component({
  selector: "app-company-add-edit",
  templateUrl: "./company-add-edit.component.html",
})
export class CompanyAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  companyForm: FormGroup;
  imageFileName:string;
  fileInput:string;
  myInputVariable: any;
  logoURLtoshow:string;
 constructor(
    private formBuilder: FormBuilder,
    private globalErrorHandler: GlobalErrorHandler,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) {
  }

  ngOnInit() {

    this.route.params.forEach((params: Params) => {
      this.params = params['userId'];
    });
    
    this.companyForm = this.formBuilder.group({
        id: 0,
        companyName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        gstin: ['', [Validators.required]],
        companyLogo: [''],
    });

this.getCompanyInfo();
  }

  getCompanyInfo(){
    this.companyService.getAllCompanyInfo().subscribe(
      (results: any) => {
         Helpers.setLoading(false);
            if(results !== null){
            this.companyForm.setValue({
              id: results.id,
              companyName: results.companyName,
              email: results.email,
              phone: results.phone,
              gstin: results.gstin,
              companyLogo: results.companyLogo,
            });
            this.logoURLtoshow=AppSettings.IMAGE_API_ENDPOINT+results.companyLogo;
          }
    });
  }
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (!this.fileInput ||  this.fileInput.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please select company logo" });
      return;
    }
      this.saveUser(value);
  }
  onUploadLogo(fileInput: any) {
    var rec = this;
    var fr = new FileReader;

    fr.readAsDataURL(fileInput[0]);
    this.fileInput = fileInput;
    let ext = fileInput[0].name.split('.')[1];
    if (ext != 'jpeg' && ext != 'jpg' && ext != 'png') {
        this.messageService.addMessage({ severity: 'fail', summary: 'Fail', detail: 'Wrong extention' });
        this.myInputVariable.nativeElement.value = "";
        return;
    }
    rec.imageFileName = fileInput[0].name;
    var img = new Image;
    var success = 0;
    fr.onload = function () {
        success = 1;
        img.onload = function () {
            if (img.height <= 50 && img.width <= 160) {
                //
                success = 1;

            }
            else {
                rec.imageFileName = null;
                success = 0;
                rec.fileInput = null;
                rec.messageService.addMessage({ severity: 'fail', summary: 'Fail', detail: 'Image Resolution not should be greater than 160 * 50 px ' });
                rec.myInputVariable.nativeElement.value = "";
            }

        };
        img.src = fr.result;
    };
}
  saveUser(value) {
    Helpers.setLoading(true);
    let fd = new FormData();
    fd.append('UploadFile', this.fileInput[0] ? this.fileInput[0] : null);
    fd.append('mstCompanyInfo',JSON.stringify(value));
    if (value.id > 0) {
      this.companyService.updateCompanyInfo(fd)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          
          this.getCompanyInfo();
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.companyService.createCompanyInfo(value,fd)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
        
          this.getCompanyInfo();
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }
  onCancel() {
    this.router.navigate(['/features/master/company/add']);
  }
}
