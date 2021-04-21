import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysSettingsComponent } from './settings.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  TableService,
} from "@syncfusion/ej2-angular-richtexteditor";
const routes: Routes = [
  {
    path: '',
    component: SysSettingsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysSettingsComponent],
  providers: [CoreService, ImgurApiService, ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,]
})
export class SysSettingsModule { }
