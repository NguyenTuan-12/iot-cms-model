import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { SysLinkComponent } from './links.component';

const routes: Routes = [
  {
    path: '',
    component: SysLinkComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysLinkComponent],
  providers: [CoreService]
})
export class SysLinksModule {}
