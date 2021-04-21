import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CmsRoutes } from './cms.routing';
import { Error404Module } from '../errors/404/error-404.module';

@NgModule({
    imports: [
        RouterModule.forChild(CmsRoutes),
        Error404Module
    ]
})
export class CmsModule {
}
