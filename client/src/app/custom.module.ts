import { NgModule, } from '@angular/core';
import { CommonModule, } from '@angular/common';

import { CovalentLayoutModule, CovalentStepsModule, CovalentCommonModule /*, any other modules */ } from '@covalent/core';

import {
    MatListModule, MatButtonModule, MatCardModule, MatIconModule,
    MatInputModule, MatMenuModule, MatSidenavModule, MatToolbarModule,
    MatExpansionModule, MatTooltipModule, MatDialogModule, MatSliderModule, MatDatepickerModule,
    MatSnackBarModule, MatNativeDateModule,
    // MatTooltipMoudule
} from '@angular/material';

import { FlexLayoutModule, } from '@angular/flex-layout';

import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const FLEX_LAYOUT_MODULES: any[] = [
    FlexLayoutModule,
];

const ANGULAR_MODULES: any[] = [
    BrowserAnimationsModule,
    FormsModule,

];

const MATERIAL_MODULES: any[] = [
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatSidenavModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
];

const COVALENT_MODULES: any[] = [
    CovalentLayoutModule,
    CovalentStepsModule,
    CovalentCommonModule,
];

@NgModule({
    imports: [
        CommonModule,
        ANGULAR_MODULES,
        MATERIAL_MODULES,
        COVALENT_MODULES,
        FLEX_LAYOUT_MODULES,
    ],
    declarations: [
        //GoogleSignInComponent

    ],
    exports: [
        ANGULAR_MODULES,
        MATERIAL_MODULES,
        COVALENT_MODULES,
        FLEX_LAYOUT_MODULES,
        //GoogleSignInComponent,
    ]
})

export class CustomModule {
}
