import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginInterface } from "./login.interface";
import { AuthService } from "../../common/auth.service";
import { Notification } from "../../common/notification";
import { Globals } from "../../common/globals";
import { ConfigService } from "src/app/_services/config.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  model: LoginInterface = new LoginInterface();

  showPassword = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _notification: Notification,
    private _configService: ConfigService,
    private router: Router,
    private globals: Globals
  ) {
    this._configService._configSubject.next("false");
    this.loginForm = this._formBuilder.group({
      username: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(150)
        ]
      ],
      password: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(50)
        ]
      ]
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const isAuthen = this._authService.isAuthenticate();
    if (isAuthen) {
      this.router.navigate(["/cms/dashboard"]);
    }
    //this.router.navigate(["/cms/dashboard"]);
  }

  // SignIn
  signIn = (): void => {
    this.model = this.loginForm.value;
    if (this.loginForm.valid) {
      this._authService
        .signin(this.model.username, this.model.password)
        .subscribe(
          res => {
            console.log(res);
            // Lưu token
            this._authService.saveToken(
              res.token,
              this.model.username,
              JSON.stringify(res)
            );
            // // Hiển thị notice Đăng nhập thành công
            this._notification.success("Đăng nhập thành công!");
            this.router.navigate(["/cms/dashboard"]);
          },
          error => {
            console.log(error);
            this._notification.warning("Tên đăng nhập và mật khẩu không đúng. Vui lòng kiểm tra lại!");
          }
        );
    } else {
      this.loginForm.markAllAsTouched();
    }
  };

  // enter signin
  enterSignIn = (e: any): void => {
    setTimeout(() => {
      if (
        e.keyCode === 13 &&
        this.model.username.length > 0 &&
        this.model.password.length > 0
      ) {
        this.signIn();
      }
    }, 0);
  };
}
