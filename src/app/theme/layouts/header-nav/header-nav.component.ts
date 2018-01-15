import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { ImageUploadService } from '../../pages/default/_services/imageUpload.service';
import { Router } from "@angular/router";
declare let mLayout: any;
@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

  webHeader: string;
  logoUrl: string;
  defaultLogo: string;
  userRole: string;
  loggedInUser: any;
  IMSLogoShow: boolean;
  constructor(private _router: Router, private imageUploadService: ImageUploadService) {
  }
  ngOnInit() {
 
    this.userRole = '';
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInUser = {user: {username:'Test Name',role:{displayName:'Test Role'}}};
    this.defaultLogo = "./assets/img/demo.png";
    this.logoUrl = this.imageUploadService.getImageUrl("default");
    if (localStorage.getItem("IMSLogo") != null) {
      let logo = localStorage.getItem("IMSLogo");
      if (logo != "" && logo != null && logo != "null") {
        this.logoUrl = this.imageUploadService.getImageUrl("");
      } else {
        this.logoUrl = this.imageUploadService.getImageUrl("default");
      }
    }


      this.webHeader = "IMS";


  }
  ngAfterViewInit() {
    mLayout.initHeader();
  }
}
