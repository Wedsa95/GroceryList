import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { GroceryList } from './grocery-list.model';
import { GroceryListService } from './grocery-list.service';

@Component({
    selector: 'jhi-grocery-list-detail',
    templateUrl: './grocery-list-detail.component.html'
})
export class GroceryListDetailComponent implements OnInit, OnDestroy {

    groceryList: GroceryList;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private groceryListService: GroceryListService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGroceryLists();
    }

    load(id) {
        this.groceryListService.find(id)
            .subscribe((groceryListResponse: HttpResponse<GroceryList>) => {
                this.groceryList = groceryListResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGroceryLists() {
        this.eventSubscriber = this.eventManager.subscribe(
            'groceryListListModification',
            (response) => this.load(this.groceryList.id)
        );
    }
}
