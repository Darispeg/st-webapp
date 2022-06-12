import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject, merge, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../models/users.types';
import { Role } from '../../models/roles.types';
import { UsersService } from '../../users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector       : 'areas-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) _paginator: MatPaginator;

    users$: Observable<User[]>;
    roles$: Observable<Role[]>
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedUser: User;
    isLoading: boolean = false;
    totalCount : number;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _userService: UsersService,
        private _snackBar: MatSnackBar
    )
    {}

    ngOnInit(): void
    {
        this.users$ = this._userService.users$;

        this.users$.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users: User[]) => {
                this.totalCount = users.length;
                this._changeDetectorRef.markForCheck();
            });

        this.roles$ = this._userService.roles$;

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) => {
                    this.matDrawer.close();
                    this._router.navigate(['./'], {relativeTo: this._activatedRoute});
                    this.isLoading = true;
                    return this._userService.getUsers()
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
                this.selectedUser = null;
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

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createRole();
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

    changeRoleToUser(user: User, role: Role): void
    {
        this._userService.changeRoleToUser(user.key, role.key).subscribe();
    }

    createRole(): void
    {
        this._router.navigate(['./00000000-0000-0000-0000-000000000000'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any
    {
        return item.Key || index;
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }
}
