import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../models/events.types';
import { EventsService } from './events.service';

@Injectable({
    providedIn: 'root'
})
export class EventsResolver implements Resolve<any>
{
    constructor(private _EventService: EventsService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event[]>
    {
        return this._EventService.getEvents();
    }
}

@Injectable({
    providedIn: 'root'
})
export class EventsEventResolver implements Resolve<any>
{
    constructor(
        private _EventService: EventsService,
        private _router: Router
    ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event>
    {
        return this._EventService.getEventByKey(route.paramMap.get('key'))
                .pipe(
                    catchError((error) => {
                        console.error(error);
                        const parentUrl = state.url.split('/').slice(0, -1).join('/');
                        this._router.navigateByUrl(parentUrl);
                        return throwError(error);
                    })
                );
    }
}
