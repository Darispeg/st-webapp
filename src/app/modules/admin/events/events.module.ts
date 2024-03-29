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
import { EventsComponent } from './events.component';
import { EventsListComponent } from './list/list.component';
import { EventsDetailsComponent } from './details/details.component';
import { eventsRoutes } from './events.routing';
import { NoSanitizePipe } from 'app/shared/no-sanitize-pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { FileComponentDialog } from './files/file.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { TicketsComponent } from './tickets/tickets.component';

@NgModule({
    declarations: [
        EventsComponent,
        EventsListComponent,
        EventsDetailsComponent,
        FileComponentDialog,
        NoSanitizePipe,
        BasicInfoComponent,
        TicketsComponent
    ],
    imports: [
        RouterModule.forChild(eventsRoutes),
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
        MatDialogModule,
    ],
    providers : [
        { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
    ]
})
export class EventsModule{

}