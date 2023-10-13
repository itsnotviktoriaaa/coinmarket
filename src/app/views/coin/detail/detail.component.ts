import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CoinCapService} from "../../../shared/services/coin-cap.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AllCoinsType} from "../../../../types/all-coins.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../../environments/environment.development";
import {Chart, ChartType} from "chart.js/auto";
import {CoinHistoryType} from "../../../../types/coin-history.type";
import {Subject} from "rxjs";
import {IntervalForChartType} from "../../../../types/interval-for-chart.type";
import {DifferenceForChartType} from "../../../../types/difference-for-chart.type";


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


  choseInterval: IntervalForChartType | null = null;
  h1Interval: IntervalForChartType.h1 = IntervalForChartType.h1;
  d1Interval: IntervalForChartType.d1 = IntervalForChartType.d1;


  differenceFor1Day: DifferenceForChartType.differenceFor1Day = DifferenceForChartType.differenceFor1Day;
  differenceFor31Days: DifferenceForChartType.differenceFor31Days = DifferenceForChartType.differenceFor31Days;

  isFirstClickIn7Days: boolean = false;

  millisecondsFrom1970ToTodayIsEnd: number = 0;
  start: number = 0;


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

      this.getHistory(params['id']);

    });

  }

  getHistory(idOfCoin: string, interval?: IntervalForChartType, difference?: DifferenceForChartType) {

    if (difference) {
      this.getTimeFromTodayTo1970(difference);
    } else {
      this.getTimeFromTodayTo1970();
    }

    this.choseInterval = this.h1Interval;
    if (interval) {
      this.choseInterval = interval;
    }

    this.coinCapService.getCoinHistory(idOfCoin, this.choseInterval, this.start, this.millisecondsFrom1970ToTodayIsEnd)
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
      });
  }

  getTimeFromTodayTo1970(difference?: DifferenceForChartType): void {
    let diffToCalculateStartAndEnd: DifferenceForChartType = this.differenceFor1Day;
    if (difference) {
      diffToCalculateStartAndEnd = difference;
    }

    this.millisecondsFrom1970ToTodayIsEnd = new Date().getTime();
    this.start = this.millisecondsFrom1970ToTodayIsEnd - diffToCalculateStartAndEnd;
  }

  transformHistory(): void {
    if (this.historyOfCoin) {
      this.labels = this.historyOfCoin.map((item: CoinHistoryType) => {
        let date = (item.date as Date).getDate();
        let month = (item.date as Date).getMonth() + 1;
        let year = (item.date as Date).getFullYear();

        let hour = (item.date as Date).getHours();
        let minutes = (item.date as Date).getMinutes();
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
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
        
        if (!this.isFirstClickIn7Days) {
          this.callChart();
        } else {
          this.historyOfCoin = this.historyOfCoin!.slice(-7);
          this.labels = this.labels!.slice(-7);
          this.priceUsdFromHistory = this.priceUsdFromHistory!.slice(-7);
          this.callChart();
          this.isFirstClickIn7Days = false;
        }

      }
    });

  }

  backOnMainPage(): void {
    this.router.navigate(['']);
  }

  showNewChart(interval: IntervalForChartType, difference: DifferenceForChartType, quantityOfDays?: '7days'): void {

    if (this.myLineChart) {
      this.myLineChart.destroy();
    }

    if (quantityOfDays) {
      if (this.historyOfCoin?.length === 30 || this.historyOfCoin?.length === 31 || this.historyOfCoin?.length === 28 || this.historyOfCoin?.length === 29) {

        this.historyOfCoin = this.historyOfCoin.slice(-7);
        this.labels = this.labels!.slice(-7);
        this.priceUsdFromHistory = this.priceUsdFromHistory!.slice(-7);
        this.callChart();
        return;

      } else {

        this.isFirstClickIn7Days = true;
        this.getHistory(this.coin!.id, interval, difference);
        return;
      }
    }

    this.getHistory(this.coin!.id, interval, difference);
  }

}
