import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/common/auth.service';
import { Router } from '@angular/router';

@Component({
    selector     : 'app-toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent
{
    username = '';
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private router: Router
    )
    {
        let userName = localStorage.getItem('username');
        this.username = userName || 'Test';
    }


    // Show profile
    showProfile = (): void => {
        this.router.navigate(['/sys/profile']);
    }

    // Sign Out App
    signOut = (): void => {
        this._authService.logout();
    }
}
