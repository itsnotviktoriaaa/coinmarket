import {Component, HostListener, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {AllCoinsType} from "../../../types/all-coins.type";
import {CoinCapService} from "../../shared/services/coin-cap.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {debounceTime, tap} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {SortPriceUsdType} from "../../../types/sort-price-usd.type";
import {SortMarketCapUsdType} from "../../../types/sort-market-cap-usd.type";
import {SortChangePercent24HrType} from "../../../types/sort-change-percent-24-hr.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private coinCapService: CoinCapService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
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

  activeParams: ActiveParamsType = {};

  selectedCoinForBuy!: AllCoinsType;
  isOpenModal: boolean = false;

  ngOnInit() {

    this.searchField.valueChanges
      .pipe(
        tap((x) => {

          //т.е. так как слежу за инпутом с помощью valueChanges я сразу же по мере ввода в адресную строку добавляю query-параметр search и при обновлении адерс остаётся тот же соответственно, и т.к. обновила, то сработал OnInit, а значит в моём activeParams сохраняются значения, которые я могу взять
          this.activeParams.search = x;
          this.router.navigate([''], {
            queryParams: this.activeParams
          });

        }),
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

    //важно, чтобы код this.searchField.valueChanges... был над this.activatedRoute.queryParams. Чтобы мы успели подписаться на searchField через valueChanges, а затем уже устанавливали в searchField с помощью setValue параметр, который есть в адресной строке. И поэтому я уже подписана и жду изменение searchField, как только пришло изменение/значение, то срабатывает подписка и запрашиваем на сервере уже поиск

    this.activatedRoute.queryParams
      .subscribe((params: Params) => {

        if (params.hasOwnProperty('page')) {
          this.activeParams.page = params['page'];
          this.page = params['page'];
        }

        if (params.hasOwnProperty('search')) {
          this.activeParams.search = params['search'];
          this.searchField.setValue(params['search']);
        }

      });


    this.coinCapService.getAllCoins(2000)
      .subscribe({
        next: (data: {data: Array<AllCoinsType>}) => {
          this.allCoins = data.data;

          this.allCoins.forEach((item: AllCoinsType) => {
            item.priceUsd = Math.trunc(+(item.priceUsd) * 100) / 100;
            item.marketCapUsd = Math.trunc(+(item.marketCapUsd) * 100) / 100;
            item.changePercent24Hr = +(item.changePercent24Hr);
          });

          let allCoinsCopy = this.allCoins.slice();

          this.allCoins = allCoinsCopy.filter((item: AllCoinsType) => {
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
    this.router.navigate(['/coin/' + id]);
    this.searchCoins = [];
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }

  movePageUp () {
    this.activeParams.page = this.page;

    this.router.navigate(['/'], {
      queryParams: this.activeParams
    });

    window.scroll(0, 0);
  }

  sortOfPriceUsd(): void {
    if (this.priceUsdSortValue !== this.priceUp) {

      let allCoinsCopy = this.allCoins.slice();
      this.allCoins = allCoinsCopy.sort((a: AllCoinsType, b: AllCoinsType) => {
        return a.priceUsd - b.priceUsd;
      });

      this.priceUsdSortValue = this.priceUp;

    } else {

      let allCoinsCopy = this.allCoins.slice();
      this.allCoins = allCoinsCopy.sort((a: AllCoinsType, b: AllCoinsType) => {
        return b.priceUsd - a.priceUsd;
      });

      this.priceUsdSortValue = this.priceDown;

    }

  }

  sortOfMarketCap(): void {
    if (this.marketCapUsdSortValue !== this.marketCapUp) {

      let allCoinsCopy = this.allCoins.slice();

      this.allCoins = allCoinsCopy.sort((a: AllCoinsType, b: AllCoinsType) => {
        return a.marketCapUsd - b.marketCapUsd;
      });

      this.marketCapUsdSortValue = this.marketCapUp;

    } else {

      let allCoinsCopy = this.allCoins.slice();

      this.allCoins = allCoinsCopy.sort((a: AllCoinsType, b: AllCoinsType) => {
        return b.marketCapUsd - a.marketCapUsd;
      });

      this.marketCapUsdSortValue = this.marketCapDown;

    }

  }

  sortOfChangePercent24Hr(): void {
    if (this.changePercent24HrSortValue !== this.changePercent24HrUp) {

      let allCoinsCopy = this.allCoins.slice();

      this.allCoins = allCoinsCopy.sort((a: AllCoinsType, b: AllCoinsType) => {
        return a.changePercent24Hr - b.changePercent24Hr;
      });

      this.changePercent24HrSortValue = this.changePercent24HrUp;

    } else {

      let allCoinsCopy = this.allCoins.slice();

      this.allCoins = allCoinsCopy.sort((a: AllCoinsType, b: AllCoinsType) => {
        return b.changePercent24Hr - a.changePercent24Hr;
      });

      this.changePercent24HrSortValue = this.changePercent24HrDown;

    }

  }

  navigate(idOfCoin: string) :void {
    this.router.navigate(['/coin/' + idOfCoin]);
  }

  addToPortfolio(coin: AllCoinsType) {
    this.selectedCoinForBuy = coin;
    this.isOpenModal = true;
  }

  isCloseModal(): void {
    this.isOpenModal = false;
  }

}
