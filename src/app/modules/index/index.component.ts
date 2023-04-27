import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector        : 'indexRoulet',
    templateUrl     : './Index.component.html',
    encapsulation   : ViewEncapsulation.None,
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class IndexComponent
{
    constructor(){}
}