import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { Subject, throwError } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { Event } from "../../models/events.types";
import { EventsService } from "../events.service";
import { EventsListComponent } from "../list/list.component";


@Component({
    selector: 'areas-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsDetailsComponent implements OnInit, OnDestroy {

    _query: string = '';
    editMode: boolean = false;
    events: Event[];
    event: Event;

    eventForm: FormGroup;
    matcher = new MyErrorStatusMatcher();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _eventsListComponent: EventsListComponent,
        private _eventService: EventsService
    ){}

    ngOnInit(): void {
        this._eventsListComponent.matDrawer.open();

        this.eventForm = this._formBuilder.group({
            key: [''],
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            phone: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]*$")]],
            city: ['', [Validators.maxLength(50)]],
            category: ['', [Validators.maxLength(50)]],
            address: ['', [Validators.maxLength(50)]],
            location: ['', [Validators.maxLength(50)]],
            status: ['Active', [Validators.required]],
        });

        this._eventService.events$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Events: Event[]) => {
                this.events = Events;
                this._changeDetectorRef.markForCheck();
            });

        this._eventService.event$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Event: Event) => {
                this._eventsListComponent.matDrawer.open();
                this.event = Event;
                this.eventForm.patchValue(Event);
                this.toggleEditMode(Event.key ? false : true);
                this._changeDetectorRef.markForCheck();
            });

        if(this._eventsListComponent.searchInputControl.value != undefined)
        {
            this._query = this._eventsListComponent.searchInputControl.value;
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._eventsListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        if (!this.editMode && !this.event.key) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }

    deleteEvent() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Evento',
            message: 'Estas seguro de que quieres eliminar este usuario? Esta acción no tiene Retroceso!',
            actions: {
                confirm: {
                    label: 'Eliminar'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if(result === 'confirmed')
            {
                const key = this.event.key;
                const currentUserIndex = this.events.findIndex(item => item['key'] === key);
                const nextUserIndex = currentUserIndex + ((currentUserIndex === (this.events.length - 1)) ? -1 : 1);
                const nextUserId = (this.events.length === 1 && this.events[0].key === key) ? null : this.events[nextUserIndex].key;

                this._eventService.deleteEvent(key)
                    .pipe(
                        catchError((error) => {
                            this.snackBar(error)
                            return throwError(error);
                        })
                    )
                    .subscribe((isDeleted) => {
                        if (!isDeleted) {
                            return;
                        }
                        if (nextUserId) {
                            this._router.navigate(['../', nextUserId], { relativeTo: this._activatedRoute });
                        }
                        else {
                            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                        }

                        this._eventService.getEvents().subscribe();
                        this.snackBar('Evento eliminado correctamente');
                        this.toggleEditMode(false);
                    });

                this._changeDetectorRef.markForCheck();
            }
        })
    }

    updateEvent(): void {
        const _update = this.eventForm.getRawValue();

        if (_update.key === '') {
            this._eventService.createEvent(_update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe((Event) => {
                    this.event = Event;
                    this.toggleEditMode(false);
                    this._router.navigate(['../', this.event.key], { relativeTo: this._activatedRoute });
                    this.snackBar('Nuevo Evento Agregado Correctamente');
                });
        }
        else
        {
            this._eventService.updateEvent(_update.key, _update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe(() => {
                    this.toggleEditMode(false);
                    this._eventService.getEvents().subscribe();

                    this.snackBar('Evento Modificado Correctamente');
                });
        }
    }
    
    setStatus(status): void {
        this.eventForm.get('status').setValue(status);
        this.event.status = status;
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }
}
