import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartnerRoutes } from './partner.routing';


@NgModule({
    imports: [
        RouterModule.forChild(PartnerRoutes)
    ],

})
export class PartnerModule {
}
