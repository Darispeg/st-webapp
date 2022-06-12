import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector        : 'roles',
    templateUrl     : './roles.component.html',
    encapsulation   : ViewEncapsulation.None,
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class RolesComponent
{
    constructor(){}
}