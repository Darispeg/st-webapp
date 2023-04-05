import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { Item } from "../../models/items.types";
import { Ticket } from "../../models/tickets.types";
import { ItemsService } from "../items.service";
import { FileComponentDialog } from "../files/file.component";
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
    items: Item[];
    item: Item;
    selectedTicket: Ticket;

    itemForm: FormGroup;
    matcher = new MyErrorStatusMatcher();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _itemsListComponent: EventsListComponent,
        private _itemsService: ItemsService,
        private dialog: MatDialog
    ){}

    ngOnInit(): void {
        this._itemsListComponent.matDrawer.open();

        this.itemForm = this._formBuilder.group({
            key: [''],
            name: ['', [Validators.required]],
            price: [1, [Validators.required]],
            stock: [1, [Validators.required]],
            unitOfMeasurement: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
            description: ['', [Validators.required]],
            category: ['', [Validators.maxLength(50)]]
        });

        this._itemsService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Events: Item[]) => {
                this.items = Events;
                this._changeDetectorRef.markForCheck();
            });

        this._itemsService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Event: Item) => {
                this._itemsListComponent.matDrawer.open();
                this.item = Event;
                this.itemForm.patchValue(Event);
                this.toggleEditMode(Event.key ? false : true);
                this._changeDetectorRef.markForCheck();
            });

        if(this._itemsListComponent.searchInputControl.value != undefined)
        {
            this._query = this._itemsListComponent.searchInputControl.value;
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._itemsListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        if (!this.editMode && !this.item.key) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }

    deleteItem() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Item',
            message: 'Estas seguro de que quieres eliminar este item del sistema? Esta acción no tiene Retroceso!',
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
                const key = this.item.key;
                const currentUserIndex = this.items.findIndex(item => item['key'] === key);
                const nextUserIndex = currentUserIndex + ((currentUserIndex === (this.items.length - 1)) ? -1 : 1);
                const nextUserId = (this.items.length === 1 && this.items[0].key === key) ? null : this.items[nextUserIndex].key;

                this._itemsService.deleteItem(key)
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

                        this._itemsService.getItems().subscribe();
                        this.snackBar('Item eliminado correctamente');
                        this.toggleEditMode(false);
                    });

                this._changeDetectorRef.markForCheck();
            }
        })
    }

    updateItem(): void {
        const _update = this.itemForm.getRawValue();

        if (_update.key === '') {
            this._itemsService.createItem(_update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe((Event) => {
                    this.item = Event;
                    this.toggleEditMode(false);
                    this._router.navigate(['../', this.item.key], { relativeTo: this._activatedRoute });
                    this.snackBar('Nuevo Item Agregado Correctamente');
                });
        }
        else
        {
            this._itemsService.updateItem(_update.key, _update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe(() => {
                    this.toggleEditMode(false);
                    this._itemsService.getItems().subscribe();

                    this.snackBar('Item Modificado Correctamente');
                });
        }
    }
    
    setStatus(status): void {
        this.itemForm.get('status').setValue(status);
        this.item.status = status;
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }

    openDialog(): void{
        const dialogRef = this.dialog.open(FileComponentDialog, {
            width: '600px',
            height: '500px',
            data: { eventKey : this.item.key, name : this.item.name, urlImage: this.item.urlImage }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Close', result);
        })
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
}
