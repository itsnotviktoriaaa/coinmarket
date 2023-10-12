import {Component, OnInit} from '@angular/core';
import {CoinCapService} from "../../../shared/services/coin-cap.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AllCoinsType} from "../../../../types/all-coins.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(private coinCapService: CoinCapService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snakeBar: MatSnackBar,) {
  }

  pathToLogo = environment.pathToLogo;

  coin!: AllCoinsType;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.coinCapService.getCoin(params['id'])
        .subscribe({
          next: (data: { data: AllCoinsType }) => {

            this.coin = data.data;

          },
          error: () => {
            this._snakeBar.open('No exist this coin. Please, find the right coin');
            this.router.navigate(['/']);
          }
        })
    });
  }

  backOnMainPage() {
    this.router.navigate(['']);
  }

}
