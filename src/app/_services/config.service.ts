import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Subject, Observable } from 'rxjs';


// Create the injection token for the custom settings
export const TLA_CONFIG = new InjectionToken('tlaCustomConfig');

@Injectable({
    providedIn: 'root'
})
export class ConfigService
{
    // Private
    public _configSubject = new Subject<string>();
    public loadingSubject = new Subject<string>();
}