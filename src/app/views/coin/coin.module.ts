import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinRoutingModule } from './coin-routing.module';
import { DetailComponent } from './detail/detail.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    SharedModule,
    CoinRoutingModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}}
  ]
})
export class CoinModule { }
