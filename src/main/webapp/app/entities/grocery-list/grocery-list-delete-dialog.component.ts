import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GroceryList } from './grocery-list.model';
import { GroceryListPopupService } from './grocery-list-popup.service';
import { GroceryListService } from './grocery-list.service';

@Component({
    selector: 'jhi-grocery-list-delete-dialog',
    templateUrl: './grocery-list-delete-dialog.component.html'
})
export class GroceryListDeleteDialogComponent {

    groceryList: GroceryList;

    constructor(
        private groceryListService: GroceryListService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.groceryListService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'groceryListListModification',
                content: 'Deleted an groceryList'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-grocery-list-delete-popup',
    template: ''
})
export class GroceryListDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private groceryListPopupService: GroceryListPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.groceryListPopupService
                .open(GroceryListDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
