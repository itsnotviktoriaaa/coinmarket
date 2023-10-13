import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CoinCapService} from "../../../shared/services/coin-cap.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AllCoinsType} from "../../../../types/all-coins.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../../environments/environment.development";
import {Chart, ChartType} from "chart.js/auto";
import {CoinHistoryType} from "../../../../types/coin-history.type";
import {Subject, Subscription} from "rxjs";


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {

  constructor(private coinCapService: CoinCapService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snakeBar: MatSnackBar,
              private _elementRef: ElementRef) {
  }

  pathToLogo = environment.pathToLogo;

  coin?: AllCoinsType;

  myLineChart: Chart<ChartType,Array<number> | null,unknown> | null = null;

  @ViewChild('myChart')
  myChart!: ElementRef<HTMLCanvasElement>;

  historyOfCoin: CoinHistoryType[] | null = null;
  labels: Array<string> | null = null;
  priceUsdFromHistory: Array<number> | null = null;

  waitVariablesFromOnInit$: Subject<boolean> = new Subject<boolean>();

  myChartInitialized: HTMLCanvasElement | null = null;

  isChoseInterval: string = '';

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
        });

      this.coinCapService.getCoinHistory(params['id'])
        .subscribe({
          next: (data: CoinHistoryType[]) => {

            this.historyOfCoin = data;

            this.historyOfCoin.forEach((item: CoinHistoryType) => {
              item.date = new Date(item.date);
            });

            this.waitVariablesFromOnInit$.next(true);
          },
          error: () => {
            //
          }
        })

    });

  }

  transformHistory(): void {
    if (this.historyOfCoin) {
      this.labels = this.historyOfCoin.map((item: CoinHistoryType) => {
        let date = (item.date as Date).getDate();
        let month = (item.date as Date).getMonth() + 1;
        let year = (item.date as Date).getFullYear();
        return year + '-' + month + '-' + date;
      });

      this.priceUsdFromHistory = this.historyOfCoin.map((item: CoinHistoryType) => {
        return Math.trunc(+(item.priceUsd) * 100) / 100;
      });

    }

  }

  callChart(): void {

    this.myLineChart = new Chart(this.myChartInitialized as HTMLCanvasElement, {
      type: 'line',
      data: {
        labels: this.labels as Array<string>,
        datasets: [{
          label: '$ PriceUSD',
          data: this.priceUsdFromHistory,
          borderWidth: 1,
          borderColor: '#eb6036',
          backgroundColor: '#f5bb9b'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }

  ngAfterViewInit() {

    this.myChartInitialized = this.myChart.nativeElement;

    this.waitVariablesFromOnInit$.subscribe((waitVariablesFromOnInit: boolean) => {
      if (waitVariablesFromOnInit) {

        this.transformHistory();
        this.callChart();
        console.log(this.labels);
        console.log(this.priceUsdFromHistory);

      }
    });

  }

  backOnMainPage(): void {
    this.router.navigate(['']);
  }

  showChart(interval: string): void {
    this.isChoseInterval = interval;
  }

}
