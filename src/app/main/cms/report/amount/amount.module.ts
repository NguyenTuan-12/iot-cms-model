import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AmountComponent } from "./amount.component";
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
} from "@syncfusion/ej2-angular-richtexteditor";
import { GetGaraService } from "src/app/_services/getgara.service";

const routes: Routes = [
  {
    path: "",
    component: AmountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [AmountComponent],
  providers: [
    CoreService,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,GetGaraService
  ],
})
export class AppAmountModule {}
