import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { Observable, Subject, throwError } from "rxjs";
import { ItemsService } from "../items.service";
import { EventsListComponent } from "../list/list.component";
import { Item } from "../../models/items.types";
import { Ticket } from "../../models/tickets.types";
import { catchError } from "rxjs/operators";

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit, OnDestroy {

    @Input()
    event: Item;

    @Input()
    editMode: boolean = false;

    @Input()
    tickets$: Observable<Ticket[]>

    editModeTicket : boolean = false;
    SaveMode : string;
    ticketForm: FormGroup;
    selectedTicket: Ticket;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _eventsListComponent: EventsListComponent,
        private _formBuilder: FormBuilder,
        private _eventsService: ItemsService,
        private _snackBar: MatSnackBar,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
        this._eventsListComponent.matDrawer.open();

        this.ticketForm = this._formBuilder.group({
            key: [''],
            type: [''],
            price: [''],
            available: [''],
            eventKey: [''],
            additionalInformation: this._formBuilder.array([])
        });

        this.toggleTicketEditMode(false);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setStatus(status): void {
        this._changeDetectorRef.markForCheck();
    }

    toggleTicketEditMode(ticketMode: boolean | null = null): void {
        if (ticketMode === null) {
            this.editModeTicket = !this.editModeTicket;
        }
        else {
            this.editModeTicket = ticketMode;
        }

        this._changeDetectorRef.markForCheck();
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }

    toggleTickets(ticket: Ticket)
    {
        if ( this.selectedTicket && this.selectedTicket.key === ticket.key )
        {
            this.closeDetails();
            return;
        }

        this.selectedTicket = ticket;
    }

    closeDetails(): void
    {
        this.selectedTicket = null;
    }

    addTicket(): void
    {
        this.toggleTicketEditMode(true);

        this.ticketForm.patchValue(this.selectedTicket);

        this._changeDetectorRef.markForCheck();
    }

    editTicket(ticket : Ticket): void
    {
        this.toggleTicketEditMode(true);

        this.ticketForm.patchValue(ticket);

        this._changeDetectorRef.markForCheck();
    }

    saveTicket() : void
    {
        const _update = this.ticketForm.getRawValue();
        
        if (_update.key === '') {
            this._eventsService.createTicket(this.event.key, _update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe((ticket) => {
                    this.selectedTicket = ticket;
                    this.toggleTicketEditMode(false);
                    this.snackBar('Nuevo Usuario Agregado Correctamente');
                });
        }

        this.ticketForm.patchValue(null);
    }

    deleteTicket() : void
    {}
}