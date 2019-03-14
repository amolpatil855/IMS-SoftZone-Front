import { Component, OnInit, ViewEncapsulation } from "@angular/core";
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
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./upload.component.html",
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {
  selectProduct: any = "";
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,

  ) { }

  ngOnInit() {

  }

  onUploadFile() {

  }

}
