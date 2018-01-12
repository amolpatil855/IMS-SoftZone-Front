import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalErrorHandler } from '../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../_services/message.service';
import { UserService } from '../../_services/user.service';


@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  templateUrl: "./changePassword.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loading: boolean = false;
  isConfirmPasswordSame: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private globalErrorHandler: GlobalErrorHandler,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isConfirmPasswordSame = true;
    if (value.confirmPassword === value.newPassword) {
      this.loading = true;
      this.isConfirmPasswordSame = true;
      let params = {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      }
      this.userService.changePassword(params)
        .subscribe(
        results => {
          this.loading = false;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Password Updated Successfully' });
          this.router.navigate(['/']);
        },
        error => {
          this.changePasswordForm.reset();
          this.loading = false;
          this.isConfirmPasswordSame = true;
          this.globalErrorHandler.handleError(error);
        });
    } else {
      this.isConfirmPasswordSame = false;
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
