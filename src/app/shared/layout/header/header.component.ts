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
        this.coinsFromLocalStorage.purchasedCoins.shift();
        this.coinsFromLocalStorage.commonPriceUsdOfAllCoinsInPortfolio = Math.trunc(+(this.coinsFromLocalStorage?.commonPriceUsdOfAllCoinsInPortfolio) * 100) / 100;
      }
    }

  }

}
