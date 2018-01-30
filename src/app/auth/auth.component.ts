import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { GlobalErrorHandler } from '../_services/error-handler.service';
import { AuthenticationService } from "./_services/authentication.service";
import { AlertService } from "./_services/alert.service";
import { UserService } from "./_services/user.service";
import { StoreService } from "../_services/store.service";
import { AlertComponent } from "./_directives/alert.component";
import { LoginCustom } from "./_helpers/login-custom";
import { Helpers } from "../helpers";
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
// import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  templateUrl: './templates/login-1.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef;
  @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef;
  @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

  constructor(private _router: Router,
    private _script: ScriptLoaderService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _globalErrorHandler: GlobalErrorHandler,
    private storeService: StoreService,
    private _cookieService: CookieService,
    private cfr: ComponentFactoryResolver) {
    if (_cookieService.get('remember')) {
      this.model.username = this._cookieService.get('username');
      this.model.password = this._cookieService.get('password');
      this.model.remember = this._cookieService.get('remember');
    }
  }

  ngOnInit() {
    this.model.remember = true;
    Helpers.setLoading(false);
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this._router.navigate([this.returnUrl]);

    this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js')
      .then(() => {
        Helpers.setLoading(false);
        LoginCustom.init();
      });
  }

  signin() {
    this.loading = true;
    this._authService.login(this.model.username, this.model.password)
      .subscribe(
      data => {
        if (this.model.remember) {
          this._cookieService.set('username', this.model.username);
          this._cookieService.set('password', this.model.password);
          this._cookieService.set('remember', this.model.remember);
        }
        else {
          this._cookieService.deleteAll();
        }

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.storeService.getPermission();
        if (currentUser) {
          this._router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.showAlert('alertSignin');
        this._alertService.error(JSON.parse(error._body).error_description);
        this.loading = false;
      });
  }

  signup() {
    this.loading = true;
    this._userService.create(this.model)
      .subscribe(
      data => {
        this.showAlert('alertSignin');
        this._alertService.success('Thank you. To complete your registration please check your email.', true);
        this.loading = false;
        LoginCustom.displaySignInForm();
        this.model = {};
      },
      error => {
        this.showAlert('alertSignup');
        this._alertService.error(error);
        this.loading = false;
      });
  }

  forgotPass() {
    this.loading = true;
    let email = {
      email: this.model.email
    };
    this._userService.forgotPassword(this.model.email)
      .subscribe(
      data => {
        this.showAlert('alertSignin');
        this._alertService.success('Cool! Password recovery instruction has been sent to your email.', true);
        this.loading = false;
        LoginCustom.displaySignInForm();
        this.model = {};
      },
      error => {
        this.showAlert('alertForgotPass');
        this._alertService.error(JSON.parse(error._body).message);
        this.loading = false;
      });
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
