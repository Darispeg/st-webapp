import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector        : 'index',
    templateUrl     : './index.component.html',
    encapsulation   : ViewEncapsulation.None,
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class IndexComponent
{
    constructor(){}
}
