import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductServiceRoutes } from './productservice.routing';


@NgModule({
    imports: [
        RouterModule.forChild(ProductServiceRoutes)
    ],

})
export class ProductServiceModule {
}
