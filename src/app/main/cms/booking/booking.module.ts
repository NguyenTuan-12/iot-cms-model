import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppBookingComponent } from './booking.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { CoreService } from 'src/app/_services/core.service';
import { AppBookingEditComponent } from './edit/booking-edit.component';

const BookingRoutes: Routes = [
    {
        path: "",
        component: AppBookingComponent,
    },
    {
        path: ":id",
        component: AppBookingEditComponent
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(BookingRoutes),
        TlaSharedModule
    ],
    declarations: [AppBookingComponent, AppBookingEditComponent],
    exports: [],
    providers: [CoreService]
})
export class BookingModule {
}
