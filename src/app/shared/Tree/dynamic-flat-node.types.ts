export class DynamicFlatNode {
    constructor(
            public key: string,
            public item: string,
            public status: string,
            public level = 1,
            public expandable = false,
            public isLoading = false
    ){}
}
