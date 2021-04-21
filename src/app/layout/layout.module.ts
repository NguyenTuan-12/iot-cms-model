import { NgModule } from '@angular/core';

import { AppLayoutModule } from './applayout/applayout.module';


@NgModule({
    imports: [
        AppLayoutModule
    ],
    exports: [
        AppLayoutModule
    ]
})
export class LayoutModule
{
}
