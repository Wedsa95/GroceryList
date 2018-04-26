import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GroceryListComponent } from './grocery-list.component';
import { GroceryListDetailComponent } from './grocery-list-detail.component';
import { GroceryListPopupComponent } from './grocery-list-dialog.component';
import { GroceryListDeletePopupComponent } from './grocery-list-delete-dialog.component';

export const groceryListRoute: Routes = [
    {
        path: 'grocery-list',
        component: GroceryListComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'GroceryLists'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'grocery-list/:id',
        component: GroceryListDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'GroceryLists'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const groceryListPopupRoute: Routes = [
    {
        path: 'grocery-list-new',
        component: GroceryListPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'GroceryLists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'grocery-list/:id/edit',
        component: GroceryListPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'GroceryLists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'grocery-list/:id/delete',
        component: GroceryListDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'GroceryLists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
