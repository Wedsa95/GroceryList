import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GroceryList } from './grocery-list.model';
import { GroceryListService } from './grocery-list.service';
import { Principal, AccountService } from '../../shared';

@Component({
    selector: 'jhi-grocery-list',
    templateUrl: './grocery-list.component.html'
})
export class GroceryListComponent implements OnInit, OnDestroy {
    groceryLists: GroceryList[];
    filterdgroceryLists: GroceryList[];
    currentAccount: any = null;
    eventSubscriber: Subscription;

    currentShowingList = 1;
    currentAcc = 0;
    constructor(
        private groceryListService: GroceryListService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
      this.groceryListService.findAll(this.currentAcc).subscribe(
            (res: HttpResponse<GroceryList[]>) => {
                this.groceryLists = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
      this.filtrateGroceryList();
    }
    ngOnInit() {
        
        this.principal.identity().then((account) => {
            this.currentAccount = account;
            this.currentAcc = this.currentAccount.id;
        });
        this.registerChangeInGroceryLists();
        this.loadAll();
        
    }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
    trackId(index: number, item: GroceryList) {
        return item.id;
    }
    registerChangeInGroceryLists() {
        this.eventSubscriber = this.eventManager.subscribe('groceryListListModification', (response) => this.loadAll());
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
    
    
    
    private filtrateGroceryList(){
         return this.filterdgroceryLists = this.groceryLists.filter(x => x.listName == this.currentShowingList);
    }
    private clickTabs(chosenList){
        this.currentShowingList = chosenList;
        console.log('click Chosen List' + this.currentShowingList);
    }
    private clickListItem(event) {
      console.log('clickListItem ' + event);
    }
    private dblClickListItem(event) {
        console.log('doubleClickListItem ' + event);
    }
    private addItem() {
      console.log('clickListItem');
      this.groceryListService.create(new GroceryList(this.currentShowingList,));
       this.loadAll();
    }
}
