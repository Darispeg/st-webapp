/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id: 'index',
        title: 'Index',
        type: 'basic',
        link: 'index',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Area de administracion',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: [
        {
            id: 'users',
            title : 'Usuarios',
            type: 'basic',
            icon: 'heroicons_outline:user',
            link: 'admin/users'
        },
        {
            id: 'roles',
            title : 'Roles',
            subtitle : 'Roles del Sistema',
            type: 'basic',
            icon: 'heroicons_outline:key',
            link: 'admin/roles'
        },
        {
            id: 'events',
            title : 'Items',
            type: 'basic',
            icon: 'heroicons_outline:puzzle',
            link: 'admin/events'
        }
    ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'index',
        title: 'Index',
        type: 'basic',
        link: 'index',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Area de administracion de catalogos',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: []
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'index',
        title: 'Index',
        type: 'basic',
        link: 'index',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Area de administracion de catalogos',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: []
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'index',
        title: 'Index',
        type: 'basic',
        link: 'index',
        icon: 'heroicons_outline:view-grid'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Area de administracion de catalogos',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: []
    }
];
