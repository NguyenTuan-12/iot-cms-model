import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { ServiceGarageComponent } from './servicegarage.component';


const routes: Routes = [
  {
    path: '',
    component: ServiceGarageComponent
  },
  
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ServiceGarageComponent ],
  providers: [CoreService]
})
export class ServiceGarageModule {}
