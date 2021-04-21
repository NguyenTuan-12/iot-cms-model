import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysUserGroupComponent } from './usergroup.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysUserGroupEditComponent } from './edit/usergroup-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SysUserGroupComponent
  },
  {
    path: ':id',
    component: SysUserGroupEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysUserGroupComponent, SysUserGroupEditComponent],
  providers: [CoreService]
})
export class SysUserGroupModule {}
