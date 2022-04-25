import { Route } from '@angular/router';
import { UsersResolver, UsersUserResolver } from './users.resolvers';
import { CanDeactivateUsersDetails } from './users.guards';
import { UsersListComponent } from './list/list.component';
import { UsersDetailsComponent } from './details/details.component';
import { UsersComponent } from './users.component';

export const usersRoutes: Route[] = [
    {
        path     : '',
        component: UsersComponent,
        children : [
            {
                path     : '',
                component : UsersListComponent,
                resolve   : {
                    tasks : UsersResolver
                },
                children : [
                    {
                        path          : ':key',
                        component     : UsersDetailsComponent,
                        resolve       : {
                            tasks: UsersUserResolver
                        },
                        canDeactivate : [CanDeactivateUsersDetails]
                    }
                ]
            }
        ]
    }
]
