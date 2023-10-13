import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {AllCoinsType} from "../../../types/all-coins.type";
import {CoinHistoryType} from "../../../types/coin-history.type";

@Injectable({
  providedIn: 'root'
})
export class CoinCapService {

  constructor(private http: HttpClient) { }


  getAllCoins(): Observable<{data: Array<AllCoinsType>}> {
    return this.http.get<{data: Array<AllCoinsType>}>('https://api.coincap.io/v2/assets?limit=2000');
  }

  searchProducts(query: string): Observable<{data: Array<AllCoinsType>}> {
    return this.http.get<{data: Array<AllCoinsType>}>(`https://api.coincap.io/v2/assets?search=${query}`);
  }

  getCoin(nameOfCoin: string):Observable<{data: AllCoinsType}> {
    return this.http.get<{data: AllCoinsType}>('https://api.coincap.io/v2/assets/' + nameOfCoin);
  }

  getCoinHistory(nameOfCoin: string):Observable<Array<CoinHistoryType>> {
    return this.http.get<{data: Array<CoinHistoryType>}>('https://api.coincap.io/v2/assets/' + nameOfCoin + '/history?interval=' + 'd1')
      .pipe(
        map((result: {data: Array<CoinHistoryType>}) => result.data)
      )
  }

}
