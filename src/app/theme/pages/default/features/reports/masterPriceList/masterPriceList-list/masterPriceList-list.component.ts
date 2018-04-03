import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { MasterPriceListService } from '../../../../_services/masterPriceList.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { FormatService } from "../../../../_services/tableToXls/format.service";
import { DataGridUtil } from "../../../../_services/tableToXls/datagrid.util";
@Component({
  selector: "app-masterPriceList-list",
  templateUrl: "./masterPriceList-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class MasterPriceListListComponent implements OnInit {
  params: number;
  masterPriceListList = [];
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
    private masterPriceListService: MasterPriceListService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getCategoryLookUp();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getCategoryLookUp() {
    Helpers.setLoading(true);
    this.masterPriceListService.getCategoryLookUp().subscribe(
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
    this.masterPriceListService.getAccessoryProducts(this.pageSize, this.page).subscribe(
      results => {
        this.masterPriceListList = results.data;
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

  getAccessoryProductsExport(columns) {
    Helpers.setLoading(true);
    this.masterPriceListService.getAccessoryProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns)
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
    this.masterPriceListService.getFabricProducts(this.pageSize, this.page).subscribe(
      results => {
        this.masterPriceListList = results.data;
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

  getFabricProductsExport(columns) {
    Helpers.setLoading(true);
    this.masterPriceListService.getFabricProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns)
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
    this.masterPriceListService.getFoamProducts(this.pageSize, this.page).subscribe(
      results => {
        this.masterPriceListList = results.data;
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

  getFoamProductsExport(columns) {
    Helpers.setLoading(true);
    this.masterPriceListService.getFoamProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns)
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getMattressProducts() {
    Helpers.setLoading(true);
    this.masterPriceListService.getMattressProducts(this.pageSize, this.page).subscribe(
      results => {
        this.masterPriceListList = results.data;
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

  getMattressProductsExport(columns) {
    Helpers.setLoading(true);
    this.masterPriceListService.getMattressProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns)
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getRugProducts() {
    Helpers.setLoading(true);
    this.masterPriceListService.getRugProducts(this.pageSize, this.page).subscribe(
      results => {
        this.masterPriceListList = results.data;
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

  getRugProductsExport(columns) {
    Helpers.setLoading(true);
    this.masterPriceListService.getRugProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns)
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getWallpaperProducts() {
    Helpers.setLoading(true);
    this.masterPriceListService.getWallpaperProducts(this.pageSize, this.page).subscribe(
      results => {
        this.masterPriceListList = results.data;
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

  getWallpaperProductsExport(columns) {
    Helpers.setLoading(true);
    this.masterPriceListService.getWallpaperProductsForExport().subscribe(
      results => {
        this.totalCount = results.length;
        if (this.totalCount > 0) {
          this.exporttoCSV(results, columns)
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
          display: 'Cut Rate',
          variable: 'cutRate',
          filter: 'text'
        }
        ,
        {
          display: 'Cut Rate(GST)',
          variable: 'cutRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Role Rate',
          variable: 'roleRate',
          filter: 'text'
        }
        ,
        {
          display: 'Roll Rate (GST)',
          variable: 'rollRateWithGst',
          filter: 'text'
        },
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
          display: 'Purchase Flat Rate',
          variable: 'purchaseFlatRate',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Flat Rate (GST)',
          variable: 'purchaseFlatRateWithGst',
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
      this.getFabricProductsExport(columns);
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
        },
        {
          display: 'Purchase Rate Per KG',
          variable: 'purchaseRatePerKG',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Rate Per(GST)',
          variable: 'purchaseRatePerKGWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Rate Per MM',
          variable: 'purchaseRatePerMM',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Rate Per MM(GST)',
          variable: 'purchaseRatePerMMWithGst',
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
          display: 'Selling Rate Per(GST)',
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
          display: 'selling Rate Per MM(GST)',
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
      this.getFoamProductsExport(columns);
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
          display: 'Purchase Rate',
          variable: 'purchaseRate',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Rate(GST)',
          variable: 'purchaseRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate',
          variable: 'sellingRate',
          filter: 'text'
        }
        ,
        {
          display: 'Selling Rate(GST)',
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
      this.getAccessoryProductsExport(columns);
    }
    else if (this.categoryId == 4) {
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
          display: 'Quality Code',
          variable: 'qualityCode',
          filter: 'text'
        },
        {
          display: 'Thickness Code',
          variable: 'thicknessCode',
          filter: 'text'
        }
        ,
        {
          display: 'Size Code',
          variable: 'sizeCode',
          filter: 'text'
        }
        ,
        {
          display: 'Rate',
          variable: 'rate',
          filter: 'text'
        }
        ,
        {
          display: 'Rate (GST)',
          variable: 'rateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Rate',
          variable: 'purchaseRate',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Rate(GST)',
          variable: 'purchaseRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Custom Rate Per Sq. Feet',
          variable: 'customRatePerSqFeet',
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
      this.getMattressProductsExport(columns);
    }
    else if (this.categoryId == 5) {
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
          display: 'Cut Rate',
          variable: 'cutRate',
          filter: 'text'
        }
        ,
        {
          display: 'Cut Rate(GST)',
          variable: 'cutRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Role Rate',
          variable: 'roleRate',
          filter: 'text'
        }
        ,
        {
          display: 'Roll Rate (GST)',
          variable: 'rollRateWithGst',
          filter: 'text'
        },
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
          display: 'Purchase Flat Rate',
          variable: 'purchaseFlatRate',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Flat Rate (GST)',
          variable: 'purchaseFlatRateWithGst',
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
      this.getWallpaperProductsExport(columns);
    }
    else if (this.categoryId == 6) {
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
          display: 'Cut Rate',
          variable: 'cutRate',
          filter: 'text'
        }
        ,
        {
          display: 'Cut Rate(GST)',
          variable: 'cutRateWithGst',
          filter: 'text'
        }
        ,
        {
          display: 'Role Rate',
          variable: 'roleRate',
          filter: 'text'
        }
        ,
        {
          display: 'Roll Rate (GST)',
          variable: 'rollRateWithGst',
          filter: 'text'
        },
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
          display: 'Purchase Flat Rate',
          variable: 'purchaseFlatRate',
          filter: 'text'
        }
        ,
        {
          display: 'Purchase Flat Rate (GST)',
          variable: 'purchaseFlatRateWithGst',
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
      this.getRugProductsExport(columns);
    }
  }

  exporttoCSV(data, columns) {
    let exprtcsv: any[] = [];
    let _tempList = data;
    let exportFileName: string = "StudentCategoryReport_";
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
    else if (this.categoryId == 4) {
      this.tableEmptyMesssage = 'Loading...';
      this.getMattressProducts();
    }
    else if (this.categoryId == 5) {
      this.tableEmptyMesssage = 'Loading...';
      this.getWallpaperProducts();
    }
    else if (this.categoryId == 6) {
      this.tableEmptyMesssage = 'Loading...';
      this.getRugProducts();
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
    else if (this.categoryId == 4) {
      this.tableEmptyMesssage = 'Loading...';
      this.getMattressProducts();
    }
    else if (this.categoryId == 5) {
      this.tableEmptyMesssage = 'Loading...';
      this.getWallpaperProducts();
    }
    else if (this.categoryId == 6) {
      this.tableEmptyMesssage = 'Loading...';
      this.getRugProducts();
    }
  }

}

