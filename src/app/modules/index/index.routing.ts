import { Route } from '@angular/router';
import { EventsEventResolver, EventsResolver } from '../admin/events/events.resolvers';
import { FilesResolver } from '../admin/events/files/files.resolvers';
import { IndexDetailsComponent } from './details/details.component';
import { CanDeactivateEventsDetails } from '../admin/events/events.guards';
import { IndexComponent } from './Index.component';
import { IndexListComponent } from './list/list.component';

export const indexRoutes: Route[] = [
    {
        path     : '',
        component: IndexComponent,
        children : [
            {
                path          : '',
                pathMatch     : 'full',
                component     : IndexListComponent,
                resolve       : {
                    task      : EventsResolver, FilesResolver
                }
            },
            {
                path          : ':key',
                component     : IndexDetailsComponent,
                resolve       : {
                    tasks: EventsEventResolver
                },
                canDeactivate : [CanDeactivateEventsDetails]
            }
        ]
    }
]
