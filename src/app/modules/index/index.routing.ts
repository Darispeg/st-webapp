import { Route } from '@angular/router';
import { EventsResolver } from '../admin/events/events.resolvers';
import { FilesResolver } from '../admin/events/files/files.resolvers';
import { IndexComponent } from './index.component';

export const indexRoutes: Route[] = [
    {
        path     : '',
        component: IndexComponent,
        resolve   : {
            tasks : EventsResolver, FilesResolver
        },
    }
]
