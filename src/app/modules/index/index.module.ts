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
import { IndexComponent } from './index.component';
import { indexRoutes } from './index.routing';
import { IndexListComponent } from './list/list.component';
import { IndexDetailsComponent } from './details/details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from 'app/shared/paginator-intl';
import { NoSanitizePipeIndex } from 'app/shared/no-sanitize-pipe';

@NgModule({
    declarations: [
        IndexComponent,
        IndexListComponent,
        IndexDetailsComponent,
        NoSanitizePipeIndex
    ],
    imports: [
        RouterModule.forChild(indexRoutes),
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
        MatDatepickerModule,
        MatMomentDateModule,
        MatPaginatorModule
    ],
    providers : [
        { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
    ]
})
export class IndexModule{

}
