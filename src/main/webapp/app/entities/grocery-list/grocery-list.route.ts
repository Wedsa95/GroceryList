import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GroceryListComponent } from './grocery-list.component';


export const groceryListRoute: Routes = [
    {
        path: 'grocery-list',
        component: GroceryListComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'GroceryLists'
        },
        canActivate: [UserRouteAccessService]
    }
];
