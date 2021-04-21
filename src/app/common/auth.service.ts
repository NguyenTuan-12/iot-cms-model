// GLOBAL IMPORT
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  ResponseType,
  ResponseContentType
} from "@angular/http";
import { Globals } from "./globals";
import { Consts } from "./const";
Injectable();
export class AuthService {
  // for change the navbar state between online and offline
  private authenticate = new Subject<boolean>();
  authenticateState$ = this.authenticate.asObservable();
  storeCode = "";

  constructor(
    @Inject(Http) private http: Http,
    @Inject(Router) private router: Router,
    @Inject(Globals) private globals: Globals
  ) {
    this.storeCode = window.location.host
      .replace(/^www\./, "")
      .toLowerCase()
      .split(".")[0];
  }

  signin = (username: string, password: string): Observable<any> => {
    const url_request = this.globals.apiURL + "login";
    const body_request = {
      username: username,
      password: password
    };
    const options = this.globals.getCommonOptions(url_request, body_request);
    return this.http.post(url_request, body_request, options).pipe(
      map((res: any) => {
        let result = JSON.parse(res._body);
        return result;
      })
    );
  };

  // delete the token in localStorage and change the navbar state
  logout = (): void => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    this.authenticate.next(false);
    this.router.navigate(["/"]);
  };

  // save the token in localStorage and change the navbar state
  saveToken = (token: string, username: string, userInfo?: string): void => {
    if (username !== null) {
      localStorage.setItem("username", username);
    }
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", userInfo);
    this.authenticate.next(true);
  };

  // return if the user is authenticate
  isAuthenticate = (): boolean => {
    let isAuth: boolean;
    if (localStorage.getItem("token")) {
      isAuth = true;
    } else {
      isAuth = false;
    }
    this.authenticate.next(isAuth);
    return isAuth;
  };

  // Check Subdomain
  checkSubDomain = (): Observable<any> => {
    return this.http.get(
      this.globals.apiURL + "tenant/CheckCode?values=" + this.globals.storeCode
    );
  };
}
