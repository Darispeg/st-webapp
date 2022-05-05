import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { environment } from "environments/environment";
import { map, take, tap, switchMap, filter } from 'rxjs/operators';
import { Event } from "../models/events.types";


@Injectable({
    providedIn: 'root'
})
export class
EventsService
{
    private _event: BehaviorSubject<Event | null> = new BehaviorSubject(null);
    private _events: BehaviorSubject<Event[] | null> = new BehaviorSubject(null);

    private _new:string = '00000000-0000-0000-0000-000000000000';

    constructor(private _httpClient: HttpClient){}

    get events$(): Observable<Event[]>
    {
        return this._events.asObservable();
    }

    get event$(): Observable<Event>
    {
        return this._event.asObservable();
    }

    getEvents(): Observable<Event[]>
    {
        return this._httpClient.get<Event[]>(`${environment.APIurl}/events`)
        .pipe(
            tap((events) => {
                this._events.next(events);
            })
        );
    }

    getEventByKey(key: string): Observable<Event>
    {
        if(key === this._new)
        {
            return this._event.pipe(
                take(1),
                map(() => {
                    const event : Event = {
                        key : '',
                        name: '',
                        category : '',
                        description : '',
                        address : '',
                        city : '',
                        phone: '',
                        location : '',
                        dateTime : undefined,
                        status: 'active'
                    };
                    this._event.next(event);
                    return event;
                })
            );
        }

        return this._events.pipe(
            take(1),
            map((Events) => {
                const Event = Events.find(item => item['key'] ===  key) || null;
                this._event.next(Event);
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

    createEvent(newEvent: Event): Observable<Event>
    {
        return this.events$.pipe(
            take(1),
            switchMap(events => this._httpClient.post<Event>(`${environment.APIurl}/events`, newEvent).pipe(
                map((newEvent) => {
                    this._events.next([newEvent, ...events]);
                    return newEvent;
                })
            ))
        )
    }

    updateEvent(key: string, _update: Event): Observable<Event>
    {
        return this.events$.pipe(
            take(1),
            switchMap(events => this._httpClient.put<Event>(`${environment.APIurl}/events/${key}`, _update)
            .pipe(
                map((updateEvent) => {
                    const index = events.findIndex(item => item['key'] === key);
                    events[index] = updateEvent;
                    this._events.next(events);
                    return updateEvent;
                }),
                switchMap(updateEvent => this.event$.pipe(
                    take(1),
                    filter(item => item && item['key'] === key),
                    tap(() => {
                        this._event.next(updateEvent);
                        return updateEvent;
                    })
                ))
            ))
        );
    }

    deleteEvent(key: string): Observable<boolean>
    {
        return this.events$.pipe(
            take(1),
            switchMap(events => this._httpClient.delete(`${environment.APIurl}/events/${key}`)
            .pipe(
                map((isDeleted: boolean) => {
                    const index = events.findIndex(item => item['key'] === key);
                    events.splice(index, 1);
                    this._events.next(events);
                    return isDeleted;
                })
            ))
        )
    }
}
