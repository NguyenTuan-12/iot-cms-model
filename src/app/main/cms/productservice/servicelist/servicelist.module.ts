import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { ServiceListComponent } from './servicelist.component';
import { ServiceListEditComponent } from './edit/servicelist-edit.component';
import { ImgurApiService } from 'src/app/_services/imgur.service';


const routes: Routes = [
  {
    path: '',
    component: ServiceListComponent
  },
  {
    path: ':id',
    component: ServiceListEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ServiceListComponent, ServiceListEditComponent],
  providers: [CoreService,ToolbarService, LinkService, ImageService, HtmlEditorService,ImgurApiService]

})
export class ServiceListModule {}
