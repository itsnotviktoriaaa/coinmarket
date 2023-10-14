import {Component, OnInit} from '@angular/core';
import {CoinCapService} from "../../services/coin-cap.service";
import {map} from "rxjs";
import {AllCoinsType} from "../../../../types/all-coins.type";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private coinCapService: CoinCapService) {
  }

  pathToLogo = environment.pathToLogo;
  popularCoins!: AllCoinsType[];

  ngOnInit(): void {
    this.coinCapService.getAllCoins(3)
      .pipe(
        map((result: {data: AllCoinsType[]}) => {
          return result.data;
        })
      )
      .subscribe((data: AllCoinsType[]) => {
        this.popularCoins = data;

        this.popularCoins.forEach((item: AllCoinsType) => {
          item.priceUsd = Math.trunc(+(item.priceUsd) * 100) / 100;
        });

      });
  }

}
