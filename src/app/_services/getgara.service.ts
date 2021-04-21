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
import { Globals } from "../common/globals";
import { ExtraParams } from "../_models/index";
import { ConfigService } from './config.service';

Injectable();
export class GetGaraService extends Subject<DataStateChangeEventArgs> {
  public loadCouncilSubject = new Subject<any>();

  constructor(
    @Inject(Http) private http: Http,
    @Inject(Router) private router: Router,
    @Inject(Globals) private globals: Globals,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super();
  }
  // SERVICE GET
  Get = (url: string) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request);

    return this.http.get(url_request, options).pipe(
      map((res: any) => {
        res = JSON.parse(res._body);
        return res.data ? res.data : res;
      })
    );
  };

}
