import { TlaSharedModule } from 'src/app/components/shared.module';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { ToolbarModule } from "@syncfusion/ej2-angular-navigations";

import { AppDashboardComponent } from "./dashboard.component";

import { CoreService } from "src/app/_services/core.service";
// High chart
import { Ng5SliderModule } from "ng5-slider";

const routes: Routes = [
  {
    path: "",
    component: AppDashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    // Syncfusion
    ToolbarModule,
    // Slider
    Ng5SliderModule,
    TlaSharedModule
  ],
  declarations: [
    AppDashboardComponent,
  ],
  exports: [
  ],
  providers: [CoreService]
})
export class AppDashboardModule {}
