import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Agent } from "../_models/agent";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class AgentService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllAgents(pageSize=0,page=0,search='') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Agent?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAgentById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Agent/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAgentLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAgentLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createAgent(agent: Agent) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Agent', agent, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateAgent(agent: Agent) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Agent/' + agent.id, agent, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteAgent(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Agent/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
