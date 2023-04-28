import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Shopping } from 'app/layout/common/shopping/shopping.model';
import { ShoppingService } from 'app/layout/common/shopping/shopping.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PaymentResolver implements Resolve<any>
{
    constructor(private _shoppingService: ShoppingService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Shopping>
    {
        return this._shoppingService.getShoppingCar();
    }
}