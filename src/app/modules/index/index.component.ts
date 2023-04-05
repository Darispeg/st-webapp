import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileInfoService } from '../admin/events/files/files.service';
import { ItemsService } from '../admin/events/items.service';
import { Item } from '../admin/models/items.types';

@Component({
    selector     : 'index',
    templateUrl  : './index.component.html',
    encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, OnDestroy
{

    items$: Observable<Item[]>;
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
        private _itemsService: ItemsService,
        private _fileInfoService: FileInfoService
    ){}

    ngOnInit(): void {
        this.items$ = this._itemsService.items$;
        this._itemsService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((events) => {
                console.log(events);
                this.totalCount = events.length;
            });

        this._itemsService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Event: Item) => {
                this.selectedItem = Event;
                this._changeDetectorRef.markForCheck();
            });
        
        this._fileInfoService.files$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any
    {
        return item.Key || index;
    }
}
