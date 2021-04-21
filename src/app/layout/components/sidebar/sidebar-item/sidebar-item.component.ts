import { Component, ViewEncapsulation,Input } from '@angular/core';
import { Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { NavigationService } from 'src/app/_services/navigation.service';
import { NavigationItem } from 'src/app/_models/NavigationItem';

@Component({
    selector     : 'app-sidebar-item',
    templateUrl  : './sidebar-item.component.html',
    styleUrls    : ['./sidebar-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarItemComponent
{
    @Input()
    item: NavigationItem;

    _router: any;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private navigationService: NavigationService,
        private router: Router
    )
    {
        this._router = router;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
}
