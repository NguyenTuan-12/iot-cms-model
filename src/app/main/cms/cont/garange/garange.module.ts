import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { CoreService } from 'src/app/_services/core.service';
import { AppCustomerGarange } from './garange.component';

const ContactRoutes: Routes = [
    {
        path: "",
        component: AppCustomerGarange
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(ContactRoutes),
        TlaSharedModule
    ],
    declarations: [AppCustomerGarange],
    exports: [],
    providers: [CoreService]
})
export class AppGarangeModule {
}
