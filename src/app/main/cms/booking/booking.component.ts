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
import { Query, Predicate } from "@syncfusion/ej2-data";
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
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
ListBoxComponent.Inject(CheckBoxSelection);
setCulture("vi");

@Component({
  selector: "cms-app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class AppBookingComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  pageIndex = 0;
  changeStatusForm: FormGroup;
  public editSettingCustom: EditSettingsModel;
  public data: Observable<DataStateChangeEventArgs>;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance: GridComponent;

  // public editSettings: Object;
  public state: DataStateChangeEventArgs;
  // search
  public query = new Query();
  public fields: FieldSettingsModel = { text: "name", value: "id" };


  public selectAllText = "Chọn tất cả";
  public unSelectAllText = "Bỏ chọn tất cả";
  public mode = "CheckBox";
  public search = {
    text: "",
    status: null
  };
  public convertId = null;

  public lstStatus = [
    {
      id: 1,
      name: "Đã đặt lịch"
    },
    {
      id: 2,
      name: "Hủy đặt lịch"
    },
    {
      id: 3,
      name: "Đã liên hệ"
    },
    {
      id: 4,
      name: "Chưa liên hệ"
    }
  ];
  public selection = {
    showCheckbox: true,
    showSelectAll: true,
  };

  // Toolbar Item
  public toolbar: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
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
    this.changeStatusForm = this._formBuilder.group({
      status: ["", Validators.required]
    });
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
      "cms-app-booking",
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
    this._coreService.execute(this.state, "get-list-booking", extraParams);
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
    this._coreService.execute(state, "get-list-booking", extraParams);
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
        this.router.navigate(["/cms/system/booking/new"]);
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
          .Post("remove-booking", {
            id: lstDeleteIds[0]
          })
          .subscribe((success) => {
            this.notification.deleteSuccess();
            this.modalService.close('confirm-delete-modal');
            this.gridInstance.clearSelection();
            this.gridInstance.refresh();
          }, error => {
            this.notification.deleteError();
          });
      }
      this.lstStatus = _.cloneDeep(this.lstStatus);
      this.modalService.close("confirm-delete-modal");
    }
  };
  // xóa
  confirmConvert = (status): void => {
    if (status === "cancel") {
      this.modalService.close('confirm-convert-modal');
    } else {
      if (!this.changeStatusForm.valid) {
        this.notification.warning("Vui lòng chọn trạng thái!");
        this.changeStatusForm.markAllAsTouched();
        return;
      }
      this._coreService.Post("update-status-booking", {
        id: this.convertId,
        status: this.search.status
      }).subscribe((res) => {
        if (res && res.status && res.status == 200) {
          this.modalService.close("confirm-convert-modal");
          this.notification.updateSuccess();
          this.getListData();
        } else {
          this.modalService.close("confirm-convert-modal");
          this.notification.warning("Cập nhật không thành công!");
        }
      },
        (err) => {
          this.notification.error("Lỗi server!");
        })
    }
  };

  ngOnDestroy(): void {
  }

  clickRecord = (data, status) => {
    if (status == 'convert') {
      let itemX = _.find(this.lstStatus, (item) => {
        return item.id === data.status;
      });
      this.search.status = itemX && itemX.id ? itemX.id : this.search.status;
      this.convertId = data && data._id ? data._id : null;
      this.modalService.open("confirm-convert-modal");
    } else {
      const objParamAdd = { id: data && data._id ? data._id : null, type: "view" };
      const paramAdd = window.btoa(JSON.stringify(objParamAdd));
      this.router.navigate(["/cms/booking/" + paramAdd]);
    }
  }
  // filter chung
  public onFiltering(e, lst) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(lst, this.query);
  }
}
