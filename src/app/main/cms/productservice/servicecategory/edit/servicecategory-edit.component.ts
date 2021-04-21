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
import { UserGroup } from "src/app/_models/app/system/UserGroup";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as $ from "jquery";
import * as moment from "moment";
import * as async from "async";
import { BlogCategory } from "src/app/_models/app/blog/Blog";
import { ImgurApiService } from "src/app/_services/imgur.service";

setCulture("vi");

@Component({
  selector: "app-servicecategory-edit",
  templateUrl: "./servicecategory-edit.component.html",
  styleUrls: ["./servicecategory-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceCategoryEditComponent implements OnInit {
  paramId: number;
  // Varriable Language
  flagState = "";
  model: BlogCategory = new BlogCategory();
  modelOrigin: BlogCategory = new BlogCategory();
  // language
  languages: any;
  selectedLanguage: any;

  // Data grid
  editForm: FormGroup;
  public mode: string;
  public modelDelete: any = [];
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
    private el: ElementRef,
    private _imgurApiService: ImgurApiService
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
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      name: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(255),
        ],
      ],
      description: ["", Validators.maxLength(2000)],
      image: [""],
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
      this.getDetailData();
      this.editForm.get("code").disable();
    }
  }

  getDetailData = () => {
    this._coreService
      .Get("get-servicecategory/" + this.paramId)
      .subscribe((data) => {
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
    this.toolbar = this.globals.buildToolbar(
      "app-sysusergroup-edit",
      toolbarList
    );
  };
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        if (!this.editForm.valid) {
          this.notification.warning("Cập nhật không thành công");
          this.editForm.markAllAsTouched();
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
          this.router.navigate(["/cms/productservice/servicecategory"]);
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
    } else {
      if (!this.model.image || this.model.image == '') {
        this.notification.warning("Vui lòng tải lên ảnh đại diện!");
        return;
      }
      if (this.flagState === "new") {
        let objApiAdd = this.prepareModelBeforeSave();
        this._coreService.Post("create-servicecategory", objApiAdd).subscribe(
          (res) => {
            if (res && res.status == 200) {
              this.notification.addSuccess();
              this.router.navigate(["/cms/productservice/servicecategory"]);
            } else {
              this.notification.addError();
            }
          },
          (error) => {
            let x = error._body ? JSON.parse(error._body) : null;
            if (x && x.errorCode == "ERROR_CODE_EXISTS") {
              this.notification.warning(
                "Mã nhóm/ Tên nhóm dịch vụ đã tồn tại trong hệ thống. Vui lòng nhập lại!"
              );
            } else {
              this.notification.addError();
            }
          }
        );
      }
      if (this.flagState === "edit") {
        let objApiEdit = this.prepareModelBeforeSave();
        this._coreService.Post("update-servicecategory", objApiEdit).subscribe(
          (res) => {
            this.notification.editSuccess();
            this.router.navigate(["/cms/productservice/servicecategory"]);
            return;
          },
          (error) => {
            let x = error._body ? JSON.parse(error._body) : null;
            if (x && x.errorCode == "ERROR_CODE_EXISTS") {
              this.notification.warning(
                "Mã nhóm/ Tên nhóm dịch vụ đã tồn tại trong hệ thống. Vui lòng nhập lại!"
              );
            } else {
              this.notification.editError();
            }
          }
        );
      }
    }
  }
  uploadImage = (files: FileList) => {
    if (files.length > 0) {
      let data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append("files", files[i]);
        // check file > 5MB
        const fsize = files.item(i).size;
        const file = Math.round(fsize / 1024);
        if (file > 5120) {
          this.notification.warning("Vui lòng tải File < 5MB");
          return;
        }
      }
      // this._coreService.uploadFile(data, "event").subscribe((res: any) => {
      //   if (res.status == 200) {
      //     let urls = res.data;
      //     if (!this.model.image) {
      //       this.model.image = '';
      //     }
      //     if (urls.length > 0) {
      //       this.model.image = urls[0].url;
      //     }

      //     let x: any = document.getElementById("image");
      //     x.value = "";
      //   }
      // });
      let fileUpload = files && files.length ? files[0] : null;
      this._imgurApiService.upload(fileUpload).subscribe((data: any) => {
        if (data && data.status === 200) {
          if (!this.model.image) {
            this.model.image = "";
          }
          this.model.image = data.data.link;
          let x: any = document.getElementById("image");
          x.value = "";
        } else {
          this.notification.warning("Tải ảnh không thành công");
        }
      });
      let x: any = document.getElementById("image");
      x.value = "";
    }
  };
  // chuẩn bị model trc khi save
  prepareModelBeforeSave = () => {
    let objAPI = Object.assign({}, this.model);
    objAPI.dateCreated = objAPI.dateCreated ? moment(objAPI.dateCreated).format("DD/MM/YYYY") : null;
    objAPI.dateUpdated = objAPI.dateUpdated  ? moment(objAPI.dateUpdated).format("DD/MM/YYYY"): null;
    return objAPI;
  };
  confirmBack = (status): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/cms/productservice/servicecategory"]);
    }
  };
  removeImage = () => {
    this.model.image = null;
    let x: any = document.getElementById('image');
    x.value = '';
  }
}
