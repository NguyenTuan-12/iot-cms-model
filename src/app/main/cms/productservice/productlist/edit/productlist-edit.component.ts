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
import { BlogCategory } from 'src/app/_models/app/blog/Blog';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

setCulture("vi");

@Component({
  selector: "app-productlist-edit",
  templateUrl: "./productlist-edit.component.html",
  styleUrls: ["./productlist-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListEditComponent implements OnInit {
  public fields: FieldSettingsModel = { text: "name", value: "_id" };
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
  public lstCategory = [];
  public lstImgs =[];
  // Toolbar Item
  public toolbar: ToolbarInterface[];
  // Private
  private _unsubscribeAll: Subject<any>;
  @ViewChild("contentFull", { static: false })
  public contentFull: RichTextEditorComponent;
  @ViewChild("slider", { static: false })
  public slider: SliderComponent;
  @ViewChild("content", { static: false })
  public content: RichTextEditorComponent;
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
    private _imgurApiService :ImgurApiService
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
      summary: [
        "",
        [

          Validators.maxLength(500),
        ],
      ],
      content:["", [
        Validators.required,
        
      ]],
      price:[""],
      price_is_sale:[""],
      price_after_sale:[""],
      description:["",Validators.maxLength(2000)],
      image:[""],
      category:["",Validators.required],
      sendSms:[""]

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
    };
    async.waterfall([
      (cb)=>{
        this._coreService.Get("get-combo-product-category").subscribe(
          (res:any)=>{
            if(res.status ==200){
               this.lstCategory = res.data;
               return cb();
            }
          }
        )
      }
    ],(error,ok)=>{
      if (this.paramId) {
        this.getDetailData();
        this.editForm.get("code").disable();
      }
    })

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(()=>{
      if(this.flagState == 'view') {
        this.slider.disableBtn = false;
      }
    },200)
  }

  getDetailData = () => {
    this._coreService.Get('get-product/' + this.paramId).subscribe(data => {
      this.model = data.data;
      this.model.id = this.model._id;
      if(this.model && this.model.images){
        this.slider.imageUrls = _.map(this.model.images,'link');
      }else{
        this.slider.imageUrls =[];
      }
    })
  }
  getComboBox
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
      "app-bloglist-edit",
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
        this.editForm.get('title').disable();
        break;
      case ToolbarItem.BACK:
        if (this.editForm.dirty && this.editForm.touched) {
          this.modalService.open("confirm-back-modal");
        } else {
          this.router.navigate(["/cms/productservice/productlist"]);
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
      if(this.model.price_after_sale && !this.model.price) {
        this.notification.warning("Vui lòng nhập giá tiền!");
        return;
      }
      if(this.model.price < this.model.price_after_sale) {
        this.notification.warning("Giá tiền đã giảm phải nhỏ hơn hoặc bằng Giá tiền!");
        return;
      }
      if (!this.slider.imageUrls.length) {
        this.notification.warning("Vui lòng tải lên ảnh sản phẩm!");
        return;
      }
      if (this.flagState === 'new') {
        let objApiAdd = this.prepareModelBeforeSave();
        this._coreService
          .Post("create-product", objApiAdd)
          .subscribe((res) => {
            if(res && res.status == 200) {
              this.notification.addSuccess();
              this.router.navigate(["/cms/productservice/productlist"]);
            } else {
              this.notification.addError();
            }
          }, error => {
            let x = error._body ? JSON.parse(error._body) : null;
            if (x && x.errorCode == "ERROR_CODE_EXISTS") {
              this.notification.warning(
                "Mã sản phẩm đã tồn tại trong hệ thống. Vui lòng nhập lại!"
              );
            } else {
              this.notification.addError();
            }
          });
      }
      if (this.flagState === 'edit') {
        let objApiEdit = this.prepareModelBeforeSave();
        this._coreService
          .Post("update-product", objApiEdit)
          .subscribe((res) => {
            this.notification.editSuccess();
            this.router.navigate(["/cms/productservice/productlist"]);
            return;

          }, error => {
            this.notification.editError();
          });
      }
    }

  };
  // changeContentFull(e) {
  //   setTimeout(() => {
  //     let x = this.contentFull.getText();
  //     let y = x.trim();
  //     if(y === ""){
  //       this.editForm.controls['content_full'].setValue(y);
  //     }
  //   }, 200)
  // }
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
    console.log(files)
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

      async.each(files, (file, cb) => {
        setTimeout(() => {
          this._imgurApiService.upload(file).subscribe((data: any) => {
             if (data && data.status === 200) {
            let objPush = {
              name: file.name,
              link: data.data.link
            }
            if( !this.slider.imageUrls){
              this.slider.imageUrls= []
            }
            this.slider.imageUrls.push(
              data.data.link
              )
             }
            return cb();
          })
        }, 500);
      },
        (err, ok) => {
          console.log(this.slider.imageUrls);
        this.slider.flagMoveBtn = this.slider && this.slider.imageUrls && this.slider.imageUrls.length === 1 ? true : false
      })
      let x: any = document.getElementById("image");
      x.value = "";
      // this._coreService.uploadFile(data, "event").subscribe((res: any) => {
      //   if (res.status == 200) {
      //     let urls = res.data;
      //     if (!this.model.images) {
      //       this.model.images = [];
      //     }
      //     if( !this.slider.imageUrls){
      //       this.slider.imageUrls= []
      //     }
      //     if (urls.length > 0) {
      //       for(let i =0; i< urls.length;i++){

      //         this.slider.imageUrls.push(
      //           urls[i].url
      //        )
      //       }
      //     }
      //     let x: any = document.getElementById("image");
      //     x.value = "";
      //   }
      // });
    }
  }
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

        let fileUpload = files && files.length ? files[0] : null;
        this._imgurApiService.upload(fileUpload).subscribe((data: any) => {
          if (data && data.status === 200) {
            this.content.executeCommand("insertImage", {
              url:  data.data.link,
              cssClass: "rte-img",
            });
            // this.avatar = data.data.link;
            let x: any = document.getElementById("uploadImg2");
            x.value = null;
          } else {
            this.notification.warning("Tải ảnh không thành công");
          }
        });
      }
    }, 200);
  }
  // chuẩn bị model trc khi save
  prepareModelBeforeSave = () => {
    if(this.slider && this.slider.imageUrls){
      this.slider.imageUrls.forEach(element => {
        if(!this.model.images){
          this.model.images = [];
        }
        this.model.images.push({
          name:element,
          link: element
        })
      });
    }
    this.model.price_is_sale = this.model.price_is_sale ? this.model.price_is_sale : false;
    this.model.price_is_contact = this.model.price_is_contact ? this.model.price_is_contact : false;

    let objAPI = Object.assign({}, this.model);
    return objAPI;
  };
  confirmBack = (status): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/cms/productservice/productlist"]);
    }
  };

};
