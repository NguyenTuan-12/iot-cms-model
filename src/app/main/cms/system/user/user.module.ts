import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysUserComponent } from './user.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysUserEditComponent } from './edit/user-edit.component';
import { SystemUserService } from 'src/app/_services/system/systemuser.service';

const routes: Routes = [
  {
    path: '',
    component: SysUserComponent
  },
  {
    path: ':id',
    component: SysUserEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysUserComponent, SysUserEditComponent],
  providers: [CoreService, SystemUserService]
})
export class SysUserModule {}
