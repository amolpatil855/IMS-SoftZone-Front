import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ClientListService } from '../../../../_services/clientList.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { FormatService } from '../../../../_services/tableToXls/format.service';
import { CommonService } from '../../../../_services/common.service';
import { DataGridUtil } from '../../../../_services/tableToXls/datagrid.util';
import { Helpers } from "../../../../../../../helpers";
import { MatSizeService } from "../../../../_services/matSize.service";
import { ShadeService } from "../../../../_services/shade.service";
import { FomSizeService } from "../../../../_services/fomSize.service";
@Component({
  selector: "app-clientList-list",
  templateUrl: "./clientList-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ClientListListComponent implements OnInit {
  params: number;
  clientList = [];
  categoriesCodeList = [];
  collectionList = [];
  qualityList = [];
  thicknessList = [];
  matSizeList = [];
  designList = [];
  shadeList = [];
  fomDensityList = [];
  fomSuggestedMMList = [];
  fomSizeList = [];
  categoryId = 1;
  categoryIdError = false;
  selectedCollection = null
  selectedThickness = null;
  selectedQuality = null;
  selectedDesign = null;
  selectedDensity = null;
  selectedSize = null;
  matSizeId = null;
  shadeId = null;
  fomSizeId = null;
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
    private clientListService: ClientListService,
    private matSizeService: MatSizeService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
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
    this.clientListService.getCategoryLookUp().subscribe(
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
    this.clientListService.getAccessoryProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.clientList = results.data;
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
    this.clientListService.getAccessoryProductsForExport().subscribe(
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
    this.clientListService.getFabricProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedDesign, this.shadeId).subscribe(
      results => {
        this.clientList = results.data;
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
    this.clientListService.getFabricProductsForExport().subscribe(
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
    this.clientListService.getFoamProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedDensity, this.selectedSize, this.fomSizeId).subscribe(
      results => {
        this.clientList = results.data;
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
    this.clientListService.getFoamProductsForExport().subscribe(
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
  getMattressProducts() {
    Helpers.setLoading(true);
    this.clientListService.getMattressProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedThickness, this.matSizeId).subscribe(
      results => {
        this.clientList = results.data;
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

  getMattressProductsExport(columns, categoryName) {
    Helpers.setLoading(true);
    this.clientListService.getMattressProductsForExport().subscribe(
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
  getRugProducts() {
    Helpers.setLoading(true);
    this.clientListService.getRugProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedDesign, this.shadeId).subscribe(
      results => {
        this.clientList = results.data;
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

  getRugProductsExport(columns, categoryName) {
    Helpers.setLoading(true);
    this.clientListService.getRugProductsForExport().subscribe(
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

  getWallpaperProducts() {
    Helpers.setLoading(true);
    this.clientListService.getWallpaperProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedDesign, this.shadeId).subscribe(
      results => {
        this.clientList = results.data;
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

  getWallpaperProductsExport(columns, categoryName) {
    Helpers.setLoading(true);
    this.clientListService.getWallpaperProductsForExport().subscribe(
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
          display: 'RRP',
          variable: 'rrp',
          filter: 'text'
        }
        ,
        {
          display: 'RRP (GST)',
          variable: 'rrpWithGst',
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
          display: 'HSN (GST%)',
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
      if (categoryObj)
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
          display: 'Selling Rate Per KG(GST)',
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
          display: 'HSN (GST%)',
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
      if (categoryObj)
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
          display: 'HSN (GST%)',
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
      if (categoryObj)
        this.getAccessoryProductsExport(columns, categoryObj.label);
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
          display: 'Custom Rate Per Sq. Feet',
          variable: 'customRatePerSqFeet',
          filter: 'text'
        }
        ,
        {
          display: 'HSN (GST%)',
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
      if (categoryObj)
        this.getMattressProductsExport(columns, categoryObj.label);
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
          display: 'RRP',
          variable: 'rrp',
          filter: 'text'
        }
        ,
        {
          display: 'RRP (GST)',
          variable: 'rrpWithGst',
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
          display: 'HSN (GST%)',
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
      if (categoryObj)
        this.getWallpaperProductsExport(columns, categoryObj.label);
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
          display: 'RRP',
          variable: 'rrp',
          filter: 'text'
        }
        ,
        {
          display: 'RRP (GST)',
          variable: 'rrpWithGst',
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
          display: 'HSN (GST%)',
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
      if (categoryObj)
        this.getRugProductsExport(columns, categoryObj.label);
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
    this.search = event.globalFilter;
    if (this.search == null)
      this.search = '';
    if (this.categoryId == 1) {
      this.getFWRCollectionLookup();
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.getFomCollectionLookUp();
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
    }
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
    else if (this.categoryId == 4) {
      this.getMatCollectionLookUp();
      this.tableEmptyMesssage = 'Loading...';
      this.getMattressProducts();
    }
    else if (this.categoryId == 5) {
      this.getFWRCollectionLookup();
      this.tableEmptyMesssage = 'Loading...';
      this.getWallpaperProducts();
    }
    else if (this.categoryId == 6) {
      this.getFWRCollectionLookup();
      this.tableEmptyMesssage = 'Loading...';
      this.getRugProducts();
    }
  }

  onChangeCategory() {
    this.page = 0;
    this.search = '';
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.designList = [];
    this.designList.unshift({ label: '--Select--', value: null });
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.fomDensityList = [];
    this.fomDensityList.unshift({ label: '--Select--', value: null });
    this.selectedDensity = null;
    this.fomSuggestedMMList = [];
    this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
    this.selectedSize = null;
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeId = null;
    this.shadeId = null;
    this.selectedDesign = null;
    this.selectedCollection = null;
    this.matSizeId = null;
    this.selectedQuality = null;
    this.selectedThickness = null;
    if (this.categoryId == 1) {
      this.getFWRCollectionLookup();
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.getFomCollectionLookUp();
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
    }
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
    else if (this.categoryId == 4) {
      this.getMatCollectionLookUp();
      this.tableEmptyMesssage = 'Loading...';
      this.getMattressProducts();
    }
    else if (this.categoryId == 5) {
      this.getFWRCollectionLookup();
      this.tableEmptyMesssage = 'Loading...';
      this.getWallpaperProducts();
    }
    else if (this.categoryId == 6) {
      this.getFWRCollectionLookup();
      this.tableEmptyMesssage = 'Loading...';
      this.getRugProducts();
    }
  }

  getCategoryWiseProducts() {
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

  getFWRCollectionLookup() {
    this.shadeService.getCollectionLookUp(this.categoryId).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
        if (this.selectedCollection > 0) {
          this.onCollectionClick();
        }
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFomCollectionLookUp() {
    this.fomSizeService.getFomCollectionLookUp().subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getMatCollectionLookUp() {
    Helpers.setLoading(true);
    this.matSizeService.getMatCollectionLookUp().subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onCollectionClick() {
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.designList = [];
    this.designList.unshift({ label: '--Select--', value: null });
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.fomDensityList = [];
    this.fomDensityList.unshift({ label: '--Select--', value: null });
    this.selectedDensity = null;
    this.fomSuggestedMMList = [];
    this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
    this.selectedSize = null;
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeId = null;
    this.shadeId = null;
    this.selectedDesign = null;
    this.matSizeId = null;
    this.selectedQuality = null;
    this.selectedThickness = null;

    this.getCategoryWiseProducts();
    if (this.selectedCollection != null) {
      Helpers.setLoading(true);
      this.matSizeService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.qualityList = results;
          this.qualityList.unshift({ label: '--Select--', value: null });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onQualityClick() {
    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.selectedThickness = null;
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.matSizeId = null;
    this.designList = [];
    this.designList.unshift({ label: '--Select--', value: null });
    this.selectedDesign = null;
    this.fomDensityList = [];
    this.fomDensityList.unshift({ label: '--Select--', value: null });
    this.selectedDensity = null;
    this.fomSuggestedMMList = [];
    this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
    this.selectedSize = null;
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeId = null;
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.shadeId = null;
    this.getCategoryWiseProducts();
    if (this.selectedQuality != null) {
      if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
        this.shadeService.getDesignLookupByQuality(this.selectedQuality).subscribe(
          results => {
            this.designList = results;
            this.designList.unshift({ label: '--Select--', value: null });
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
      else if (this.categoryId == 4) {
        Helpers.setLoading(true);
        this.matSizeService.getMatThicknessLookUp().subscribe(
          results => {
            this.thicknessList = results;
            this.thicknessList.unshift({ label: '--Select--', value: null });
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
      else if (this.categoryId == 2) {
        this.fomSizeService.getFomDensityLookUpByQuality(this.selectedQuality).subscribe(
          results => {
            this.fomDensityList = results;
            this.fomDensityList.unshift({ label: '--Select--', value: null });
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
  }

  onThicknessChange() {
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.matSizeId = null;

    this.getCategoryWiseProducts();
    if (this.selectedThickness != null) {
      Helpers.setLoading(true);
      this.matSizeService.getMatSizeLookUpByMatThicknessId(this.selectedThickness).subscribe(
        results => {
          this.matSizeList = results;
          this.matSizeList.unshift({ label: '--Select--', value: null });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onMatSizeChange() {
    this.getCategoryWiseProducts();
  }

  onDesignClick() {
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.shadeId = null;
    this.getCategoryWiseProducts();
    if (this.selectedDesign != null) {
      Helpers.setLoading(true);
      this.shadeService.getSerialNumberLookUpByDesign(this.selectedDesign).subscribe(
        results => {
          this.shadeList = results;
          this.shadeList.unshift({ label: '--Select--', value: null });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onDensityClick() {

    this.fomSuggestedMMList = [];
    this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
    this.selectedSize = null;
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeId = null;
    this.getCategoryWiseProducts();
    if (this.selectedDensity != null) {
      this.fomSizeService.getFomSuggestedMMLookUpByFomDensity(this.selectedDensity).subscribe(
        results => {
          this.fomSuggestedMMList = results;
          this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onSuggestedMMChange() {
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeId = null;
    this.getCategoryWiseProducts();
    if (this.selectedSize != null) {
      this.fomSizeService.getFomSizeLookUpByFomSuggestedMMId(this.selectedSize).subscribe(
        results => {
          this.fomSizeList = results;
          this.fomSizeList.unshift({ label: '--Select--', value: null });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onShadeIdChange() {
    this.getCategoryWiseProducts();
  }

  onFoamItemChange() {
    this.getCategoryWiseProducts();
  }

}
