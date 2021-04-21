import { CanActivate, Router } from "@angular/router";

import { Injectable, Inject } from "@angular/core";
import { tokenNotExpired, JwtHelper, AuthConfig } from "angular2-jwt";
import { AuthService } from "./auth.service";

export interface TokenInfo {
  id: string;
  user_level: number;
  sub: string;
  website: string;
}

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(@Inject(Router) private router: Router, @Inject(AuthService) private authService: AuthService) { }

  canActivate = () => {
    const helper: JwtHelper = new JwtHelper();
    const authConfig: AuthConfig = new AuthConfig();
    const token: string = <string>authConfig.getConfig().tokenGetter();

    // const token: string = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(Router) private router: Router, @Inject(AuthService) private authService: AuthService) { }

  canActivate = () => {
    const token: string = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
