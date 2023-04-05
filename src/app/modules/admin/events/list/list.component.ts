import { DOCUMENT } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { fromEvent, Observable, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { Item } from "../../models/items.types";
import { ItemsService } from "../items.service";
import { FileInfoService } from "../files/files.service";

@Component({
    selector       : 'areas-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsListComponent implements OnInit, OnDestroy
{

    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    items$: Observable<Item[]>;
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedItem: Item;
    isLoading: boolean = false;
    totalCount: number = 0;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _eventsService: ItemsService,
        private _fileInfoService: FileInfoService
    )
    {}

    createEvent(): void
    {
        this._router.navigate(['./00000000-0000-0000-0000-000000000000'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    ngOnInit(): void {
        this.items$ = this._eventsService.items$;
        this._eventsService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((events) => {
                this.totalCount = events.length;
            });

        this._eventsService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Event: Item) => {
                this.selectedItem = Event;
                this._changeDetectorRef.markForCheck();
            });
        
        this._fileInfoService.files$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) => {
                    this.matDrawer.close();
                    this._router.navigate(['./'], {relativeTo: this._activatedRoute});
                    this.isLoading = true;
                    return this._eventsService.getItems()
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });

        this.matDrawer.openedChange.subscribe((opened) => {
            if( !opened )
            {
                this.selectedItem = null;
                this._changeDetectorRef.markForCheck();
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                this._changeDetectorRef.markForCheck();
            });

        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey)
                    && (event.key === '/')
                )
            )
            .subscribe(() => {
                this.createEvent();
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