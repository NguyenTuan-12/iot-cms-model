import { NgModule } from '@angular/core';

import { LoginModule } from './login/login.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';

@NgModule({
    imports: [
        // Authentication
        LoginModule,
        ForgotPasswordModule
    ]
})
export class AuthModule
{

}
