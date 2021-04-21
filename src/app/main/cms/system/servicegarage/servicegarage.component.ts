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
  VirtualScrollService,
  GridComponent,
  EditSettingsModel,
  DataStateChangeEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { Menu } from "src/app/_models/app/system/Menu";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as $ from "jquery";
import * as moment from "moment";
import * as async from "async";
import { ServiceGara } from "src/app/_models/app/system/ServiceGara";

setCulture("vi");

@Component({
  selector: "cms-app-servicegarage",
  templateUrl: "./servicegarage.component.html",
  styleUrls: ["./servicegarage.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceGarageComponent implements OnInit {
  paramId: number;
  // Varriable Language
  flagState = "";
  model: ServiceGara = new ServiceGara();
  modelOrigin: ServiceGara = new ServiceGara();
  // language
  languages: any;
  selectedLanguage: any;
  fields = { text: "name", value: "_id" };
  public lstGarages = [];
  public lstCategoryService = [];
  public lstServicesClone = [];
  public query = new Query();
  // Data grid
  editForm: FormGroup;
  serviceForm: FormArray = this._formBuilder.array([]);
  public mode: string;
  public modelDelete: any = [];
  // Toolbar Item
  public toolbar: ToolbarInterface[];
  // Private
  private _unsubscribeAll: Subject<any>;
  flagCheckDisable: any;
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

    // Set language
    this.languages = this.globals.languages;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      garage_id: ["", Validators.required],
      serviceForm: this.serviceForm,
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    // this.addValueEvaluate();
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
      this.getComboBoxData().then(() => {
        this.getDetailData();
      });
    } else {
      this.getComboBoxData();
    }
  }
  createEvaluateRule(): FormGroup {
    return this._formBuilder.group({
      // value: ['', [Validators.required,Validators.maxLength(30),Validators.minLength(2)]],
      serviceName: new FormControl({
        value: "",
        disabled: this.flagCheckDisable,
      }),
      priceService: new FormControl({
        value: "",
        disabled: this.flagCheckDisable,
      }),
      garage_price_is_contact: new FormControl({
        value: "",
        disabled: this.flagCheckDisable,
      }),
    });
  }
  public addValueEvaluate() {
    let objPram = {
      _id: null,
    };
    if (!this.serviceForm) {
      this.serviceForm = this._formBuilder.array([]);
    }
    if (!this.model.lstServices) {
      this.model.lstServices = [];
    }
    this.serviceForm.push(this.createEvaluateRule());
    this.model.lstServices.push(objPram);
  }

  getComboBoxData = () => {
    return new Promise((resolve, reject) => {
      this._coreService.Get("get-combo-service").subscribe((res: any) => {
        if (res.status == 200) {
          this.lstCategoryService = res.data;
          resolve(true);
        }
      });
      this._coreService.Get("get-list-garage").subscribe((res: any) => {
        if (res.status == 200) {
          this.lstGarages = res.data.data;
          resolve(true);
        }
      });
    });
  };
  changeService(serviceId, event) {
    setTimeout(() => {
      if (event.isInteracted) {
        if (event.itemData._id) {
          let item = _.filter(this.model.lstServices, (item) => {
            return event.itemData._id == item.serviceId;
          });
          let index = _.findLastIndex(this.model.lstServices, (item) => {
            return event.itemData._id == item.serviceId;
          });
          this.model.lstServices[index].serviceId = event.itemData._id;
          if (item && item.length > 1 && index > -1) {
            this.serviceForm.removeAt(index);
            this.model.lstServices.splice(index, 1);
            //this.changeCourse();
            // this.model.councilManagers.splice(index, 1);
          } else {
            // gán tiên
            let item1 = _.find(this.lstCategoryService, (item) => {
              return event.itemData._id == item._id;
            });
            let index1 = _.findIndex(this.model.lstServices, (item) => {
              return event.itemData._id == item.serviceId;
            });

            this.model.lstServices[index1].garage_price =
              item1 && item1.price ? item1.price : 0;
            this.model.lstServices[index1].garage_price_is_contact =
              item1 && item1.price_is_contact ? item1.price_is_contact : false;
            if (this.model.lstServices[index1].garage_price_is_contact) {
              this.serviceForm.controls[index1].get("priceService").disable();
            } else {
              this.serviceForm.controls[index1].get("priceService").enable();
            }
          }
        }
      }
    }, 200);
  }
  changePrice = (price, index) => {
    if (price) {
      this.lstServicesClone[index].garage_price = price;
    }
  }
  changeContact(index) {
    let y = this.model.lstServices[index].garage_price;
    if (this.model.lstServices[index].garage_price_is_contact) {
      if (index > -1) {
        this.model.lstServices[index].garage_price = 0;
      }
      this.serviceForm.controls[index].get("priceService").disable();
    } else {
      this.model.lstServices[index].garage_price_is_contact = false;
      this.model.lstServices[index].garage_price = this.lstServicesClone[index].garage_price;
      this.serviceForm.controls[index].get("priceService").enable();
    }
  }

  getDetailData = () => {
    this._coreService.Get("get-menu/" + this.paramId).subscribe((data) => {
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
    this.toolbar = this.globals.buildToolbar("app-menu-edit", toolbarList);
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
          this.router.navigate(["/cms/system/servicegarage"]);
        }
        break;
      default:
        break;
    }
  };
  saveData() {
    if (!this.model.garage_id) {
      this.notification.warning("Vui lòng chọn dịch vụ!");
      return;
    }
    if (!this.model.lstServices || (this.model.lstServices && !this.model.lstServices.length)) {
      this.notification.warning("Vui lòng thêm dịch vụ!");
      return;
    }
    for (let i in this.model.lstServices) {
      if (!this.model.lstServices[i].serviceId) {
        this.notification.warning("Vui lòng điền đầy đủ thông tin cần thiết của dịch vụ!");
        return;
      }
    }
    if (!this.editForm.valid) {
      this.notification.warning("Cập nhật không thành công");
      this.editForm.markAllAsTouched();
      return;
    } else {
      let objApiAdd = this.prepareModelBeforeSave();
      let index = _.findIndex(objApiAdd.lstServices, (item) => {
        return item.serviceId == null;
      });
      if (!objApiAdd.lstServices || index > -1) {
        this.notification.warning("Vui lòng chọn dịch vụ cho Garage!");
        return;
      }
      this._coreService.Post("update-service-by-garage", objApiAdd).subscribe(
        (res) => {
          this.notification.addSuccess();
          this.router.navigate(["/cms/system/servicegarage"]);
          return;
        },
        (error) => {
          this.notification.addError();
        }
      );
    }
  }
  // chuẩn bị model trc khi save
  prepareModelBeforeSave = () => {
    let objAPI = Object.assign({}, this.model);
    if (objAPI.lstServices && objAPI.lstServices.length) {
      objAPI.lstServices.forEach((ele) => {
        ele._id = ele.serviceId ? ele.serviceId : null;
      });
    }
    return objAPI;
  };
  confirmBack = (status): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/cms/system/servicegarage"]);
    }
  };
  changeGarage(garageId) {
    if (garageId && garageId != "") {
      this._coreService
        .Get("get-service-by-garage?garage_id=" + garageId)
        .subscribe((res) => {
          if (res.status == 200) {
            this.lstServicesClone = res && res.data ? _.cloneDeep(res.data) : [];
            this.model.lstServices = res && res.data ? res.data : [];
            if (res && res.data) {
              this.serviceForm = this._formBuilder.array([]);
              for (let i = 0; i < res.data.length; i++) {
                this.serviceForm.push(this.createEvaluateRule());
                this.model.lstServices[i].serviceId = res.data[i].serviceId._id;
                this.model.lstServices[i].garage_price = res.data[i]
                  .garage_price
                  ? res.data[i].garage_price
                  : 0;
                this.model.lstServices[i].garage_price_is_contact =
                  res.data[i].garage_price_is_contact;
                if (this.model.lstServices[i].garage_price_is_contact) {
                  this.serviceForm.controls[i].get("priceService").disable();
                } else {
                  this.serviceForm.controls[i].get("priceService").enable();
                }
              }
              this.editForm.setControl("serviceForm", this.serviceForm);
            } else {
              this.addValueEvaluate();
            }
          }
        });
    }
  }
  removeService(serviceId) {
    let index = _.findIndex(this.model.lstServices, (item) => {
      return serviceId == item._id;
    });
    if (index > -1) {
      this.serviceForm.removeAt(index);
      this.model.lstServices.splice(index, 1);
    }
  }
  public onFilteringOtherList(e, lst) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(lst, this.query);
  }
}
