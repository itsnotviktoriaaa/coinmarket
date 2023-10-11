import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {CoinCapService} from "../services/coin-cap.service";
import {AllCoinsType} from "../../../types/all-coins.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private coinCarService: CoinCapService) {
  }

  allCoins: AllCoinsType[] = [];

  ngOnInit() {
    this.coinCarService.getAllCoins(20)
      .subscribe({
        next: (data: {data: Array<AllCoinsType>}) => {
          this.allCoins = data.data;
          this.allCoins.forEach((item: AllCoinsType) => {
            item.priceUsd = Math.trunc(+(item.priceUsd) * 100) / 100;
            item.marketCapUsd = Math.trunc(+(item.marketCapUsd) * 100) / 100;
          });

          this.allCoins = this.allCoins.filter((item: AllCoinsType) => {
            return item.priceUsd > 0;
          })
        },
        error: (errorResponse: HttpErrorResponse) => {
          //sth happen
        }
      });
  }

}
