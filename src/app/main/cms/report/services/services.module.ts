import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { ServicesComponent } from "./services.component";
import { GetGaraService } from 'src/app/_services/getgara.service';

const routes: Routes = [
  {
    path: "",
    component: ServicesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [ServicesComponent],
  providers: [CoreService, GetGaraService],
})
export class AppServicesModule {}
