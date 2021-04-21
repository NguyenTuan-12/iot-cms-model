import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

// Service Translate
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Import the locale files
import { locale as english } from "./i18n/en";
import { locale as vietnam } from "./i18n/vi";
// Globals File
import { Globals } from "src/app/common/globals";
import { Configs } from "src/app/common/configs";
import { Notification } from "src/app/common/notification";
import { Query, Predicate } from "@syncfusion/ej2-data";
import * as _ from "lodash";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent,
  EditSettingsModel,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import * as $ from "jquery";
import * as moment from 'moment';
import { DataStateChangeEventArgs } from "@syncfusion/ej2-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
import { GetGaraService } from "src/app/_services/getgara.service";
ListBoxComponent.Inject(CheckBoxSelection);
setCulture("vi");

@Component({
  selector: "cms-app-amount",
  templateUrl: "./amount.component.html",
  styleUrls: ["./amount.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class AmountComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  pageIndex = 0;
  public editSettingCustom: EditSettingsModel;
  public query = new Query();

  public data = [];
  public lstGaras = [];
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance: GridComponent;

  // public editSettings: Object;
  public state: DataStateChangeEventArgs;
  // search

  public selectAllText = "Chọn tất cả";
  public unSelectAllText = "Bỏ chọn tất cả";
  public mode = "CheckBox";
  public search = {
    text: "",
    garaId: null,
    fromDate: null,
    toDate: null,
  };
  public selection = {
    showCheckbox: true,
    showSelectAll: true,
  };

  // Toolbar Item
  public toolbar: ToolbarInterface[];

  public fields: FieldSettingsModel = { text: "name", value: "_id" };

  // List data
  public modelAdd: any;
  public modelDelete: any = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  pageSize: number;
  node: NodeListOf<HTMLElement>;
  indexOfRecord: any;
  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private getGaraService: GetGaraService,
    private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
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

    this.editSettingCustom = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: true,
      mode: "Normal",
      newRowPosition: "Bottom",
    };
    // Load List Data
    this.getGaraService.Get("get-list-garage").subscribe((res) => {
      if (res && res.data) {
        this.lstGaras = res.data;
      }
    });
    this.getListData();
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
  // GetListData
  getListData = (): void => {
    this._coreService
      .Post("report-customer", {
        garage_id: this.search.garaId,
        from_date: this.search.fromDate && typeof this.search.fromDate === 'object' ? moment(this.search.fromDate).format("DD/MM/YYYY") : null,
        to_date: this.search.toDate && typeof this.search.toDate === 'object' ? moment(this.search.toDate).format("DD/MM/YYYY") : null,
      })
      .subscribe((res) => {
        this.data = res && res.data ? res.data : [];
        this.gridInstance.refresh();
      });
  };
  searchListEnter = (event): void => {
    if (event.keyCode === 13) {
      this.getListData();
    }
  };

  // change date
  changeDate = (inputValue) => {
    setTimeout(() => {
      const idDate = "#" + inputValue + "_input";
      const value = $(idDate).val();
      if (
        value &&
        ((value.length === 8 && value.indexOf("/") === -1) ||
          (value.length === 6 && value.indexOf("/") === -1) ||
          (value.length === 10 && value.indexOf("/") > -1))
      ) {
        if (value.indexOf("-") === -1) {
          const returnDate = this.globals.replaceDate(value);
          if (returnDate && returnDate.length > 0) {
            const dateParts: any = returnDate.split("/");
            let m = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            let n = moment(m).format("DD/MM/YYYY");
            $(idDate).val(n);
          }
        }
      }
    }, 400);
  };
  checkDate = (model) => {
    if (model) {
      if (
        this.search.fromDate &&
        moment(this.search.fromDate, "DD/MM/YYYY").isSameOrAfter(
          moment(this.search.toDate, "DD/MM/YYYY")
        )
      ) {
        this.notification.warning(
          "Trường Từ ngày phải nhỏ hơn Trường Đến ngày. Vui lòng chọn lại!"
        );
        setTimeout(() => {
          this.search.fromDate = null;
          this.search.toDate = null;
        }, 100);
      }
    }
  };
  public onFilteringOtherList(e, lst) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(lst, this.query);
  }
}
