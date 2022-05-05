import { Route } from '@angular/router';
import { EventsDetailsComponent } from './details/details.component';
import { EventsComponent } from './events.component';
import { CanDeactivateEventsDetails } from './events.guards';
import { EventsEventResolver, EventsResolver } from './events.resolvers';
import { EventsListComponent } from './list/list.component';

export const eventsRoutes: Route[] = [
    {
        path     : '',
        component: EventsComponent,
        children : [
            {
                path     : '',
                component : EventsListComponent,
                resolve   : {
                    tasks : EventsResolver
                },
                children : [
                    {
                        path          : ':key',
                        component     : EventsDetailsComponent,
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
