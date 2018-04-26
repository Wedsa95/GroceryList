import { BaseEntity, User } from './../../shared';

export class GroceryList implements BaseEntity {
    constructor(
        public id?: number,
        public listName?: number,
        public itemName?: string,
        public listOwner?: User,
    ) {
    }
}
