import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ShoppingDetail } from "app/layout/common/shopping/shopping.model";
import { ShoppingService } from "app/layout/common/shopping/shopping.service";
import { ItemsService } from "app/modules/admin/events/items.service";
import { Item } from "app/modules/admin/models/items.types";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'areas-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexDetailsComponent implements OnInit, OnDestroy {

    item$ : Observable<Item>;
    item: Item;
    numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    detailForm: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _itemService: ItemsService,
        private _shoppingService: ShoppingService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar
    ){}

    ngOnInit(): void {
        this.item$ = this._itemService.item$;

        this.detailForm = this._formBuilder.group({
            quantity: [1, [Validators.required]]
        })

        this._itemService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item) => {
                console.log(item);
                this.item = item;
            })
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    AddToCart(){
        const detail = this.detailForm.getRawValue();
        
        let newDetail : ShoppingDetail = {
            item : this.item,
            quantity : detail['quantity']
        };

        this._shoppingService.addDetailToCart(newDetail).subscribe();
        this.snackBar('Nuevo producto agregado al carrito de compra');
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-accent-500', 'font-bold', 'text-gray-100']
        });
    }
}