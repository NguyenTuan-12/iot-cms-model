import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { ProductListComponent } from './productlist.component';
import { ProductListEditComponent } from './edit/productlist-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';


const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: ':id',
    component: ProductListEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ProductListComponent, ProductListEditComponent],
  providers: [CoreService,ToolbarService, LinkService, ImageService, HtmlEditorService,ImgurApiService]

})
export class ProductListModule {}
