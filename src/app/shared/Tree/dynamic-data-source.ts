import { CollectionViewer, SelectionChange } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/collections/data-source";
import { FlatTreeControl } from "@angular/cdk/tree";
import { User } from "app/modules/admin/models/users.types";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DynamicFlatNode } from "./dynamic-flat-node.types";
import { TreeService } from './tree.service';

export class DynamicDataSource implements DataSource<DynamicFlatNode> {

    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }
    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
                private _database: TreeService<User>) {}

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this._treeControl.expansionModel.changed.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });
        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    disconnect(collectionViewer: CollectionViewer): void {}

    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
    }

    toggleNode(node: DynamicFlatNode, expand: boolean) {
        const children = this._database.getChildren(node.key);
        const index = this.data.indexOf(node);
        if (!children || index < 0)
        {
            return;
        }

        node.isLoading = true;

        setTimeout(() => {
            if (expand)
            {
                const nodes = children.map(item =>
                new DynamicFlatNode(item.key, item.fullname, item.password, node.level + 1, this._database.isExpandable(item.key)));
                this.data.splice(index + 1, 0, ...nodes);
                node.isLoading = false;
            }
            else
            {
                let count = 0;
                for (let i = index + 1; i < this.data.length && this.data[i].level > node.level; i++, count++) {}
                this.data.splice(index + 1, count);
                node.isLoading = false;
            }

            this.dataChange.next(this.data);
        }, 1000);
    }
}
