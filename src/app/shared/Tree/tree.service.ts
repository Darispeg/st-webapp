import { Observable } from "rxjs";
import { DynamicFlatNode } from "./dynamic-flat-node.types";

export interface TreeService<T>
{
    getAll(key: string): Observable<DynamicFlatNode[]>

    getChildren(node: string): T[] | undefined

    isExpandable(node: string): boolean
}
