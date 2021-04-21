import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../_services/config.service';


@Component({
    selector     : 'app-layout',
    templateUrl  : './applayout.component.html',
    styleUrls    : ['./applayout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutCompnent implements OnInit, OnDestroy
{
    appConfig: any = {
        showLayout: 'false'
    };
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ConfigService} _configService
     */
    constructor(
        private _configService: ConfigService
    )
    {
        // Set the defaults
        // this.navigation = navigation;

        this._configService._configSubject.subscribe((data) => {
            this.appConfig.showLayout = data;
        })
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
