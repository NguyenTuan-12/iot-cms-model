import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPartnerListComponent } from './partnerlist.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { AppPartnerListEditComponent } from './edit/partnerlist-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: AppPartnerListComponent
  },
  {
    path: ':id',
    component: AppPartnerListEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [AppPartnerListComponent, AppPartnerListEditComponent],
  providers: [CoreService, ImgurApiService]
})
export class AppPartnerListModule {}
