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
import { Settings } from "src/app/_models/app/system/Settings";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { ImgurApiService } from 'src/app/_services/imgur.service';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
  RichTextEditorComponent,
  NodeSelection,
} from "@syncfusion/ej2-angular-richtexteditor";
setCulture("vi");

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  providers: [
    FilterService,
    VirtualScrollService,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SysSettingsComponent implements OnInit {
  paramId: number;
  // Varriable Language
  flagState = "";
  model: Settings = new Settings();
  modelOrigin: Settings = new Settings();
  // language
  languages: any;
  selectedLanguage: any;
  videoForm: FormGroup;

  // modal video
  public modelVideo;
  // tắt thuộc tính không cho chèn iframe vào
  public enableSanitixze: boolean = false;
  // cờ validate sài iframe
  public flagValidateIframe: boolean;
  public ranges: Range;
  public selection: NodeSelection = new NodeSelection();
  public typeAlbum: any;
  // Data grid
  editForm: FormGroup;
  public mode: string;
  public modelDelete: any = [];
  public dataAlbum = [];
  public lstGallery = [];
  public totalImg: any;
  public typeUrl;
  public linkUrl;
  // Toolbar Item
  public toolbar: ToolbarInterface[];
  @ViewChild("contentFull", { static: false })
  public contentFull: RichTextEditorComponent;
  // ejsCK
  public tools: object = {
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
      // "Image",
      // event click tool tải ảnh
      {
        tooltipText: "Insert Images",
        undo: true,
        click: this.onClick.bind(this),
        template:
          '<button type="button" class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
          '<div class="e-tbar-btn-text" style="font-weight: 500;"><i class="fa fa-picture-o" aria-hidden="true"></i></div></button>',
      },
      {
        tooltipText: "Insert Video",
        undo: true,
        click: this.onClickVideo.bind(this),
        template:
          '<button type="button" class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
          '<div class="e-tbar-btn-text" style="font-weight: 500;"><i class="fa fa-youtube" aria-hidden="true"></i></div></button>',
      },
      {
        tooltipText: "Insert Album",
        undo: true,
        click: this.onClickAlbum.bind(this),
        template:
          '<button type="button" class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
          '<div class="e-tbar-btn-text" style="font-weight: 500;"><i class="fa fa-folder" aria-hidden="true"></i></div></button>',
      },
      // customer table
      "CreateTable",
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
    table: [
      "tableHeader",
      "tableRows",
      "tableColumns",
      "backgroundColor",
      "-",
      "tableRemove",
      "alignments",
      "tableCellVerticalAlign",
      "styles",
    ],
  };
  public Editor = ClassicEditor;
  public onReady(editor) {
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element
    );
  }

  public iframe: object = { enable: true };
  public insertImageSettings = {
    saveUrl: "http://download.tlavietnam.vn:6800/api/upload?Folder=admin/event",
  };
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
    private imgurService: ImgurApiService,

  ) {
    // Set language
    this.languages = this.globals.languages;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      logo: ["", [Validators.maxLength(100)]],
      phone: ["", Validators.required],
      phoneDescription: [""],
      address: [
        "",
        [
          Validators.maxLength(2000),
          Validators.required,
          this.globals.noWhitespaceValidator,
        ],
      ],
      email: [
        "",
        [
          Validators.email,
          Validators.maxLength(100),
          Validators.pattern(
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ),
          Validators.required
        ],
      ],
      name: [
        "",
        [
          Validators.maxLength(255),
          Validators.required,
          this.globals.noWhitespaceValidator,
        ],
      ],
    });
    this.videoForm = this._formBuilder.group({
      modelVideo: [""],
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

    this.getDetailData();
  }

  getDetailData = () => {
    this._coreService.Get("get-settings").subscribe((data) => {
      if (data && data.data) {
        this.model = data.data;
        if (this.model._id) {
          this.model.id = this.model._id;
        }
      }
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
      "app-syssettings-edit",
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
          this.router.navigate(["/cms/system/settings"]);
        }
        break;
      default:
        break;
    }
  };
  saveData() {
    if (!this.model.logo || this.model.logo == "") {
      this.notification.warning("Vui lòng tải lên Logo!");
      return;
    }
    if (!this.editForm.valid) {
      this.notification.warning("Cập nhật không thành công");
      this.editForm.markAllAsTouched();
      for (const key of Object.keys(this.editForm.controls)) {
        if (this.editForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          if (invalidControl) {
            if (invalidControl.querySelector("input")) {
              invalidControl.querySelector("input").focus();
            } else {
              invalidControl.focus();
            }
            break;
          }
        }
      }
      return;
    } else {
      let objApiEdit = this.prepareModelBeforeSave();
      this._coreService.Post("update-settings", objApiEdit).subscribe(
        (res) => {
          if (res && res.status == 200) {
            this.notification.editSuccess();
            this.router.navigate(["/cms/system/settings"]);
          } else {
            this.notification.warning("Cập nhật không thành công!");
          }
        },
        (error) => {
          this.notification.warning("Cập nhật không thành công!");
        }
      );
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
      this.router.navigate(["/cms/system/syssettings"]);
    }
  };

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
      this.imgurService.upload(fileUpload).subscribe((data: any) => {
        if (data && data.status === 200) {
          if (!this.model.logo) {
            this.model.logo = "";
          }
          this.model.logo = data.data.link;
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
  checkPhoneNumber = (model, formName) => {
    if (this.model && this.model[model] && this.model[model].length > 0) {
      let isSpace = this.model[model].trim() == "" ? true : false;
      if (isSpace) {
        this[formName].get(model).setErrors({ required: true });
        return;
      }
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
      this[formName].get(model).setErrors({ required: true });
      return;
    }
  };
  changeContentFull(e) {
    setTimeout(() => {
      let h = this.contentFull.getText();
      let x = this.contentFull.getHtml();
      let r: any; // check img
      let f: any; // check iframe
      let t: any; // check table

      if (x) {
        // tìm vị trí của thẻ images và thẻ iframe
        r = x.indexOf("img");
        f = x.indexOf("iframe");
        t = x.indexOf("table");
      }
      let y = h.trim();
      // nếu có thì setValue
      if (y === "" && r < 0 && f < 0 && t < 0) {
        this.editForm.controls["phone"].setValue(y);
        return;
      }
    }, 200);
  }
  // event click tải ảnh
  onClick() {
    document.getElementById("uploadImg").click();
  }
  // upload ảnh ejs-richeditor
  uploadImg(files: FileList) {
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
        this._coreService.uploadFile(data, "blog").subscribe((res: any) => {
          if (res.status == 200) {
            let clonearr = _.cloneDeep(res.data);
            let typeUrl1 = clonearr[0].url;
            let m = typeUrl1.lastIndexOf(".");
            let kq = typeUrl1.slice(m + 1);
            if (kq == "jpg" || kq == "png" || kq == "gif") {
              this.typeUrl = "IMAGE";
            } else if (
              kq == "mp4" ||
              kq == "mp3" ||
              kq == "mov" ||
              kq == "wmv" ||
              kq == "avi"
            ) {
              this.typeUrl = "VIDEO";
            }
            this.linkUrl = res.data[0].url;
            let body1 = {
              url: this.linkUrl,
              type: this.typeUrl,
            };
            this.lstGallery.push(body1);
            this.contentFull.executeCommand("insertImage", {
              url: res.data[0].url,
              cssClass: "rte-img",
            });
            let x: any = document.getElementById("uploadImg");
            x.value = null;
          } else {
            this.notification.warning("Tải ảnh không thành công");
          }
        });
      }
    }, 200);
  }
  // onclick upvideo
  onClickVideo() {
    this.contentFull.focusIn();
    this.ranges = this.selection.getRange(document);
    this.modalService.open("macca-video-modal");
  }
  // push iframe video
  confirmYoutube(status) {
    if (status === "cancel") {
      this.modalService.close("macca-video-modal");
      this.videoForm.get("modelVideo").setValidators(null);
      this.modelVideo = "";
    } else {
      // nếu ko dữ liệu thì ko cho push vào ejs-richeditor và đống popup
      if (this.modelVideo === "" || this.modelVideo === undefined) {
        this.modalService.close("macca-video-modal");
        return;
      }
      // nếu sai link thì ko cho push vào ejs-richeditor vào ko đóng popup
      if (this.flagValidateIframe === false) {
        return;
      } else {
        setTimeout(() => {
          // tạo iframe
          let elementIframe = document.createElement("iframe");
          let elementBr = document.createElement("br");
          let m = this.modelVideo.indexOf("=");
          let n =
            this.modelVideo.indexOf("&") > -1
              ? this.modelVideo.indexOf("&")
              : this.modelVideo.length;

          let kq = this.modelVideo.slice(m + 1, n);
          let kq1 = "#" + kq;

          elementIframe.setAttribute(
            "src",
            "https://www.youtube.com/embed/" + kq
          );
          elementIframe.setAttribute("width", "560");
          elementIframe.setAttribute("height", "315");
          elementIframe.setAttribute("frameborder", "0");
          elementIframe.setAttribute("id", kq);
          // pushs vào vị trị focus
          this.ranges.insertNode(elementIframe);

          this.modalService.close("macca-video-modal");
          this.modelVideo = "";
          this.contentFull.focusOut();
          setTimeout(() => {
            let iframe1: any = document.getElementById("content_full");
            iframe1.addEventListener("onkeyup ", function (event) {
              event.keycode = 13;
            });
          }, 500);
        }, 200);
      }
    }
  }
  // onclick chọn album
  onClickAlbum() {
    this.contentFull.focusIn();
    this.ranges = this.selection.getRange(document);
    this.modalService.open("macca-album-modal");
    this.getListImage();
  }
  getListImage(page?: number) {
    setTimeout(() => {
      this._coreService
        .Post("/api/data-master/media/", {
          page: page ? page : 0,
          size: 12,
        })
        .subscribe((res: any) => {
          this.dataAlbum =
            res && res.data && res.data.content ? res.data.content : [];
          this.totalImg = res.data.totalElements;
        });
    }, 200);
  }
  removeImage = () => {
    this.model.logo = null;
    let x: any = document.getElementById('image');
    x.value = '';
  }
}
