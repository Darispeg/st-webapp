import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Shopping } from 'app/layout/common/shopping/shopping.model';
import { ShoppingService } from 'app/layout/common/shopping/shopping.service';
import { MyErrorStatusMatcher } from 'app/shared/error-status-matcher';
import { StripeCard, StripeScriptTag } from "stripe-angular"

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Payment } from '../payment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector       : 'payment-details',
    templateUrl    : './list.component.html',
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild(MatPaginator) _paginator: MatPaginator;

    shopping$: Observable<Shopping>;
    isLoading: boolean = false;
    totalCount: number = 0;
    total : number = 0;
    paymentForm: FormGroup;
    matcher = new MyErrorStatusMatcher();
    details: string = "";
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _shoppingService: ShoppingService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ){}

    ngOnInit(): void
    {
        this.paymentForm = this._formBuilder.group({
            cardNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            expirationDate: [moment(), [Validators.required]],
            cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            phone: ['', [Validators.required, Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
            email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
            zip: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern("^[0-9]*$")]],
          });

        this.shopping$ = this._shoppingService.shopping$;

        this._shoppingService.shopping$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((shoppingCar) => {
                this.totalCount = shoppingCar.details.length;

                shoppingCar.details.forEach((element) => {
                  this.total = this.total + element.item.price * element.quantity;
                  this.details = this.details + ", " + element.item.name + " : " + element.quantity
                });
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any
    {
        return item.Key || index;
    }

    snackBar(message) {
      this._snackBar.open(message, '', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: ['bg-accent-500', 'font-bold', 'text-gray-100']
      });
  }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.paymentForm.value['expirationDate']!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.paymentForm.value['expirationDate'] = ctrlValue;
        datepicker.close();
    }

    createPayment(){
      console.log(this.paymentForm.get('expirationDate').value.month())
      var payment : Payment = {
        email : this.paymentForm.get('email').value,
        phone : this.paymentForm.get('phone').value,
        name : this.paymentForm.get('name').value,
        details : this.details,
        total : this.total * 100,
        cardRequest : {
            number : this.paymentForm.get('cardNumber').value,
            exp_month : 11,
            exp_year : this.paymentForm.get('expirationDate').value.year(),
            cvc : this.paymentForm.get('cvc').value  
        }  
      }

      this._shoppingService.createPayment(payment).subscribe((response) => {
        this.snackBar(response['details']);
      });

      this._shoppingService.getShoppingCar().subscribe();
    }
}

