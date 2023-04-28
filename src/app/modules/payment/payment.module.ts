import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PipesModule } from 'app/core/pipes/pipes.module';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PaymentDetailsComponent } from './list/list.component';
import { paymentRoutes } from './payment.routing';
import { PaymentComponent } from './payment.component';
import { MyCustomPaginatorIntl } from 'app/shared/paginator-intl';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    declarations: [
        PaymentComponent,
        PaymentDetailsComponent,
    ],
    imports: [
        RouterModule.forChild(paymentRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTooltipModule,
        PipesModule,
        SharedModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatDatepickerModule,
    ],
    providers : [
        { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
    ]
})
export class PaymentModule{

}
