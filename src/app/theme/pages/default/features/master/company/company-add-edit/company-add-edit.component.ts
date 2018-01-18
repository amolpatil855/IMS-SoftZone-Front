import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';

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
  userForm: FormGroup;

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
    
    this.userForm = this.formBuilder.group({
        id: 0,
        companyName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        gstin: ['', [Validators.required]],
       // companyLogo: ['', [Validators.required]],
    });

    this.companyService.getAllCompanyInfo().subscribe(
      (results: any) => {
         Helpers.setLoading(false);
            if(results !== null){
              console.log('results', results);
            this.userForm.setValue({
              id: results.id,
              companyName: results.companyName,
              email: results.email,
              phone: results.phone,
              gstin: results.gstin,
              companyLogo: "http://localhost:4200/assets/img/demo.png",
            });
          }
    });
  }
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
      this.saveUser(value);
  }

  saveUser(value) {
    Helpers.setLoading(true);
    if (value.id > 0) {
      this.companyService.updateCompanyInfo(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/master/company/add']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.companyService.createCompanyInfo(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/master/company/add']);
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
