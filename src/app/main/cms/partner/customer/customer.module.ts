import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppCustomerComponent } from './customer.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { AppCustomerEditComponent } from './edit/customer-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: AppCustomerComponent
  },
  {
    path: ':id',
    component: AppCustomerEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [AppCustomerComponent, AppCustomerEditComponent],
  providers: [CoreService, ImgurApiService]
})
export class AppCustomerModule {}
