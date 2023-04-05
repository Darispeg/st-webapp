import { OverlayRef } from "@angular/cdk/overlay";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ItemsService } from "../items.service";
import { EventsListComponent } from "../list/list.component";
import { Item } from "../../models/items.types";
import { FileComponentDialog } from "../files/file.component";

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html'
})
export class BasicInfoComponent implements OnInit, OnDestroy  {

    itemForm: FormGroup;
    matcher = new MyErrorStatusMatcher();

    @Input()
    item: Item;

    @Input()
    items: Item[];

    @Input()
    items$: Observable<Item[]>;

    @Input()
    editMode: boolean = false;

    @Output()
    EventOutput = new EventEmitter<FormGroup>();

    section: string = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _eventsListComponent: EventsListComponent,
        private _eventService: ItemsService,
        private dialog: MatDialog
    ){}

    ngOnInit(): void {
        this._eventsListComponent.matDrawer.open();

        this.itemForm = this._formBuilder.group({
            key: [''],
            name: ['', [Validators.required]],
            price: [1, [Validators.required]],
            stock: [1, [Validators.required]],
            unitOfMeasurement: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
            description: ['', [Validators.required]],
            category: ['', [Validators.maxLength(50), Validators.required]]
        });

        this._eventService.item$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((event: Item) => {
            this._eventsListComponent.matDrawer.open();
            this.item = event;

            this.itemForm.patchValue(event);
            
            this.toggleEditMode(event.key ? false : true, 'basic');
            
            this._changeDetectorRef.markForCheck();
        });

        this.EventOutput.emit( this.itemForm );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleEditMode(editMode: boolean | null = null, section: string): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        this.section = section;

        if (!this.editMode && !this.item.key) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }
   
    setStatus(status): void {
        this.itemForm.get('status').setValue(status);
        this.item.status = status;
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
}