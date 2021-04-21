import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
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
import * as _ from "lodash";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent,
  EditSettingsModel,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";

import {
  DataStateChangeEventArgs,
} from "@syncfusion/ej2-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
setCulture("vi");

@Component({
  selector: "cms-app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SysMenuComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  pageIndex = 0;
  public titleName = '';
  public editSettingCustom: EditSettingsModel;

  public data: Observable<DataStateChangeEventArgs>;
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
    text: ""
  };
  public selection = {
    showCheckbox: true,
    showSelectAll: true,
  };

  // Toolbar Item
  public toolbar: ToolbarInterface[];

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
    private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.data = _coreService;
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

    // Build toolbar
    this.buildToolbar();
    this.editSettingCustom = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: true,
      mode: "Normal",
      newRowPosition: "Bottom",
    };
    // Load List Data
    this.getListData();
  }

  // double click xem ban ghi
  viewRecord = (e) => {
    this.modelAdd = e.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    window.open("cms/system/menu/" + paramAdd, "_blank");
  };

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
  // Build Toolbar
  buildToolbar = () => {
    let toolbarList = [];
    toolbarList = [ToolbarItem.ADD];
    this.toolbar = this.globals.buildToolbar(
      "cms-app-menu",
      toolbarList
    );
  };
  // GetListData
  getListData = (): void => {
    const state = { take: 20, skip: 0 };
    if (this.state && this.state.take) {
      this.state.skip = this.state.skip;
      this.state.take = this.state.take;
      this.pageIndex = Math.floor(this.state.skip / this.state.take);
    } else {
      this.state = state;
      this.pageIndex = 0;
    };
    let extraParams = [];
    // Xét có điều kiện tìm kiếm
    if (this.search.text) {
      extraParams.push({
        field: "text",
        value: this.search.text,
      });
    }
    if (this.gridInstance) {
      this.gridInstance.goToPage(1);
    }
    this._coreService.execute(this.state, "get-list-menu", extraParams);
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip / state.take);
    let extraParams = [];
    if (this.search.text) {
      extraParams.push({
        field: "text",
        value: this.search.text,
      });
    }
    this._coreService.execute(state, "get-list-menu", extraParams);
  }

  searchListEnter = (event): void => {
    if (event.keyCode === 13) {
      this.getListData();
    }
  };

  // click toolbar Chức vụ
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.router.navigate(["/cms/system/menu/new"]);
        break;
      default:
        break;
    }
  };

  // xóa
  confirmDelete = (status): void => {
    if (status === "cancel") {
      this.modalService.close('confirm-delete-modal');
    } else {
      const selectDeletes: any = this.gridInstance.getSelectedRecords();
      // gọi API xóa ở đây
      let lstDeleteIds = _.map(selectDeletes, "_id");

      if (lstDeleteIds && lstDeleteIds.length > 0) {
        this._coreService
          .Post("remove-menu", {
            id: lstDeleteIds[0]
          })
          .subscribe((success) => {
            if(success && success.status == 200) {
              this.notification.deleteSuccess();
              this.modalService.close('confirm-delete-modal');
              this.getListData();
            } else {
              this.notification.deleteError();
            }
          }, error => {
            let x = error._body ? JSON.parse(error._body) : null;
            if (x && x.errorCode == "ERROR_MENU_HAS_CHILD") {
              this.notification.warning(
                `Tiêu đề ${this.titleName} đã tồn tại tiêu đề con, không được phép xóa/sửa!`
              );
            } else {
              this.notification.deleteError();
            }
          });
      }
      this.modalService.close("confirm-delete-modal");
    }
  };


  ngOnDestroy(): void {
  }

  clickRecord = (data, status) => {
    console.log(data);
    if (data && status === 'view') {
      this.modelAdd = data;
      const objParamAdd = { id: this.modelAdd._id, type: "view" };
      const paramAdd = window.btoa(JSON.stringify(objParamAdd));
      // window.open("/cms/system/menu/" + paramAdd, "_blank");
      this.router.navigate(["/cms/system/menu", paramAdd]);

    }
    if (data && status === 'edit') {
      this.modelAdd = data;
      const objParamAdd = { id: this.modelAdd._id, type: "edit" };
      const paramAdd = window.btoa(JSON.stringify(objParamAdd));
      this.router.navigate(["/cms/system/menu", paramAdd]);
    }
    if (data && status === 'delete') {
      this.titleName = data.title ? data.title : '';
      this.modelDelete = data.id;
      this.modalService.open("confirm-delete-modal");
    }
  };
}
