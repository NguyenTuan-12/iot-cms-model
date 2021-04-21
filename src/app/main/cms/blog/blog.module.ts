import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogRoutes } from './blog.routing';


@NgModule({
    imports: [
        RouterModule.forChild(BlogRoutes)
    ],

})
export class BlogModule {
}
