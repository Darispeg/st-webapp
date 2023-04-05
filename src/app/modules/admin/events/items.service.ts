import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { environment } from "environments/environment";
import { map, take, tap, switchMap, filter } from 'rxjs/operators';
import { Item } from "../models/items.types";
import { Ticket } from "../models/tickets.types";


@Injectable({
    providedIn: 'root'
})
export class
ItemsService
{
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Item[] | null> = new BehaviorSubject(null);
    private _tickets: BehaviorSubject<Ticket[] | null> = new BehaviorSubject(null);

    private _new:string = '00000000-0000-0000-0000-000000000000';

    constructor(private _httpClient: HttpClient){}

    get items$(): Observable<Item[]>
    {
        return this._items.asObservable();
    }

    get item$(): Observable<Item>
    {
        return this._item.asObservable();
    }

    get tickets$(): Observable<Ticket[]>
    {
        return this._tickets.asObservable();
    }

    getItems(): Observable<Item[]>
    {
        return this._httpClient.get<Item[]>(`${environment.APIurl}/events`)
        .pipe(
            tap((events) => {
                this._items.next(events);
            })
        );
    }

    getItemByKey(key: string): Observable<Item>
    {
        if(key === this._new)
        {
            return this._item.pipe(
                take(1),
                map(() => {
                    const event : Item = {
                        key : '',
                        name: '',
                        category : '',
                        stock : 1,
                        unitOfMeasurement : '',
                        price : 0,
                        description : '',
                        status: 'active',
                        urlImage: '',
                    };
                    this._item.next(event);
                    return event;
                })
            );
        }

        return this._items.pipe(
            take(1),
            map((Events) => {
                const Event = Events.find(item => item['key'] ===  key) || null;
                this._item.next(Event);
                return Event;
            }),
            switchMap((Event) => {
                if ( !Event )
                {
                    return throwError(`No se pudo encontrar el evento con la clave ${key}!`);
                }
                return of(Event);
            })
        );
    }

    createItem(newItem: Item): Observable<Item>
    {
        return this.items$.pipe(
            take(1),
            switchMap(items => this._httpClient.post<Item>(`${environment.APIurl}/events`, newItem).pipe(
                map((newItem) => {
                    this._items.next([newItem, ...items]);
                    return newItem;
                })
            ))
        )
    }

    updateItem(key: string, _update: Item): Observable<Item>
    {
        return this.items$.pipe(
            take(1),
            switchMap(events => this._httpClient.put<Item>(`${environment.APIurl}/events/${key}`, _update)
            .pipe(
                map((updateEvent) => {
                    const index = events.findIndex(item => item['key'] === key);
                    events[index] = updateEvent;
                    this._items.next(events);
                    return updateEvent;
                }),
                switchMap(updateEvent => this.item$.pipe(
                    take(1),
                    filter(item => item && item['key'] === key),
                    tap(() => {
                        this._item.next(updateEvent);
                        return updateEvent;
                    })
                ))
            ))
        );
    }

    deleteItem(key: string): Observable<boolean>
    {
        return this.items$.pipe(
            take(1),
            switchMap(events => this._httpClient.delete(`${environment.APIurl}/events/${key}`)
            .pipe(
                map((isDeleted: boolean) => {
                    const index = events.findIndex(item => item['key'] === key);
                    events.splice(index, 1);
                    this._items.next(events);
                    return isDeleted;
                })
            ))
        )
    }

    getTicketsEvent(eventKey: string): Observable<Ticket[]>
    {
        return this._httpClient.get<Ticket[]>(`${environment.APIurl}/events/${eventKey}/tickets`)
        .pipe(
            tap((tickets) => {
                this._tickets.next(tickets);
            })
        );
    }

    createTicket(eventKey: string, newTicket: Ticket): Observable<Ticket>
    {
        newTicket.eventKey = eventKey;
        return this.tickets$.pipe(
            take(1),
            switchMap(tickets => this._httpClient.post<Ticket>(`${environment.APIurl}/events/${eventKey}/tickets`, newTicket).pipe(
                map((newTicket) => {
                    if(!tickets)
                        this._tickets.next([newTicket, ...[]]);
                    else
                        this._tickets.next([newTicket, ...tickets]);
                    return newTicket;
                })
            ))
        )
    }
}
