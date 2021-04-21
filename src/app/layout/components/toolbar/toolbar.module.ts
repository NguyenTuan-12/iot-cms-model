import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports     : [
        RouterModule,
        BsDropdownModule.forRoot()
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
