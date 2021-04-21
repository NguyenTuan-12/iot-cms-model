import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysGarageComponent } from './garage.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysGarageEditComponent } from './edit/garage-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';

const routes: Routes = [
  {
    path: '',
    component: SysGarageComponent
  },
  {
    path: ':id',
    component: SysGarageEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysGarageComponent, SysGarageEditComponent],
  providers: [CoreService, ImgurApiService]
})
export class SysGarageModule { }
