import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared/shared.module";
import { ShoppingComponent } from "./shopping.component";

@NgModule({
    declarations: [
        ShoppingComponent
    ],
    imports     : [
        RouterModule,
        OverlayModule,
        PortalModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        SharedModule
    ],
    exports     : [
        ShoppingComponent
    ]
})
export class ShoppingModule
{
}
