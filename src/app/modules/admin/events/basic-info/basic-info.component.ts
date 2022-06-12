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
import { EventsService } from "../events.service";
import { EventsListComponent } from "../list/list.component";
import { Event } from "../../models/events.types";
import { FileComponentDialog } from "../files/file.component";

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html'
})
export class BasicInfoComponent implements OnInit, OnDestroy  {

    eventForm: FormGroup;
    matcher = new MyErrorStatusMatcher();

    @Input()
    event: Event;

    @Input()
    events: Event[];

    @Input()
    events$: Observable<Event[]>;

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
        private _eventService: EventsService,
        private dialog: MatDialog
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
            location: [''],
            status: ['Active', [Validators.required]],
        });

        this._eventService.event$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((event: Event) => {
            this._eventsListComponent.matDrawer.open();
            this.event = event;

            this.eventForm.patchValue(event);
            
            this.toggleEditMode(event.key ? false : true, 'basic');
            
            this._changeDetectorRef.markForCheck();
        });

        this.EventOutput.emit( this.eventForm );
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

        if (!this.editMode && !this.event.key) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }
   
    setStatus(status): void {
        this.eventForm.get('status').setValue(status);
        this.event.status = status;
    }

    openDialog(): void{
        const dialogRef = this.dialog.open(FileComponentDialog, {
            width: '600px',
            height: '500px',
            data: { eventKey : this.event.key, name : this.event.name, urlImage: this.event.urlImage }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Close', result);
        })
    }
}