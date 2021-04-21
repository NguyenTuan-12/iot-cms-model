import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { CoreService } from 'src/app/_services/core.service';
import { AppCustomerInsurranceComponent } from './insurrance.component';

const ContactRoutes: Routes = [
    {
        path: "",
        component: AppCustomerInsurranceComponent
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(ContactRoutes),
        TlaSharedModule
    ],
    declarations: [AppCustomerInsurranceComponent],
    exports: [],
    providers: [CoreService]
})
export class AppInsurranceModule {
}
