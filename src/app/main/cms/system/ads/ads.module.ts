import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysAdsComponent } from './ads.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysAdsEditComponent } from './edit/ads-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: SysAdsComponent
  },
  {
    path: ':id',
    component: SysAdsEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysAdsComponent, SysAdsEditComponent],
  providers: [CoreService, ImgurApiService]
})
export class SysAdsModule {}
