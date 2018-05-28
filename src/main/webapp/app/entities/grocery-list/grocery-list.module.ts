import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GroceryListAppSharedModule } from '../../shared';
import { GroceryListAppAdminModule } from '../../admin/admin.module';
import {
    GroceryListService,
    GroceryListComponent,
    groceryListRoute
} from './';

const ENTITY_STATES = [
    ...groceryListRoute
];

@NgModule({
    imports: [
        GroceryListAppSharedModule,
        GroceryListAppAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GroceryListComponent
    ],
    entryComponents: [
        GroceryListComponent
    ],
    providers: [
        GroceryListService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroceryListAppGroceryListModule {}
