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
import { User } from "src/app/_models/app/system/User";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as $ from "jquery";
import * as moment from "moment";
import * as async from "async";

setCulture("vi");

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SysUserEditComponent implements OnInit {
  paramId: number;
  // Varriable Language
  flagState = "";
  model: User = new User();
  modelOrigin: User = new User();
  // language
  languages: any;
  selectedLanguage: any;

  // Data grid
  editForm: FormGroup;
  public mode: string;
  public modelDelete: any = [];
  public query = new Query();
  lstUserGroups = [];
  fields = { text: "name", value: "_id" };
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

    this.editForm = this._formBuilder.group({
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern(/^(?=.{1,30}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/)
        ],
      ],
      fullname: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(255),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(20),
          Validators.minLength(8),
        ],
      ],
      confirm_password: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(255),
        ],
      ],
      email: ["", [Validators.maxLength(255), Validators.email]],
      mobile: ["", [Validators.maxLength(10)]],
      address: ["", [Validators.maxLength(2000)]],
      user_type: ["", [Validators.required]],
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
    if (this.flagState == "view") {
      this.editForm.disable();
    }

    if (this.paramId) {
      this.editForm.get("password").setValidators(null);
      this.editForm.get("confirm_password").setValidators(null);
      this.editForm.get("password").updateValueAndValidity();
      this.editForm.get("confirm_password").updateValueAndValidity();
      this.getComboBox().then(() => {
        this.getDetailData();
      });
      this.editForm.get("username").disable();
    } else {
      this.getComboBox();
    }
  }

  getComboBox = () => {
    return new Promise((resolve, reject) => {
      this._coreService.Get("get-combo-user-group").subscribe(
        (data) => {
          this.lstUserGroups = data.data;
          resolve(true);
        },
        (error) => {
          resolve(true);
        }
      );
    });
  };

  getDetailData = () => {
    this._coreService.Get("get-user?id=" + this.paramId).subscribe((data) => {
      this.model = data.data;
      this.model.id = this.model._id;
    });
  };
  // Build Toolbar
  buildToolbar = () => {
    let toolbarList = [];
    if (this.flagState !== "view") {
      toolbarList = [ToolbarItem.SAVE, ToolbarItem.BACK];
    }
    if (this.flagState === "view") {
      toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
    }
    this.toolbar = this.globals.buildToolbar("app-sysuser-edit", toolbarList);
  };
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        if (!this.editForm.valid) {
          this.notification.warning("Cập nhật không thành công");
          this.editForm.markAllAsTouched();
          return;
        } else if(this.flagState === 'new' && this.model.password !== this.model.confirm_password) {
          this.notification.warning("Nhập lại mật khẩu không trùng với Mật khẩu!");
          return;
        } else {
          this.saveData();
        }
        break;
      case ToolbarItem.EDIT:
        this.flagState = "edit";
        this.buildToolbar();
        this.editForm.enable();
        this.editForm.get("code").disable();
        break;
      case ToolbarItem.BACK:
        if (this.editForm.dirty && this.editForm.touched) {
          this.modalService.open("confirm-back-modal");
        } else {
          this.router.navigate(["/cms/system/sysuser"]);
        }
        break;
      default:
        break;
    }
  };
  saveData() {
    if (!this.editForm.valid) {
      this.notification.warning("Cập nhật không thành công");
      this.editForm.markAllAsTouched();
      return;
    } else if (this.model.confirm_password !== this.model.password) {
      this.notification.warning("Cập nhật không thành công");
      return;
    } else {
      if (this.flagState === "new") {
        let objApiAdd = this.prepareModelBeforeSave();
        this._coreService.Post("create-user", objApiAdd).subscribe(
          (res) => {
            if (res && res.status == 200) {
              this.notification.addSuccess();
              this.router.navigate(["/cms/system/sysuser"]);
            } else {
              this.notification.addError();
            }
          },
          (error) => {
            let x = error._body ? JSON.parse(error._body) : null;
            if (x && x.errorCode == "ERROR_USERNAME_EXISTS") {
              this.notification.warning(
                "Tên đăng nhập đã tôn tại trong hệ thống. Vui lòng nhập lại!"
              );
            } else {
              this.notification.addError();
            }
          }
        );
      }
      if (this.flagState === "edit") {
        let objApiEdit = this.prepareModelBeforeSave();
        this._coreService.Post("update-user", objApiEdit).subscribe(
          (res) => {
            if (res && res.status == 200) {
              this.notification.editSuccess();
              this.router.navigate(["/cms/system/sysuser"]);
            } else {
              this.notification.editError();
            }
          },
          (error) => {
            let x = error._body ? JSON.parse(error._body) : null;
            if (x && x.errorCode == "ERROR_USERNAME_EXISTS") {
              this.notification.warning(
                "Tên đăng nhập đã tồn tại trong hệ thống. Vui lòng nhập lại!"
              );
            } else {
              this.notification.editError();
            }
          }
        );
      }
    }
  }
  // chuẩn bị model trc khi save
  prepareModelBeforeSave = () => {
    let objAPI = Object.assign({}, this.model);
    return objAPI;
  };
  confirmBack = (status): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/cms/system/sysuser"]);
    }
  };
  checkPassword = () => {
    setTimeout(()=>{
      if(this.model.confirm_password != this.model.password) {
        this.editForm.get("confirm_password").setErrors({diffPW: true});
      }
    },300)
  }
  checkPhoneNumber = (model, formName) => {
    if (this.model && this.model[model] && this.model[model].length > 0) {
      let isSpace = this.model[model].trim() == "" ? true : false;
      if (this.model[model].length > 30) {
        this[formName].get(model).setValue("");
        return;
      }

      if (this.model[model].length != 10) {
        this[formName].get(model).setErrors({ incorrect: true });
        return;
      }
      const valid = this.globals.checkMobile(this.model[model]);
      if (valid) {
        this[formName].get(model).clearValidators();
        return;
      } else {
        this[formName].get(model).setErrors({ incorrect: true });
        return;
      }
    } else {
      // this[formName].get(model).setErrors({ required: true });
      // return;
    }
  };
  public onFiltering(e, lst) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(lst, this.query);
  }
}
