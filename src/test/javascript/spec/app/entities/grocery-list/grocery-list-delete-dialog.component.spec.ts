/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { GroceryListAppTestModule } from '../../../test.module';
import { GroceryListDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/grocery-list/grocery-list-delete-dialog.component';
import { GroceryListService } from '../../../../../../main/webapp/app/entities/grocery-list/grocery-list.service';

describe('Component Tests', () => {

    describe('GroceryList Management Delete Component', () => {
        let comp: GroceryListDeleteDialogComponent;
        let fixture: ComponentFixture<GroceryListDeleteDialogComponent>;
        let service: GroceryListService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GroceryListAppTestModule],
                declarations: [GroceryListDeleteDialogComponent],
                providers: [
                    GroceryListService
                ]
            })
            .overrideTemplate(GroceryListDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GroceryListDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GroceryListService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
