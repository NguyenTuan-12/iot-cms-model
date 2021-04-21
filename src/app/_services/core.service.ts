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
export class CoreService extends Subject<DataStateChangeEventArgs> {
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

  public executeNonPaging(
    state: any,
    url: string,
    extraParams?: Array<ExtraParams>
  ): void {
    this.GetAllNonePaging(state, url, extraParams).subscribe(x =>
      super.next(x)
    );
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
          result = result.data;
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


  // Function create Model
  Create = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.post(url_request, body, options);
  };

  // Function update Model
  Update = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.post(url_request, body, options);
  };

  // Function Delete Model
  Delete = (url: string, body: Array<any>) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.post(url_request, body, options);
  };

  // SERVICE POST
  Post = (url: string, body: any) => {
    const url_request =
      this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(
      url_request,
      body
    );

    return this.http.post(url_request, body, options).pipe(
      map((response: any) => {
        response = JSON.parse(response._body);
        return response;
      })
    );
  }
  Post2 = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    const obj_body = body;
    const body_request = {
      restHeader: {
        clientAddress: "192.168.232.2",
        clientRequestId: "110777673",
        clientSessionId: "",
        deviceId: "56f0c3ef-0f8d-31c3-8ad4-3a8fa8afbb29",
        exchangeIV: "",
        language: "vi",
        location: null,
        partnerCode: "",
        platform: "android",
        channelCode: "PROVIDER_WEB",
        systemCode: "PROVIDER",
        platformVersion: "android:8.1.0",
        sdkId: "123"
      },
      body: this.globals.convertObjectToBase64(obj_body)
    };

    const options = this.globals.getCommonOptionsWithAuth(
      url_request,
      body_request
    );

    return this.http.post(url_request, body, options).pipe(
      map((res: any) => {
        res = JSON.parse(res._body);
        let result = null;
        result = this.globals.b64DecodeUnicode(res.body);
        return result;
      })
    );
  };

  // SERVICE PUT
  Put = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.put(url_request, body, options).pipe(
      map((response: any) => {
        response = JSON.parse(response._body);
        return response;
      })
    );
  };

  // SERVICE DEL
  Del = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url + body;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.delete(url_request, options).pipe(
      map((response: any) => {
        response = JSON.parse(response._body);
        return response;
      })
    );
  };

  // SERVICE GET
  Get = (url: string) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request);

    return this.http.get(url_request, options).pipe(
      map((res: any) => {
        res = JSON.parse(res._body);
        return res;
      })
    );
  };

  uploadImage = (file: any): Observable<any> => {
    const url_request = this.globals.imgurReq.url;
    const body = {
      image: file
    };

    const options = this.globals.getCommonOptionImage(url_request, body);

    return this.http
      .post(url_request, body, options)
      .pipe(map((response: any) => response.json()));
  };

  uploadFile = (formData: any, folder: string): Observable<any> => {
    const url = 'http://download.tlavietnam.vn:6800/api/upload?Folder=' + this.globals.username + "/" + folder;
    return this.http
      .post(url, formData)
      .pipe(map((response: any) => {
        return response.json();
      }));
  }

  GetOutside = (url): Observable<any> => {
    return this.http
      .get(url)
      .pipe(map((response: any) => {
        return response.json();
      }));
  }

  // Function GetAll
  GetAllNonePaging = (
    state: DataStateChangeEventArgs,
    url: string,
    extraParams?: any
  ): Observable<DataStateChangeEventArgs> => {
    const url_request = this.globals.getCommonURLGetAll(
      state,
      url,
      extraParams
    );

    const options = this.globals.getCommonOptionsWithAuth(url_request);
    return this.http
      .get(url_request, options)
      .pipe(map((response: any) => response.json()));
  };
}
