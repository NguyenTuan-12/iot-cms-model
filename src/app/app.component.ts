import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Renderer
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";

import { TranslationLoaderService } from "./common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Navigation
import { NavigationService } from "./_services/navigation.service";
import { navigation } from "./navigation/navigation";
import { locale as navigationEnglish } from "./navigation/i18n/en";
import { locale as navigationVietNam } from "./navigation/i18n/vi";
// Import AuthService
import { AuthService } from "./common/auth.service";
import { Globals } from "./common/globals";
import { Consts } from "./common/const";
import { Subject } from "rxjs";
import { CoreService } from "./_services/core.service";
import { ConfigService } from "./_services/config.service";
import { loadCldr, L10n } from "@syncfusion/ej2-base";

// import * as cagregorian from "cldr-data/main/vi/ca-gregorian.json";
// import * as numbers from "cldr-data/main/vi/numbers.json";
// import * as timeZoneNames from "cldr-data/main/vi/timeZoneNames.json";
// import * as numberingSystems from "cldr-data/supplemental/numberingSystems.json";

// loadCldr(cagregorian, numbers, timeZoneNames, numberingSystems);

declare var require: any;

loadCldr(
  require("cldr-data/supplemental/numberingSystems.json"),
  require("cldr-data/main/vi/ca-gregorian.json"),
  require("cldr-data/main/vi/numbers.json"),
  require("cldr-data/main/vi/timeZoneNames.json"),
  require("cldr-data/supplemental/weekdata.json") // To load the culture based first day of week
);
// setCulture("vi");

L10n.load({
  vi: {
    datepicker: {
      placeholder: "Chọn ngày",
      today: "Hôm nay"
    }
  }
});

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  navigation: any;
  isCorrectDomain: boolean;
  isloading: boolean;

  @ViewChild("spinnerElement", { static: false })
  spinnerElement: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _translationLoaderService: TranslationLoaderService,
    private _configService: ConfigService,
    private _translateService: TranslateService,
    private _navigationService: NavigationService,
    private _router: Router,
    private globals: Globals
  ) {
    this._configService.loadingSubject.subscribe(data => {
      if (data === "true") {
        this.isloading = true;
      } else {
        this.isloading = false;
      }
    });

    this._router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isloading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isloading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    this.navigation = navigation;

    // Register the navigation to the service
    this._navigationService.register("main", this.navigation);

    // Set the main navigation as our current navigation
    this._navigationService.setCurrentNavigation("main");

    // Add languages
    this._translateService.addLangs(["vi", "en"]);

    // Set the default language
    this._translateService.setDefaultLang("vi");

    // Set the navigation translations
    this._translationLoaderService.loadTranslations(
      navigationVietNam,
      navigationEnglish
    );

    // Use a language
    this._translateService.use("vi");
  }

  /**
   * On init
   */
  ngOnInit(): void {}
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
