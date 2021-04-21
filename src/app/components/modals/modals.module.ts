import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ModalComponent } from "./modals.component";
import { ConfirmModalComponent } from './confirm-modals.component';

@NgModule({
  imports: [],
  declarations: [ModalComponent, ConfirmModalComponent],
  exports: [ModalComponent, ConfirmModalComponent]
})
export class ModalModule {}
