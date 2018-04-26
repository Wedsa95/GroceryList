import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { GroceryList } from './grocery-list.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<GroceryList>;

@Injectable()
export class GroceryListService {

    private resourceUrl =  SERVER_API_URL + 'api/grocery-lists';

    constructor(private http: HttpClient) { }

    create(groceryList: GroceryList): Observable<EntityResponseType> {
        const copy = this.convert(groceryList);
        return this.http.post<GroceryList>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(groceryList: GroceryList): Observable<EntityResponseType> {
        const copy = this.convert(groceryList);
        return this.http.put<GroceryList>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    findAll(req?: any): Observable<HttpResponse<GroceryList[]>> {
      const options = createRequestOption(req);
      //const httpParams = new HttpParams().set('listOwner', id);

        return this.http.get<GroceryList[]>(this.resourceUrl, { params: 'options', observe: 'response' })
            .map((res: HttpResponse<GroceryList[]>) => this.convertArrayResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GroceryList>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<GroceryList[]>> {
        const options = createRequestOption(req);
        return this.http.get<GroceryList[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<GroceryList[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GroceryList = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GroceryList[]>): HttpResponse<GroceryList[]> {
        const jsonResponse: GroceryList[] = res.body;
        const body: GroceryList[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to GroceryList.
     */
    private convertItemFromServer(groceryList: GroceryList): GroceryList {
        const copy: GroceryList = Object.assign({}, groceryList);
        return copy;
    }

    /**
     * Convert a GroceryList to a JSON which can be sent to the server.
     */
    private convert(groceryList: GroceryList): GroceryList {
        const copy: GroceryList = Object.assign({}, groceryList);
        return copy;
    }
}
