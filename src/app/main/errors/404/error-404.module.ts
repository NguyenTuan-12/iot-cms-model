import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { Error404Component } from './error-404.component';

const routes = [
    {
        path     : 'errors/error-404',
        component: Error404Component
    }
];

@NgModule({
    declarations: [
        Error404Component
    ],
    imports     : [
        RouterModule.forChild(routes)
    ]
})
export class Error404Module
{
}
