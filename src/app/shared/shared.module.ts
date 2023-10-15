import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ModalBuyCoinsComponent } from './components/modal-buy-coins/modal-buy-coins.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    LoaderComponent,
    ModalBuyCoinsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    LoaderComponent,
    ModalBuyCoinsComponent
  ]
})
export class SharedModule { }
