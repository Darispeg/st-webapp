import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/users.types';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root'
})
export class UsersResolver implements Resolve<any>
{
    constructor(private _UserService: UsersService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]>
    {
        return this._UserService.getUsers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class UsersUserResolver implements Resolve<any>
{
    constructor(
        private _UserService: UsersService,
        private _router: Router
    ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User>
    {
        return this._UserService.getUserByKey(route.paramMap.get('key'))
                .pipe(
                    catchError((error) => {
                        console.error(error);
                        // Get the parent url
                        const parentUrl = state.url.split('/').slice(0, -1).join('/');

                        // Navigate to there
                        this._router.navigateByUrl(parentUrl);

                        // Throw an error
                        return throwError(error);
                    })
                );
    }
}
