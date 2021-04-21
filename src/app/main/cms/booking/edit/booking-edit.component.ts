import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  ElementRef,
} from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";

// Service Translate
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Import the locale files
import { locale as english } from "../i18n/en";
import { locale as vietnam } from "../i18n/vi";
// Globals File
import { Globals } from "src/app/common/globals";
import { Configs } from "src/app/common/configs";
import { Notification } from "src/app/common/notification";
import * as _ from "lodash";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  VirtualScrollService,
  GridComponent,
  EditSettingsModel,
  DataStateChangeEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from 'moment';
setCulture("vi");

@Component({
  selector: "app-booking-edit",
  templateUrl: "./booking-edit.component.html",
  styleUrls: ["./booking-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class AppBookingEditComponent implements OnInit {
  customMaximum = 1;
  customMaximumProvin = 1;
  paramId: number;
  pageIndex = 0;
  functionText = "";
  // Varriable Language
  flagState = "";
  // language
  languages: any;
  selectedLanguage: any;

  @ViewChild("overviewgrid", { static: false })
  public gridInstance: GridComponent;
  public data: Observable<DataStateChangeEventArgs>;

  public modelView = {
    bookingCode: null,
    customerAddress: null,
    customerEmail: null,
    customerName: null,
    customerPhone: null,
    dateBooking: null,
    dateCreated: null,
    dateUpdated: null,
    description: null,
    services: null,
  }


  public fieldsOtherlist: FieldSettingsModel = { text: "name", value: "name" };
  public fields: FieldSettingsModel = { text: "name", value: "id" };
  customMaximumMulti = 2000;

  // Toolbar Item
  public toolbar: ToolbarInterface[];
  public toolbarNhiemKy: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  customSTT: number;
  index: any;
  clickShow: boolean = false;
  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private el: ElementRef
  ) {
    // Get Route Param
    this.activatedRoute.params.subscribe((params: Params) => {
      const paramId = params["id"];
      // Nếu trạng thái chỉnh sửa thì Get dữ liệu
      if (paramId !== "new") {
        const objParam = window.atob(paramId);
        const paramUrl = JSON.parse(objParam);
        if (paramUrl && paramUrl.id) {
          this.paramId = paramUrl.id;
          this.flagState = paramUrl.type;
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState = "new";
      }
    });

    // Set language
    this.languages = this.globals.languages;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.selectedLanguage.id);
    if (this.paramId) {
      console.log('haveparam')
      this._coreService.Get("get-booking/" + this.paramId).subscribe((res) => {
        console.log('res', res);
        if (res && res.status && res.status == 200) {
          this.modelView = res.data ? res.data : null;
          this.modelView.dateCreated = this.modelView && this.modelView.dateCreated ? moment(this.modelView.dateCreated).format("DD/MM/YYYY hh:mm:ss") : null;
          this.modelView.dateBooking = this.modelView && this.modelView.dateBooking ? moment(this.modelView.dateBooking).format("DD/MM/YYYY hh:mm:ss") : null;
          this.modelView.dateUpdated = this.modelView && this.modelView.dateUpdated ? moment(this.modelView.dateUpdated).format("DD/MM/YYYY hh:mm:ss") : null;
          console.log(this.modelView);

        }
      })
    }
  }
  formatStt = (index: string) => {
    if (this.gridInstance) {
      return (
        (this.gridInstance.pageSettings.currentPage - 1) *
          this.gridInstance.pageSettings.pageSize +
        parseInt(index, 0) +
        1
      );
    }
  };
  backToList = () => {
    this.router.navigate(["/cms/booking"]);
  }
}

