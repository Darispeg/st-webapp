import { Route } from '@angular/router';
import { PaymentDetailsComponent } from './list/list.component';
import { PaymentComponent } from './payment.component';

export const paymentRoutes: Route[] = [
    {
        path     : '',
        component: PaymentComponent,
        children : [
            {
                path     : '',
                component : PaymentDetailsComponent
            }
        ]
    }
]
