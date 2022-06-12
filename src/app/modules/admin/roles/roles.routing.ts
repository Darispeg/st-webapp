import { Route } from "@angular/router";
import { CanDeactivateUsersDetails } from "../users/users.guards";
import { UsersResolver } from "../users/users.resolvers";
import { RolesDetailsComponent } from "./details/details.component";
import { RolesListComponent } from "./list/list.component";
import { RolesComponent } from "./roles.component";

export const rolesRoutes: Route[] = [
    {
        path     : '',
        component: RolesComponent,
        children : [
            {
                path     : '',
                component : RolesListComponent,
                resolve   : {
                    tasks : UsersResolver
                },
                children : [
                    {
                        path          : ':key',
                        component     : RolesDetailsComponent,
                        resolve       : {
                            // tasks: RolesRoleResolver
                        },
                        canDeactivate : [CanDeactivateUsersDetails]
                    }
                ]
            }
        ]
    }
]