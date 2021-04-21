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
import { Promotion } from "src/app/_models/app/system/Promotion";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as $ from "jquery";
import * as moment from "moment";
import * as async from "async";
import { RichTextEditorComponent } from "@syncfusion/ej2-angular-richtexteditor";
import { ImgurApiService } from "src/app/_services/imgur.service";

setCulture("vi");

@Component({
  selector: "app-promotion-edit",
  templateUrl: "./promotion-edit.component.html",
  styleUrls: ["./promotion-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class AppPromotionEditComponent implements OnInit {
  paramId: number;
  // Varriable Language
  flagState = "";
  model: Promotion = new Promotion();
  modelOrigin: Promotion = new Promotion();
  // language
  languages: any;
  selectedLanguage: any;

  // Data grid
  editForm: FormGroup;
  public mode: string;
  public modelDelete: any = [];

  lstPositions = [
    {
      id: "LEFT",
      name: "Trái",
    },
    {
      id: "RIGHT",
      name: "Phải",
    },
    {
      id: "ABOVE",
      name: "Trên",
    },
    {
      id: "BELOW",
      name: "Dưới",
    },
  ];

  fields = { text: "name", value: "id" };
  // Toolbar Item
  public toolbar: ToolbarInterface[];
  @ViewChild("content", { static: false })
  public content: RichTextEditorComponent;
  // Private
  private _unsubscribeAll: Subject<any>;
  // ejsCK
  public tools: object = {
    type: "Expand",
    items: [
      "Undo",
      "Redo",
      "|",
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "SubScript",
      "SuperScript",
      "|",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "|",
      "OrderedList",
      "UnorderedList",
      "|",
      "Indent",
      "Outdent",
      "|",
      "CreateLink",
      // "Image", (mặc đinh của ck)
      // event click tool tải ảnh customer
      {
        template:
          '<button type="button" class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
          '<div class="e-tbar-btn-text" style="font-weight: 500;"><i class="fa fa-picture-o" aria-hidden="true"></i></div></button>',
        tooltipText: "Insert Symbol",
        undo: true,
        click: this.onClick.bind(this),
      },
      "|",
      "ClearFormat",
      "Print",
      "SourceCode",
      "|",
      "FullScreen",
    ],
  };
  public quickTools = {
    image: [
      "Replace",
      "Align",
      "Caption",
      "Remove",
      "InsertLink",
      "-",
      "Display",
      "AltText",
      "Dimension",
    ],
  };
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
      name: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(255),
        ],
      ],
      dateFrom: ["", [Validators.required]],
      dateTo: ["", [Validators.required]],
      link: ["", [Validators.maxLength(255), Validators.required ]],
      description: ["", [Validators.maxLength(2000)]],
      content: ["", Validators.required],
      image: ["", []],
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
    }
  }

  getDetailData = () => {
    this._coreService.Get("get-promotion/" + this.paramId).subscribe((data) => {
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
      "app-syspromotion-edit",
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
          this.router.navigate(["/cms/productservice/promotion"]);
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
      if (
        this.model.dateFrom && this.model.dateTo &&
        moment(this.model.dateFrom, "DD/MM/YYYY").isAfter(
          moment(this.model.dateTo, "DD/MM/YYYY")
        )
      ) {
        this.notification.warning("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!");
        return;
      }
      let objSave = this.prepareModelBeforeSave();
      if (this.flagState === "new") {
        this._coreService.Post("create-promotion", objSave).subscribe(
          (res) => {
            this.notification.addSuccess();
            this.router.navigate(["/cms/productservice/promotion"]);
            return;
            return;
          },
          (error) => {
            this.notification.addError();
          }
        );
      }
      if (this.flagState === "edit") {
        this._coreService.Post("update-promotion", objSave).subscribe(
          (res) => {
            this.notification.editSuccess();
            this.router.navigate(["/cms/productservice/promotion"]);
            return;
          },
          (error) => {
            this.notification.editError();
          }
        );
      }
    }
  }
  // chuẩn bị model trc khi save
  prepareModelBeforeSave = () => {
    let objAPI = Object.assign({}, this.model);
    objAPI.dateFrom = objAPI && objAPI.dateFrom ? moment(objAPI.dateFrom).format("DD/MM/YYYY") : null;
    objAPI.dateTo = objAPI && objAPI.dateTo ? moment(objAPI.dateTo).format("DD/MM/YYYY") : null;
    return objAPI;
  };
  confirmBack = (status): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/cms/productservice/promotion"]);
    }
  };
   // validate space ejs-richeditor
   changeContentFull(e) {
    setTimeout(() => {
      let h = this.content.getText();
      let x = this.content.getHtml();
      let r = x.indexOf('img');
      let y = h.trim();
      if (y === "" && r < 0) {
        this.editForm.controls['content'].setValue(y);
        return;
      }
    }, 200)
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
      let fileUpload = files && files.length ? files[0] : null;
      this._imgurApiService.upload(fileUpload).subscribe((data: any) => {
        if (data && data.status === 200) {
          if (!this.model.image) {
            this.model.image = "";
          }
          this.model.image = data.data.link;
          let x: any = document.getElementById("image");
          x.value = null;
        } else {
          this.notification.warning("Tải ảnh không thành công");
        }
      });
      let x: any = document.getElementById("image");
      x.value = "";
    }
  };
  onClick() {
    document.getElementById("uploadImg2").click();
  }
  uploadImgContent(files: FileList) {
    setTimeout(() => {
      if (files.length > 0) {
        let data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append("files", files[i]);
          // check file > 5MB
          const fsize = files.item(i).size;
          const file = Math.round(fsize / 1024);
          if (file > 5120) {
            this.notification.warning("Vui lòng tải ảnh < 5MB");
            return;
          }
        }
        // this._coreService.uploadFile(data, "event").subscribe((res: any) => {
        //   if (res.status == 200) {
        //     this.content.executeCommand("insertImage", {
        //       url: res.data[0].url,
        //       cssClass: "rte-img",
        //     });
        //     let x: any = document.getElementById("uploadImg2");
        //     x.value = null;
        //   } else {
        //     this.notification.warning("Tải ảnh không thành công");
        //   }
        // });
        let fileUpload = files && files.length ? files[0] : null;
        this._imgurApiService.upload(fileUpload).subscribe((data: any) => {
          if (data && data.status === 200) {
            this.content.executeCommand("insertImage", {
              url: data.data.link,
              cssClass: "rte-img",
            });
            let x: any = document.getElementById("uploadImg2");
            x.value = null;
          } else {
            this.notification.warning("Tải ảnh không thành công");
          }
        });
      }
    }, 200);
  }
  removeImage = () => {
    this.model.image = null;
    let x: any = document.getElementById("image");
    x.value = "";
  };
  changeDate = (model, formName, inputValue) => {
    setTimeout(() => {
      const idDate = "#" + inputValue + "_input";
      let value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length === 0) {
        this[formName].get(model).setErrors({ required: true });
        return;
      } else if (
        value.length > 0 &&
        value.length < 6 &&
        patt.test(value.toLowerCase()) === true
      ) {
        this[formName].get(model).setErrors({ incorrect: true });
        return;
      } else if (value.length > 0 && value.length < 6) {
        this[formName].get(model).setErrors({ incorrect: true });
        return;
      } else if (value.length > 10) {
        this[formName].get(model).setErrors({ incorrect: true });
        return;
      } else if (value.length > 6 && value.length < 10) {
        this[formName].get(model).setErrors({ incorrect: true });
        return;
      } else {
        this[formName].get(model).clearValidators();
      }
      value = value.trim();
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
            $(idDate).val( n );
            this[formName].get(model).clearValidators();
          }
        }
      }
    }, 400);
  };
  checkUrl = (controlName) => {
    let value = this.model[controlName];
    if (value) {
      let resultCheck = this.globals.checkUrl(value);
      if (!resultCheck) {
        this.editForm.get(controlName).setErrors({ pattern: true });
        return;
      }
      else {
        this.editForm.get(controlName).clearValidators();
        return;
      }
    }
  };
}
