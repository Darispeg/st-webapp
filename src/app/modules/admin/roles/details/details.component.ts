import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { Observable, Subject } from "rxjs";
import { Role } from "../../models/roles.types";
import { UsersService } from "../../users/users.service";
import { RolesListComponent } from "../list/list.component";

@Component({
    selector: 'roles-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesDetailsComponent implements OnInit, OnDestroy {

    _query: string = '';
    editMode: boolean = false;
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
        private _rolesListComponent: RolesListComponent,
        private _userService: UsersService
    ) { }

    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
    
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}