import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GroceryListAppSharedModule } from '../../shared';
import { GroceryListAppAdminModule } from '../../admin/admin.module';
import {
    GroceryListService,
    GroceryListPopupService,
    GroceryListComponent,
    GroceryListDetailComponent,
    GroceryListDialogComponent,
    GroceryListPopupComponent,
    GroceryListDeletePopupComponent,
    GroceryListDeleteDialogComponent,
    groceryListRoute,
    groceryListPopupRoute,
} from './';

const ENTITY_STATES = [
    ...groceryListRoute,
    ...groceryListPopupRoute,
];

@NgModule({
    imports: [
        GroceryListAppSharedModule,
        GroceryListAppAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GroceryListComponent,
        GroceryListDetailComponent,
        GroceryListDialogComponent,
        GroceryListDeleteDialogComponent,
        GroceryListPopupComponent,
        GroceryListDeletePopupComponent,
    ],
    entryComponents: [
        GroceryListComponent,
        GroceryListDialogComponent,
        GroceryListPopupComponent,
        GroceryListDeleteDialogComponent,
        GroceryListDeletePopupComponent,
    ],
    providers: [
        GroceryListService,
        GroceryListPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroceryListAppGroceryListModule {}
