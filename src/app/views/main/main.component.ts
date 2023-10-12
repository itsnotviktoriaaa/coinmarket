import {Component, HostListener, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {AllCoinsType} from "../../../types/all-coins.type";
import {CoinCapService} from "../../shared/services/coin-cap.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {LoaderService} from "../../shared/services/loader.service";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private coinCapService: CoinCapService,
              private loaderService: LoaderService,
              private router: Router) {
  }

  pathToLogo = environment.pathToLogo;

  allCoins: AllCoinsType[] = [];
  quantityOfPages: number = 0;
  searchCoins: AllCoinsType[] = [];
  showedSearch: boolean = false;
  searchField = new FormControl();
  page: number = 1;

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

}
