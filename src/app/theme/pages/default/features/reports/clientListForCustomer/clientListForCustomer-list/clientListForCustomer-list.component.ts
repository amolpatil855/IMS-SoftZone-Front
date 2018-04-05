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
import { MatSizeService } from "../../../../_services/matSize.service";
import { ShadeService } from "../../../../_services/shade.service";
import { FomSizeService } from "../../../../_services/fomSize.service";
import { CollectionService } from "../../../../_services/collection.service";
@Component({
  selector: "app-clientListForCustomer-list",
  templateUrl: "./clientListForCustomer-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ClientListForCustomerListComponent implements OnInit {
  params: number;
  clientListForCustomer = [];
  categoriesCodeList = [];
  collectionList = [];
  qualityList = [];
  designList = [];
  shadeList = [];
  fomDensityList = [];
  fomSuggestedMMList = [];
  fomSizeList = [];
  categoryId = 1;
  categoryIdError = false;
  selectedCollection = null
  selectedQuality = null;
  selectedDesign = null;
  selectedDensity = null;
  selectedSize = null;
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
    private clientListForCustomerService: ClientListForCustomerService,
    private matSizeService: MatSizeService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
    private collectionService: CollectionService,
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
    this.clientListForCustomerService.getAccessoryProducts(this.pageSize, this.page, this.search).subscribe(
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
    this.clientListForCustomerService.getFabricProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedDesign, this.shadeId).subscribe(
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
    this.clientListForCustomerService.getFoamProducts(this.pageSize, this.page, this.search, this.selectedCollection, this.selectedQuality, this.selectedDensity, this.selectedSize, this.fomSizeId).subscribe(
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
  }

  onChangeCategory() {
    this.page = 0;
    this.search = '';
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
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
    this.selectedQuality = null;
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
  }

  getCategoryWiseProducts() {
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

  getFWRCollectionLookup() {
    Helpers.setLoading(true);
    this.collectionService.getCollectionLookUpForSo(this.categoryId).subscribe(
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

  getQualityLookUpForSO() {
    Helpers.setLoading(true);
    this.collectionService.getQualityLookUpForSO(this.selectedCollection).subscribe(
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
    this.selectedQuality = null;

    this.getCategoryWiseProducts();
    if (this.selectedCollection != null) {
      if (this.categoryId == 1) {
        this.getQualityLookUpForSO();
      } else if (this.categoryId == 2) {
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
  }

  onQualityClick() {
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
      if (this.categoryId == 1) {
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
