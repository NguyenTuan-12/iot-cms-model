// GLOBAL IMPORT
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  DataStateChangeEventArgs,
  Sorts,
  DataResult
} from "@syncfusion/ej2-angular-grids";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Http } from "@angular/http";
import { Globals } from "../../common/globals";
import { ExtraParams } from "../../_models/index";
import { ConfigService } from '../config.service';

Injectable();
export class SystemUserService extends Subject<DataStateChangeEventArgs> {
  public loadCouncilSubject = new Subject<any>();

  constructor(
    @Inject(Http) private http: Http,
    @Inject(Router) private router: Router,
    @Inject(Globals) private globals: Globals,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super();
  }

  public execute(
    state: any,
    url: string,
    extraParams?: Array<ExtraParams>
  ): void {
    this.GetAll(state, url, extraParams).subscribe(x => super.next(x));
  }

  // Function GetAll
  GetAll = (
    state: DataStateChangeEventArgs,
    url: string,
    extraParams?: any
  ): Observable<DataStateChangeEventArgs> => {
    let url_req = this.globals.getCommonURLGetAllFreeText(state, url, extraParams);
    const options = this.globals.getCommonOptionsWithAuth(
      url_req
    );
    this.configService.loadingSubject.next('true');
    return this.http
      .get(url_req, options)
      .pipe(
        map((res: any) => {
          let result = null;
          result = JSON.parse(res._body);
          return {
            result: result && result.data && result.data.length ? result.data : [],
            count: result && result.totalRecords ? result.totalRecords : 0
          } as DataResult;
        })
      )
      .pipe((data: any) => {
        this.configService.loadingSubject.next('false');
        return data;
      });
  };
}
