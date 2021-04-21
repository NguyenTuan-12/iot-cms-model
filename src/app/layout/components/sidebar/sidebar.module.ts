import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarComponent } from './sidebar.component';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';
import { CommonModule } from '@angular/common';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
    declarations: [
        SidebarComponent,
        SidebarItemComponent
    ],
    imports     : [
        RouterModule,
        CommonModule,
        TranslateModule,
        AccordionModule,
        BsDropdownModule.forRoot()
    ],
    exports     : [
        SidebarComponent,
        SidebarItemComponent
    ]
})
export class SidebarModule
{
}
