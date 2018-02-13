import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AgentService } from '../../../../_services/agent.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Agent } from "../../../../_models/agent";
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: "app-agent-list",
  templateUrl: "./agent-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AgentListComponent implements OnInit {
  isFormSubmitted: boolean = false;
  agentForm: any;
  agentObj: any;
  params: number;
  agentList = [];
  states = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.states = this.commonService.states;
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    this.newRecord();
  }

  newRecord() {
    this.params = null;
    this.agentObj = {
      id: 0,
      name: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      pin: '',
      commision: null,
    };
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.newRecord();
  }
  getAgentsList() {
    this.agentService.getAllAgents(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.agentList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }
  loadLazy(event: LazyLoadEvent) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    //imitate db connection over a network
    this.pageSize = event.rows;
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getAgentsList();
  }

  getAgentById(id) {
    Helpers.setLoading(true);
    this.agentService.getAgentById(id).subscribe(
      results => {
        this.agentObj = results;
        console.log('this.agentList', this.agentObj);
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (!valid)
      return;
    this.saveAgent(this.agentObj);
  }

  saveAgent(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.agentService.updateAgent(value)
        .subscribe(
        results => {
          this.getAgentsList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.agentService.createAgent(value)
        .subscribe(
        results => {
          this.getAgentsList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(agent: Agent) {
    this.agentService.perPage = this.pageSize;
    this.agentService.currentPos = this.page;
    this.getAgentById(agent.id);
    this.params = agent.id;
    this.toggleDiv = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(agent: Agent) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.agentService.deleteAgent(agent.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getAgentsList();
            this.toggleDiv = false;
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }
}
