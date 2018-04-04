import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ClientListForCustomerService } from '../../../../_services/clientListForCustomer.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { FormatService } from '../../../../_services/tableToXls/format.service';
import { CommonService } from '../../../../_services/common.service';
import { DataGridUtil } from '../../../../_services/tableToXls/datagrid.util';
import { Helpers } from "../../../../../../../helpers";
@Component({
  selector: "app-clientListForCustomer-list",
  templateUrl: "./clientListForCustomer-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ClientListForCustomerListComponent implements OnInit {
  params: number;
  clientListForCustomer = [];
  categoriesCodeList = [];
  categoryId = 1;
  categoryIdError = false;
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'No Records Found.';
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientListForCustomerService: ClientListForCustomerService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getCategoryCodeList();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getCategoryCodeList() {
    Helpers.setLoading(true);
    this.commonService.getCategoryCodesForSO().subscribe(
      results => {
        this.categoriesCodeList = results;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getAccessoryProducts() {
    Helpers.setLoading(true);
    this.clientListForCustomerService.getAccessoryProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientListForCustomer = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getAccessoryProductsExport(columns, categoryName) {
    Helpers.setLoading(true);
    this.clientListForCustomerService.getAccessoryProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns, categoryName);
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  getFabricProducts() {
    Helpers.setLoading(true);
    this.clientListForCustomerService.getFabricProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientListForCustomer = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFabricProductsExport(columns, categoryName) {
    Helpers.setLoading(true);
    this.clientListForCustomerService.getFabricProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns, categoryName);
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFoamProducts() {
    Helpers.setLoading(true);
    this.clientListForCustomerService.getFoamProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientListForCustomer = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFoamProductsExport(columns, categoryName) {
    Helpers.setLoading(true);
    this.clientListForCustomerService.getFoamProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns, categoryName);
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }
  
  export() {
    let columns: any[];

    if (this.categoryId == 1) {
      columns = [
        {
          display: 'Collection',
          variable: 'collection',
          filter: 'text',
        },
        {
          display: 'UOM',
          variable: 'uom',
          filter: 'text'
        },
        {
          display: 'QDS',
          variable: 'qds',
          filter: 'text'
        },
        {
          display: 'Serial No.',
          variable: 'serialNumber',
          filter: 'text'
        }
        ,
        {
          display: 'Flat Rate',
          variable: 'flatRate',
          filter: 'text'
        }
        ,
        {
          display: 'Flat Rate (GST)',
          variable: 'flatRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'hsn (GST%)',
          variable: 'hsnWithGST',
          filter: 'text'
        },
        {
          display: 'Available Stock',
          variable: 'availableStock',
          filter: 'bool'
        }
      ];
      let categoryObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
      if(categoryObj)
      this.getFabricProductsExport(columns, categoryObj.label);
    }
    else if (this.categoryId == 2) {
      columns = [
        {
          display: 'Collection',
          variable: 'collection',
          filter: 'text',
        },
        {
          display: 'Item Code',
          variable: 'itemCode',
          filter: 'text'
        },
        {
          display: 'UOM',
          variable: 'uom',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate Per KG',
          variable: 'sellingRatePerKG',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate Per (GST)',
          variable: 'sellingRatePerKGWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate Per MM',
          variable: 'sellingRatePerMM',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate Per MM (GST)',
          variable: 'sellingRatePerMMWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'hsn (GST%)',
          variable: 'hsnWithGST',
          filter: 'text'
        },
        {
          display: 'Available Stock',
          variable: 'availableStock',
          filter: 'bool'
        }
      ];
      let categoryObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
      if(categoryObj)
      this.getFoamProductsExport(columns, categoryObj.label);
    }
    else if (this.categoryId == 7) {
      columns = [
        {
          display: 'Name',
          variable: 'name',
          filter: 'text',
        },
        {
          display: 'Item Code',
          variable: 'itemCode',
          filter: 'text'
        },
        {
          display: 'UOM',
          variable: 'uom',
          filter: 'text'
        },
        {
          display: 'Selling Rate',
          variable: 'sellingRate',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate (GST)',
          variable: 'sellingRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'hsn (GST%)',
          variable: 'hsnWithGST',
          filter: 'text'
        },
        {
          display: 'Available Stock',
          variable: 'availableStock',
          filter: 'bool'
        }
      ];
      let categoryObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
      if(categoryObj)
      this.getAccessoryProductsExport(columns, categoryObj.label);
    }
  }

  exporttoCSV(data, columns, categoryName) {
    let exprtcsv: any[] = [];
    let _tempList = data;
    let exportFileName: string = "ClientPriceListReportFor" + categoryName + "_";
    (<any[]>JSON.parse(JSON.stringify(_tempList))).forEach(x => {
      var obj = new Object();
      var frmt = new FormatService();
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].variable.indexOf(".") > -1) {
          let transfrmVal = frmt.transform(x[columns[i].variable.split(".")[0]][columns[i].variable.split(".")[1]], columns[i].filter);
          obj[columns[i].display] = transfrmVal;
        } else {
          let transfrmVal = frmt.transform(x[columns[i].variable], columns[i].filter);
          obj[columns[i].display] = transfrmVal;
        }
      }
      exprtcsv.push(obj);
    }
    );
    DataGridUtil.downloadcsv(exprtcsv, exportFileName);

  }



  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    if (this.categoryId == 1) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
    }
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
  }

  onChangeCategory() {
    this.page = 0;
    if (this.categoryId == 1) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
    }
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
  }

}

