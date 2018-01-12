import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
  selector: "app-aside-nav",
  templateUrl: "./aside-nav.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {
  userRole: string;

  constructor() {

  }
  ngOnInit() {
    this.userRole = '';
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
      this.userRole = currentUser.roles[0].name;
    }
  }
  ngAfterViewInit() {

    mLayout.initAside();
    let menu = (<any>$('#m_aside_left')).mMenu(); let item = $(menu).find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item'); (<any>$(menu).data('menu')).setActiveItem(item);
  }

}
