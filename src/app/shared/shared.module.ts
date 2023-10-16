import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ModalBuyCoinsComponent } from './components/modal-buy-coins/modal-buy-coins.component';
import {FormsModule} from "@angular/forms";
import { AddMarkBeforeNumberPipe } from './pipes/add-mark-before-number.pipe';



@NgModule({
  declarations: [
    LoaderComponent,
    ModalBuyCoinsComponent,
    AddMarkBeforeNumberPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    LoaderComponent,
    ModalBuyCoinsComponent,
    AddMarkBeforeNumberPipe
  ]
})
export class SharedModule { }
