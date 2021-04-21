import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysMenuComponent } from './menu.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysMenuEditComponent } from './edit/menu-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SysMenuComponent
  },
  {
    path: ':id',
    component: SysMenuEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysMenuComponent, SysMenuEditComponent],
  providers: [CoreService]
})
export class SysMenuModule {}
