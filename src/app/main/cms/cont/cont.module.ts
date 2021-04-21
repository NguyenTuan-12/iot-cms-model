import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerRoutes } from './cont.routing';


@NgModule({
    imports: [
        RouterModule.forChild(CustomerRoutes)
    ],

})
export class AppContModule {
}
