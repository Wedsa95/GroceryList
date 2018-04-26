import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GroceryList } from './grocery-list.model';
import { GroceryListPopupService } from './grocery-list-popup.service';
import { GroceryListService } from './grocery-list.service';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-grocery-list-dialog',
    templateUrl: './grocery-list-dialog.component.html'
})
export class GroceryListDialogComponent implements OnInit {

    groceryList: GroceryList;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private groceryListService: GroceryListService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.groceryList.id !== undefined) {
            this.subscribeToSaveResponse(
                this.groceryListService.update(this.groceryList));
        } else {
            this.subscribeToSaveResponse(
                this.groceryListService.create(this.groceryList));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<GroceryList>>) {
        result.subscribe((res: HttpResponse<GroceryList>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: GroceryList) {
        this.eventManager.broadcast({ name: 'groceryListListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-grocery-list-popup',
    template: ''
})
export class GroceryListPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private groceryListPopupService: GroceryListPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.groceryListPopupService
                    .open(GroceryListDialogComponent as Component, params['id']);
            } else {
                this.groceryListPopupService
                    .open(GroceryListDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
