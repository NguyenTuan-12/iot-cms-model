import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminGuard, StoreGuard } from "./common/auth.guard";
import { AppRoutes } from "./app.routing";
import { Globals } from "./common/globals";
import { Configs } from "./common/configs";
import { AuthService } from "./common/auth.service";
import { Notification } from "./common/notification";
import { ToastyModule } from "ng2-toasty";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from "./app.component";
import { Error404Module } from "./main/errors/404/error-404.module";
import { LayoutModule } from "./layout/layout.module";
import { ConfigTreeGrids } from "./common/configs_treegrid";
import { TokenInterceptor } from './common/token.interceptor';
import { CoreService } from './_services/core.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    // RouterModule.forRoot(AppRoutes, { useHash: true }),
    RouterModule.forRoot(AppRoutes),
    TranslateModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    HttpModule,
    BrowserAnimationsModule,

    // Common Module
    Error404Module,
    LayoutModule
  ],
  declarations: [AppComponent],
  providers: [
    AuthService,
    CoreService,
    StoreGuard,
    Globals,
    Configs,
    ConfigTreeGrids,
    Notification,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
