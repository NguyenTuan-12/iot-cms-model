import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { ProductCategoryEditComponent } from './edit/productcategory-edit.component';
import { ProductCategoryComponent } from './productcategory.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoryComponent
  },
  {
    path: ':id',
    component: ProductCategoryEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ProductCategoryComponent, ProductCategoryEditComponent],
  providers: [CoreService,ImgurApiService]
})
export class ProductCategoryModule {}
