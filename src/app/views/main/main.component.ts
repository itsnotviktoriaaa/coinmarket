import {Component, HostListener, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {AllCoinsType} from "../../../types/all-coins.type";
import {CoinCapService} from "../../shared/services/coin-cap.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {SortPriceUsdType} from "../../../types/sort-price-usd.type";
import {SortMarketCapUsdType} from "../../../types/sort-market-cap-usd.type";
import {SortChangePercent24HrType} from "../../../types/sort-change-percent-24-hr.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private coinCapService: CoinCapService,
              private router: Router) {
  }

  pathToLogo = environment.pathToLogo;

  allCoins: AllCoinsType[] = [];

  searchCoins: AllCoinsType[] = [];
  showedSearch: boolean = false;
  searchField = new FormControl();

  page: number = 1;

  priceUsdSortValue: string | SortPriceUsdType = '';
  priceDown = SortPriceUsdType.priceDown;
  priceUp = SortPriceUsdType.priceUp;

  marketCapUsdSortValue: string | SortMarketCapUsdType = '';
  marketCapDown = SortMarketCapUsdType.marketCapDown;
  marketCapUp = SortMarketCapUsdType.marketCapUp;

  changePercent24HrSortValue: string | SortChangePercent24HrType = '';
  changePercent24HrDown = SortChangePercent24HrType.changePercent24HrDown;
  changePercent24HrUp = SortChangePercent24HrType.changePercent24HrUp;

  ngOnInit() {

    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe((value) => {
          if (value && value.length > 2) {
            this.coinCapService.searchProducts(value)
              .subscribe((data: {data: Array<AllCoinsType>}) => {
                this.searchCoins = data.data;
                this.showedSearch = true;
              });
          } else {
            this.searchCoins = [];
          }
      });

    this.coinCapService.getAllCoins()
      .subscribe({
        next: (data: {data: Array<AllCoinsType>}) => {
          this.allCoins = data.data;
          this.allCoins.forEach((item: AllCoinsType) => {
            item.priceUsd = Math.trunc(+(item.priceUsd) * 100) / 100;
            item.marketCapUsd = Math.trunc(+(item.marketCapUsd) * 100) / 100;
            item.changePercent24Hr = +(item.changePercent24Hr);
          });

          this.allCoins = this.allCoins.filter((item: AllCoinsType) => {
            return item.priceUsd > 0 && item.marketCapUsd > 0 && item.changePercent24Hr != null;
            //with help (item.changePercent24Hr != null) exclude empty lines without percentages as well
          });


        },
        error: (errorResponse: HttpErrorResponse) => {
          //sth happen
        }
      });
  }

  selectProduct(id: string): void {
    // this.router.navigate(['/coin/' + id]);
    console.log('При клике будет пользователь попадать на страницу монеты и мы закрываем блок потом полностью этот и очищаем поле');
    this.searchField.setValue('');
    this.searchCoins = [];
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }

  movePageUp () {
    window.scroll(0, 0);
  }

  sortOfPriceUsd(): void {
    if (this.priceUsdSortValue !== this.priceUp) {

      this.allCoins = this.allCoins.sort((a: AllCoinsType, b: AllCoinsType) => {
        return a.priceUsd - b.priceUsd;
      });

      this.priceUsdSortValue = this.priceUp;

    } else {

      this.allCoins = this.allCoins.sort((a: AllCoinsType, b: AllCoinsType) => {
        return b.priceUsd - a.priceUsd;
      });

      this.priceUsdSortValue = this.priceDown;

    }

  }

  sortOfMarketCap(): void {
    if (this.marketCapUsdSortValue !== this.marketCapUp) {

      this.allCoins = this.allCoins.sort((a: AllCoinsType, b: AllCoinsType) => {
        return a.marketCapUsd - b.marketCapUsd;
      });

      this.marketCapUsdSortValue = this.marketCapUp;

    } else {

      this.allCoins = this.allCoins.sort((a: AllCoinsType, b: AllCoinsType) => {
        return b.marketCapUsd - a.marketCapUsd;
      });

      this.marketCapUsdSortValue = this.marketCapDown;

    }

  }

  sortOfChangePercent24Hr(): void {
    if (this.changePercent24HrSortValue !== this.changePercent24HrUp) {

      this.allCoins = this.allCoins.sort((a: AllCoinsType, b: AllCoinsType) => {
        return a.changePercent24Hr - b.changePercent24Hr;
      });

      this.changePercent24HrSortValue = this.changePercent24HrUp;

    } else {

      this.allCoins = this.allCoins.sort((a: AllCoinsType, b: AllCoinsType) => {
        return b.changePercent24Hr - a.changePercent24Hr;
      });

      this.changePercent24HrSortValue = this.changePercent24HrDown;

    }

  }

}
