import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinRoutingModule } from './coin-routing.module';
import { DetailComponent } from './detail/detail.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";


@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    CoinRoutingModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}}
  ]
})
export class CoinModule { }
