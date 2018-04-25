import { NgModule, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/en';

import {
    GroceryListAppSharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';

@NgModule({
    imports: [
        GroceryListAppSharedLibsModule
    ],
    declarations: [
        JhiAlertComponent,
        JhiAlertErrorComponent
    ],
    providers: [
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
    ],
    exports: [
        GroceryListAppSharedLibsModule,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ]
})
export class GroceryListAppSharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}
