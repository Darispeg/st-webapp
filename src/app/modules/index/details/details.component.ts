import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { EventsService } from "app/modules/admin/events/events.service";
import { Event } from "app/modules/admin/models/events.types";
import { Ticket } from "app/modules/admin/models/tickets.types";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IndexListComponent } from '../list/list.component';

@Component({
    selector       : 'index-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexDetailsComponent implements OnInit, OnDestroy
{
    event: Event;
    selectedTicket: Ticket
    tickets$: Observable<Ticket[]>

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _eventsListComponent : IndexListComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _eventsService: EventsService, 
    ){}

    ngOnInit(): void {
        this._eventsListComponent.matDrawer.open();
      
        this._eventsService.event$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Event: Event) => {
                this.event = Event;
                this._changeDetectorRef.markForCheck();
            });

        this._eventsService.getTicketsEvent(this.event.key).subscribe();

        this.tickets$ = this._eventsService.tickets$;

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._eventsListComponent.matDrawer.close();
    }

    toggleDetails(detail: Ticket)
    {
        if ( this.selectedTicket && this.selectedTicket.key === detail.key )
        {
            this.closeDetails();
            return;
        }

        this.selectedTicket = detail;
    }

    closeDetails(): void
    {
        this.selectedTicket = null;
    }
}
