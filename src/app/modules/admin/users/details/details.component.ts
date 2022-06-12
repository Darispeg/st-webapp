import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, throwError } from "rxjs";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { catchError, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersListComponent } from '../list/list.component';
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { UsersService } from "../users.service";
import { User } from "../../models/users.types";
import { Role } from "../../models/roles.types";

@Component({
    selector: 'areas-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetailsComponent implements OnInit, OnDestroy {

    _query: string = '';
    editMode: boolean = false;
    users: User[];
    user: User;
    roles: Role[];
    roles$: Observable<Role[]>;
    checkedRoles: string[] = [];

    userForm: FormGroup;
    matcher = new MyErrorStatusMatcher();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _usersListComponent: UsersListComponent,
        private _userService: UsersService
    ) { }

    ngOnInit(): void
    {
        this._usersListComponent.matDrawer.open();

        this.userForm = this._formBuilder.group({
            key: [''],
            username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15),  Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            phone: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]*$")]],
            email: ['', [Validators.maxLength(50), Validators.email]],
            password: [''],
            status: ['Active', [Validators.required]],
            roles: this._formBuilder.array([])
        });

        this._userService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Users: User[]) => {
                this.users = Users;
                this._changeDetectorRef.markForCheck();
            });

        this._userService.roles$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Roles: Role[]) => {
                this.roles = Roles;
                this._changeDetectorRef.markForCheck();
            });

        this.roles$ = this._userService.roles$;

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((User: User) => {
                this._usersListComponent.matDrawer.open();
                this.user = User;

                this.checkedRoles = [];

                if(User.roles != null)
                {
                    for (let role of User.roles) {
                        this.checkedRoles.push(role.name);
                    }
                }

                console.log(this.checkedRoles);

                this.userForm.patchValue(User);

                const featureFormGroups = [];

                if (User.roles != undefined) {
                    User.roles.forEach((role) => {
                        featureFormGroups.push(
                            this._formBuilder.group({
                                key: [role.key],
                                name: [role.name],
                                description: [role.description]
                            })
                        );
                    });
                }

               (this.userForm.get('roles') as FormArray).clear();

                featureFormGroups.forEach((userFormGroup) => {
                    (this.userForm.get('roles') as FormArray).push(userFormGroup);
                });

                console.log(this.userForm.value);
                this.toggleEditMode(User.key ? false : true);
                this._changeDetectorRef.markForCheck();
            });

        if(this._usersListComponent.searchInputControl.value != undefined)
        {
            this._query = this._usersListComponent.searchInputControl.value;
        }
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._usersListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        if (!this.editMode && !this.user.key) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }

    deleteUser() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Usuario',
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
                const key = this.user.key;
                const currentUserIndex = this.users.findIndex(item => item['key'] === key);
                const nextUserIndex = currentUserIndex + ((currentUserIndex === (this.users.length - 1)) ? -1 : 1);
                const nextUserId = (this.users.length === 1 && this.users[0].key === key) ? null : this.users[nextUserIndex].key;

                this._userService.deleteUser(key)
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

                        this._userService.getUsers().subscribe();
                        this.snackBar('Usuario eliminado correctamente');
                        this.toggleEditMode(false);
                    });

                this._changeDetectorRef.markForCheck();
            }
        })
    }

    updateUser(): void {
        const _update = this.userForm.getRawValue();

        if (_update.key === '') {
            this._userService.createUser(_update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe((User) => {
                    this.user = User;
                    this.toggleEditMode(false);
                    this._router.navigate(['../', this.user.key], { relativeTo: this._activatedRoute });
                    this.snackBar('Nuevo Usuario Agregado Correctamente');
                });
        }
        else
        {
            this._userService.updateUser(_update.key, _update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe(() => {
                    this.toggleEditMode(false);
                    this._userService.getUsers().subscribe();

                    this.snackBar('Usuario Modificado Correctamente');
                });
        }
    }
    
    setStatus(status): void {
        this.userForm.get('status').setValue(status);
        this.user.status = status;
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }

    trackByFn(index: number, item: any): any
    {
        return item.Key || index;
    }
}
