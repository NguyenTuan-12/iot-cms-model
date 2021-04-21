import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportRoutes } from './report.routing';


@NgModule({
    imports: [
        RouterModule.forChild(ReportRoutes)
    ],

})
export class AppReportModule {
}
