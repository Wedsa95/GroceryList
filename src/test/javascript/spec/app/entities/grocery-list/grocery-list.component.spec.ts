/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GroceryListAppTestModule } from '../../../test.module';
import { GroceryListComponent } from '../../../../../../main/webapp/app/entities/grocery-list/grocery-list.component';
import { GroceryListService } from '../../../../../../main/webapp/app/entities/grocery-list/grocery-list.service';
import { GroceryList } from '../../../../../../main/webapp/app/entities/grocery-list/grocery-list.model';

describe('Component Tests', () => {

    describe('GroceryList Management Component', () => {
        let comp: GroceryListComponent;
        let fixture: ComponentFixture<GroceryListComponent>;
        let service: GroceryListService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GroceryListAppTestModule],
                declarations: [GroceryListComponent],
                providers: [
                    GroceryListService
                ]
            })
            .overrideTemplate(GroceryListComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GroceryListComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GroceryListService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new GroceryList(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.groceryLists[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
