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
import { RolesComponent } from './roles.component';
import { RolesListComponent } from './list/list.component';
import { RolesDetailsComponent } from './details/details.component';
import { rolesRoutes } from './roles.routing';

@NgModule({
    declarations: [
        RolesComponent,
        RolesListComponent,
        RolesDetailsComponent
    ],
    imports: [
        RouterModule.forChild(rolesRoutes),
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
export class RolesModule{

}
