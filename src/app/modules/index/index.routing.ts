import { Route } from '@angular/router';
import { IndexDetailsComponent } from './details/details.component';
import { IndexListComponent } from './list/list.component';
import { IndexComponent } from './index.component';
import { EventsEventResolver, EventsResolver } from '../admin/events/events.resolvers';
import { FilesResolver } from '../admin/events/files/files.resolvers';
import { CanDeactivateEventsDetails } from '../admin/events/events.guards';

export const indexRoutes : Route[] = [
    {
        path     : '',
        component: IndexComponent,
        children : [
            {
                path     : '',
                component : IndexListComponent,
                resolve   : {
                    tasks : EventsResolver, FilesResolver
                },
                children : [
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
    }
]
