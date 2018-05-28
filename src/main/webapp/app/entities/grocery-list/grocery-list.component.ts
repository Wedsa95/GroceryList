import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GroceryList } from './grocery-list.model';
import { GroceryListService } from './grocery-list.service';
import { Principal } from '../../shared';
import { AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
    itemName = '';
    isSaving = false;

    constructor(
        private groceryListService: GroceryListService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
        
    }

    loadAll() {
        console.log('load all');
      this.groceryListService.findAll().subscribe(
            (res: HttpResponse<GroceryList[]>) => {
                this.groceryLists = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

    }
    ngOnInit() {
        console.log('on init');
//        this.principal.identity().then((account) => {
//            this.currentAccount = account;
//        });
        this.loadAll();
        this.registerChangeInGroceryLists();
    }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
    registerChangeInGroceryLists() {
        this.eventSubscriber = this.eventManager.subscribe('groceryListListModification', (response) => this.loadAll());
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    private filtrateGroceryList() {
         return this.filterdgroceryLists = this.groceryLists.filter((x) => x.listName === this.currentShowingList);
    }
    private clickTabs(chosenList) {
        this.currentShowingList = chosenList;
        console.log('click Chosen List' + this.currentShowingList);
    }
    private clickListItem(event) {
      console.log('clickListItem ' + event);
      
      if (event.target.className !== 'over-drawn') {
        event.target.setAttribute('class', 'over-drawn');
      } else {
        event.target.setAttribute('class', 'not-over-drawn');
      }
    }
    private dblClickListItem(item) {
        this.deleteItem(item.id);
    }

    private addItem(event) {
      console.log('addListItem');
      this.subscribeToSaveResponse(
          this.groceryListService.
          create(new GroceryList(null, this.currentShowingList, this.itemName)));
      this.loadAll();
      this.itemName = '';
    }
    private subscribeToSaveResponse(result: Observable<HttpResponse<GroceryList>>) {
        result.subscribe((res: HttpResponse<GroceryList>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }
    private onSaveSuccess(result: GroceryList) {
        this.eventManager.broadcast({ name: 'groceryListListModification', content: 'OK'});
        this.isSaving = false;
    }
    private onSaveError() {
        this.isSaving = false;
    }
    
    deleteItem(id: number) {
        this.groceryListService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'groceryListListModification',
                content: 'Deleted an groceryList'
            });
        });
    }
}
