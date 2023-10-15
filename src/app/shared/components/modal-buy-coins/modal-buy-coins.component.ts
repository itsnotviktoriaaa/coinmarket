import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AllCoinsType} from "../../../../types/all-coins.type";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'modal-buy-coins',
  templateUrl: './modal-buy-coins.component.html',
  styleUrls: ['./modal-buy-coins.component.scss']
})
export class ModalBuyCoinsComponent implements OnInit {

  constructor() {
  }

  @Input() selectedCoinForBuy!: AllCoinsType;
  @Input() isOpenModal: boolean = false;
  @Output() isCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  pathToLogo = environment.pathToLogo;

  countOfCoins: number = 0;

  ngOnInit() {

  }

  closeModal(): void {
    this.isOpenModal = false;
    this.isCloseModal.emit(false);
  }

  buyCoins() {
    console.log(+this.countOfCoins);
  }

  keyPressOnInput(event: KeyboardEvent): boolean {

    const regExForInputWhenUserBuyCoins = /^[0-9]+$/;

    return !(!regExForInputWhenUserBuyCoins.test(event.key) && event.code !== "Backspace");

    //эта строчка верхняя вот такая, которая снизу

    // if (!charOnlyRegEx.test(event.key) && event.code !== "Backspace") return false;
    // else {
    //   return true;
    // }

  }


}
