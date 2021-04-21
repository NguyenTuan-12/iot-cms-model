import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { BlogListComponent } from './bloglist.component';
import { BlogListEditComponent } from './edit/bloglist-edit.component';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { ImgurApiService } from 'src/app/_services/imgur.service';


const routes: Routes = [
  {
    path: '',
    component: BlogListComponent
  },
  {
    path: ':id',
    component: BlogListEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [BlogListComponent, BlogListEditComponent],
  providers: [CoreService,ToolbarService, LinkService, ImageService, HtmlEditorService,ImgurApiService]

})
export class BlogListModule {}
