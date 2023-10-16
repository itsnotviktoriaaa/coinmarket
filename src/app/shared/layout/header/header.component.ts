import {Component, HostListener, OnInit} from '@angular/core';
import {CoinCapService} from "../../services/coin-cap.service";
import {map} from "rxjs";
import {AllCoinsType} from "../../../../types/all-coins.type";
import {environment} from "../../../../environments/environment.development";
import {PurchasedCoinsType} from "../../../../types/purchased-coins.type";
import {LocalStorageChangeService} from "../../services/local-storage-change.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private coinCapService: CoinCapService,
              private localStorageChangeService: LocalStorageChangeService) {
  }

  pathToLogo = environment.pathToLogo;
  popularCoins!: AllCoinsType[];
  isOpenPopupPortfolioOfCoins: boolean = false;
  isOpenModalWindow: boolean = false;

  coinsFromLocalStorage: PurchasedCoinsType | null = null;

  oldPriceUsdOfAllCoinsInPortfolio: number = 0;
  differenceForToCalculateChangeCommonPriceUsdOfAllCoinsInPortfolioAfterRequest: number = 0;
  percentOfChangeOfCommonPriceUsdOfAllCoinsInPortfolioAfterRequest: number = 0;

  ngOnInit(): void {

    this.coinCapService.getAllCoins(3)
      .pipe(
        map((result: { data: AllCoinsType[] }) => {
          return result.data;
        })
      )
      .subscribe((data: AllCoinsType[]) => {
        this.popularCoins = data;

        this.popularCoins.forEach((item: AllCoinsType) => {
          item.priceUsd = Math.trunc(+(item.priceUsd) * 100) / 100;
        });

      });

    this.localStorageChangeService.localStorageChange$
      .subscribe((localStorageChange: boolean) => {

        if (localStorageChange) {
          this.getPortfolioFromLocalStorage();
        }

      });

    this.getPortfolioFromLocalStorage();

    this.requestOnBackendForUpdatePriceUsd();
    this.updatePortfolioInLocalStorage();

  }

  toggleOpenPopupPortfolioOfCoins(): void {
    this.isOpenPopupPortfolioOfCoins = !this.isOpenPopupPortfolioOfCoins;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {

    if (!(
      (event.target as Element).closest('.header-item-body') ||
      (event.target as Element).closest('.header-item-head')
    )) {
      this.isOpenPopupPortfolioOfCoins = false;
    }

  }

  getPortfolioFromLocalStorage(): void {

    let portfolioFromLocalStorageStringify = localStorage.getItem('portfolio');

    if (portfolioFromLocalStorageStringify) {
      this.coinsFromLocalStorage = JSON.parse(portfolioFromLocalStorageStringify);


      if (this.coinsFromLocalStorage) {

        this.coinsFromLocalStorage.commonPriceUsdOfAllCoinsInPortfolio = 0;

        this.coinsFromLocalStorage.purchasedCoins.forEach((item) => {
          item.commonPriceUsdOfBuyingCoins = Math.trunc(+(item.commonPriceUsdOfBuyingCoins) * 100) / 100;
          this.coinsFromLocalStorage!.commonPriceUsdOfAllCoinsInPortfolio += item.commonPriceUsdOfBuyingCoins;
        });

          //для удаления конкретно первого объекта с пустыми значениями, т.к в modal-buy-coins понадобилось инициализировать порфтолио уже с нулевым  объектом одним, иначе не считывало при пуше других эту переменную
        let isExistObjectNullInPurchasedCoinsInPortfolio = this.coinsFromLocalStorage.purchasedCoins.some((item) => {
          return item.idOfCoin === '';
        });


        if (isExistObjectNullInPurchasedCoinsInPortfolio) {
          this.coinsFromLocalStorage.purchasedCoins.shift();
        }

        this.coinsFromLocalStorage.commonPriceUsdOfAllCoinsInPortfolio = Math.trunc(+(this.coinsFromLocalStorage?.commonPriceUsdOfAllCoinsInPortfolio) * 100) / 100;
      }

    }

  }

  requestOnBackendForUpdatePriceUsd(): void {

    console.log(this.coinsFromLocalStorage);

    if (this.coinsFromLocalStorage) {
      this.oldPriceUsdOfAllCoinsInPortfolio = this.coinsFromLocalStorage.commonPriceUsdOfAllCoinsInPortfolio;

      //сбрасываем значение, так как оно ниже будет += каждого купленного коина
      this.coinsFromLocalStorage.commonPriceUsdOfAllCoinsInPortfolio = 0;

      this.coinsFromLocalStorage.purchasedCoins.forEach((item) => {

        this.coinCapService.getCoin(item.idOfCoin)
          .pipe(
            map((result: { data: AllCoinsType }) => {
              return result.data;
            })
          )
          .subscribe((data: AllCoinsType) => {

            item.priceUsd = Math.trunc(+(data.priceUsd) * 100) / 100;
            item.commonPriceUsdOfBuyingCoins = Math.trunc((+(data.priceUsd) * item.quantityOfBuyingCoins) * 100) / 100;

            this.coinsFromLocalStorage!.commonPriceUsdOfAllCoinsInPortfolio += item.commonPriceUsdOfBuyingCoins;

            this.localStorageChangeService.requestOnBackendForUpdatePriceUsdIsOver();

          });

      });


      this.localStorageChangeService.requestOnBackendForUpdatePriceUsdIsOver$
        .subscribe((requestOnBackendForUpdatePriceUsdIsOver$requestOnBackendForUpdatePriceUsdIsOver: boolean) => {
          if (requestOnBackendForUpdatePriceUsdIsOver$requestOnBackendForUpdatePriceUsdIsOver) {

            this.coinsFromLocalStorage!.commonPriceUsdOfAllCoinsInPortfolio = Math.trunc(+(this.coinsFromLocalStorage!.commonPriceUsdOfAllCoinsInPortfolio) * 100) / 100;

            this.differenceForToCalculateChangeCommonPriceUsdOfAllCoinsInPortfolioAfterRequest = Math.trunc((this.coinsFromLocalStorage!.commonPriceUsdOfAllCoinsInPortfolio - this.oldPriceUsdOfAllCoinsInPortfolio) * 100) / 100;

            this.localStorageChangeService.localStorageChange$
              .subscribe((localStorageChange: boolean) => {
                this.differenceForToCalculateChangeCommonPriceUsdOfAllCoinsInPortfolioAfterRequest = 0;
                this.percentOfChangeOfCommonPriceUsdOfAllCoinsInPortfolioAfterRequest = 0;
              });

            if (this.differenceForToCalculateChangeCommonPriceUsdOfAllCoinsInPortfolioAfterRequest !== 0) {
              this.percentOfChangeOfCommonPriceUsdOfAllCoinsInPortfolioAfterRequest = Math.trunc(((this.differenceForToCalculateChangeCommonPriceUsdOfAllCoinsInPortfolioAfterRequest * 100) / this.oldPriceUsdOfAllCoinsInPortfolio) * 100) / 100;
              console.log(this.percentOfChangeOfCommonPriceUsdOfAllCoinsInPortfolioAfterRequest);
            }

          }
        });

    }

  }

  updatePortfolioInLocalStorage(): void {

    if (this.coinsFromLocalStorage) {
      localStorage.setItem('portfolio', JSON.stringify(this.coinsFromLocalStorage));
    }

  }

}
