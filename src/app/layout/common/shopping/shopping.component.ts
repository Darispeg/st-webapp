import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { ShoppingService } from "./shopping.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatButton } from "@angular/material/button";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { ShoppingDetail } from "./shopping.model";
import { FormControl } from "@angular/forms";

@Component({
    selector       : 'shopping',
    templateUrl    : './shopping.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'shopping'
})
export class ShoppingComponent implements OnInit, OnDestroy
{
    @ViewChild('shoppingCarOrigin') private _shoppingCarOrigin: MatButton;
    @ViewChild('shoppingCarPanel') private _shoppingCarPanel: TemplateRef<any>;
    
    itemCount: number = 0;
    details: ShoppingDetail[];
    total: number = 0;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _overlayRef: OverlayRef;
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _shoppingService : ShoppingService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ){}

    ngOnInit(): void {          
        this._shoppingService.shopping$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((shopping) => {
                this.itemCount = shopping.details.length;
                this.details = shopping.details;
                this.total = shopping.total;
                
                shopping.details.forEach((element) => {
                    this.total = this.total + element.item.price * element.quantity;
                });

                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }

    openPanel(): void
    {
        if ( !this._shoppingCarPanel || !this._shoppingCarOrigin )
        {
            return;
        }

        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        this._overlayRef.attach(new TemplatePortal(this._shoppingCarPanel, this._viewContainerRef));
    }

    closePanel(): void
    {
        this._overlayRef.detach();
    }

    private _createOverlay(): void
    {
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._shoppingCarOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}