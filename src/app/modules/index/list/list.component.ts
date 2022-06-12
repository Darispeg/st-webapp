import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { MatPaginator } from '@angular/material/paginator';
import { EventsService } from "app/modules/admin/events/events.service";
import { Event } from "app/modules/admin/models/events.types";

@Component({
    selector       : 'index-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) _paginator: MatPaginator

    events$: Observable<Event[]>;
    selectedEvent: Event;
    recordsLength: number;

    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();

    isLoading: boolean = false;
    categories: string[] = ['DEPORTES', 'CONCIERTOS', 'SOCIALES']
    categoryControl: FormControl;
    range : FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _eventsService: EventsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ){}

    ngOnInit(): void
    {
        this.categoryControl = new FormControl('');

        this.range = new FormGroup({
            start: new FormControl(),
            end: new FormControl(),
          });

        this.events$ = this._eventsService.events$;

        this.matDrawer.openedChange.subscribe((opened) => {
            if(!opened)
            {
                this.selectedEvent = null;
                this._changeDetectorRef.markForCheck();
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                if (matchingAliases.includes('lg'))
                    this.drawerMode = 'side';
                else
                    this.drawerMode = 'over';

                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any
    {
        return item.Key || index;
    }
}
