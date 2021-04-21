import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPromotionComponent } from './promotion.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { AppPromotionEditComponent } from './edit/promotion-edit.component';
import { HtmlEditorService, ImageService, LinkService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: AppPromotionComponent
  },
  {
    path: ':id',
    component: AppPromotionEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [AppPromotionComponent, AppPromotionEditComponent],
  providers: [CoreService,ToolbarService, LinkService, ImageService, HtmlEditorService,ImgurApiService]
})
export class AppPromotionModule {}
