import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { ServiceCategoryComponent } from './servicecategory.component';
import { ServiceCategoryEditComponent } from './edit/servicecategory-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: ServiceCategoryComponent
  },
  {
    path: ':id',
    component: ServiceCategoryEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ServiceCategoryEditComponent, ServiceCategoryComponent],
  providers: [CoreService,ImgurApiService]
})
export class ServiceCategoryModule {}
