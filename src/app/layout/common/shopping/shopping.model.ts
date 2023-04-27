import { Item } from "app/modules/admin/models/items.types"

export interface Shopping 
{
    key? : string,
    total : number,
    details : ShoppingDetail[]
}

export interface ShoppingDetail 
{
    item: Item,
    quantity : number
}