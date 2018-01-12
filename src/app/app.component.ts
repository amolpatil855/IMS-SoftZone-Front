import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from "./helpers";
import { Message } from 'primeng/primeng';
import { MessageService } from './_services/message.service';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../node_modules/primeng/resources/primeng.css',
    '../../node_modules/primeng/resources/themes/bootstrap/theme.css',
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';
  msgs: Message[] = [];

  constructor(private _router: Router, private messageService: MessageService) {
  }

  ngOnInit() {
    this.messageService.getMessages()
      .subscribe((value: Object) => {
        this.msgs = [];
        this.msgs.push(value);
      });
    this._router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        Helpers.setLoading(true);
        Helpers.bodyClass(this.globalBodyClass);
      }
      if (route instanceof NavigationEnd) {
        Helpers.setLoading(false);
      }
    });
  }
}
