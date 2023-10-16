import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AllCoinsType} from "../../../../types/all-coins.type";
import {environment} from "../../../../environments/environment.development";
import {PurchasedCoinsType} from "../../../../types/purchased-coins.type";
import {LocalStorageChangeService} from "../../services/local-storage-change.service";

@Component({
  selector: 'modal-buy-coins',
  templateUrl: './modal-buy-coins.component.html',
  styleUrls: ['./modal-buy-coins.component.scss']
})
export class ModalBuyCoinsComponent implements OnInit {

  constructor(private localStorageChangeService: LocalStorageChangeService) {

    this.arrayFromPurchasedCoins = {
      purchasedCoins: [{
        idOfCoin: '',
        priceUsd: 0,
        symbol: '',
        quantityOfBuyingCoins: 0,
        commonPriceUsdOfBuyingCoins: 0
      }],
      commonPriceUsdOfAllCoinsInPortfolio: 0
    }

  }

  @Input() selectedCoinForBuy!: AllCoinsType;
  @Input() isOpenModal: boolean = false;
  @Output() isCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  pathToLogo = environment.pathToLogo;

  countOfCoins: number | null = null;

  arrayFromPurchasedCoins!: PurchasedCoinsType;

  ngOnInit() {

    this.getPortfolioFromLocalStorage();

  }

  closeModal(): void {
    this.isOpenModal = false;
    this.countOfCoins = null;
    this.isCloseModal.emit(false);
  }

  buyCoins() {

    if (this.countOfCoins && this.countOfCoins > 0) {
      this.arrayFromPurchasedCoins.purchasedCoins.push({idOfCoin: this.selectedCoinForBuy.id, priceUsd: this.selectedCoinForBuy.priceUsd, symbol: this.selectedCoinForBuy.symbol, quantityOfBuyingCoins: +this.countOfCoins, commonPriceUsdOfBuyingCoins: this.selectedCoinForBuy.priceUsd * +this.countOfCoins})
      this.arrayFromPurchasedCoins.commonPriceUsdOfAllCoinsInPortfolio += this.selectedCoinForBuy.priceUsd * +this.countOfCoins;

      this.addToLocalStorage();
      this.countOfCoins = null;

    }


    console.log(this.arrayFromPurchasedCoins);


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

  addToLocalStorage(): void {

    localStorage.setItem('portfolio', JSON.stringify(this.arrayFromPurchasedCoins));
    this.localStorageChangeService.addToLocalStorage();

  }

  getPortfolioFromLocalStorage(): void {

    let portfolioFromLocalStorageStringify = localStorage.getItem('portfolio');

    if (portfolioFromLocalStorageStringify) {
      this.arrayFromPurchasedCoins = JSON.parse(portfolioFromLocalStorageStringify);
    }

    console.log(this.arrayFromPurchasedCoins);

  }


}
