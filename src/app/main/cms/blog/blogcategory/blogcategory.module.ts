import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { BlogCategoryComponent } from './blogcategory.component';
import { BlogCategoryEditComponent } from './edit/blogcategory-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BlogCategoryComponent
  },
  {
    path: ':id',
    component: BlogCategoryEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [BlogCategoryComponent, BlogCategoryEditComponent],
  providers: [CoreService]
})
export class BlogGroupModule {}
