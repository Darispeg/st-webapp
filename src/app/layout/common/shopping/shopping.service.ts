import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Shopping, ShoppingDetail } from "./shopping.model";
import { map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ShoppingService
{
    private _shopping: BehaviorSubject<Shopping | null> = new BehaviorSubject(null);
    private _shoppingDetail: BehaviorSubject<ShoppingDetail | null> = new BehaviorSubject(null);
    private _shoppingDetails: BehaviorSubject<ShoppingDetail[] | null> = new BehaviorSubject(null);
    
    ConstShoppingCar: Shopping = { key: '', total: 0, details:[]};
    
    constructor(private _httpClient: HttpClient){}

    get shopping$(): Observable<Shopping>
    {
        return this._shopping.asObservable();
    }

    get shoppingDetail$() : Observable<ShoppingDetail>
    {
        return this._shoppingDetail.asObservable();
    }

    get shoppingDetails$() : Observable<ShoppingDetail[]>
    {
        return this._shoppingDetails.asObservable();
    }

    getShoppingCar(): Observable<Shopping>
    {
        return this._shopping.pipe(
            take(1),
            map(() => {
                this._shopping.next(this.ConstShoppingCar);
                return this.ConstShoppingCar;
            })
        )
    }

    addDetailToCart(detail: ShoppingDetail) : Observable<ShoppingDetail>
    {
        return this.shoppingDetail$.pipe(
            take(1),
            map(() => {
                const update = this._shopping.value;
                update.details.push(detail);
                this._shopping.next(update);
                console.log(this._shopping.value);
                return detail;
            })
        )
    }
}
