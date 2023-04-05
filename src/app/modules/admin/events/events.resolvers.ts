import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Item } from '../models/items.types';
import { ItemsService } from './items.service';

@Injectable({
    providedIn: 'root'
})
export class EventsResolver implements Resolve<any>
{
    constructor(private _EventService: ItemsService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item[]>
    {
        return this._EventService.getItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class EventsEventResolver implements Resolve<any>
{
    constructor(
        private _EventService: ItemsService,
        private _router: Router
    ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item>
    {
        return this._EventService.getItemByKey(route.paramMap.get('key'))
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
