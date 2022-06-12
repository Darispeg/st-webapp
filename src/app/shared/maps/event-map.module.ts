import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { EventMapComponent } from './event-map.component';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyDD1xQPn2Oq_THLbA877lSedaPzyjKgYcM'
        })
      ],
    declarations: [ EventMapComponent ],
    bootstrap: [ EventMapComponent ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventMapModule{}