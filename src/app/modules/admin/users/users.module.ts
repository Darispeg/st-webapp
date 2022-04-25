import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
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
import { MyCustomPaginatorIntl } from '../../../shared/paginator-intl';
import { UsersDetailsComponent } from './details/details.component';
import { UsersListComponent } from './list/list.component';
import { usersRoutes } from './users.routing';
import { UsersComponent } from './users.component';

@NgModule({
    declarations: [
        UsersComponent,
        UsersListComponent,
        UsersDetailsComponent
    ],
    imports: [
        RouterModule.forChild(usersRoutes),
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
        MatPaginatorModule
    ],
    providers : [
        { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
    ]
})
export class UsersModule{

}
