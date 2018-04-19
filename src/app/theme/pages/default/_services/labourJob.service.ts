import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class LabourJobService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllLabourJobs(pageSize = 0, page = 0, search = '', isLabourChargePaid, tailorId, startDate, endDate) {
    return this.http.get(AppSettings.API_ENDPOINT + 'LabourJob?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&isLabourChargePaid=' + isLabourChargePaid + '&tailorId=' + tailorId + '&startDate=' + startDate + '&endDate=' + endDate, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getLabourJobById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'LabourJob/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTailorLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetTailorLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updatePaidLabourCharge(labourJob) {
    return this.http.put(AppSettings.API_ENDPOINT + 'LabourJob/PaidLabourCharge/' + labourJob.workOrderId, labourJob, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
