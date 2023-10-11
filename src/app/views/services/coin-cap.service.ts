import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AllCoinsType} from "../../../types/all-coins.type";

@Injectable({
  providedIn: 'root'
})
export class CoinCapService {

  constructor(private http: HttpClient) { }


  getAllCoins(numberOfLimit: number): Observable<{data: Array<AllCoinsType>}> {
    return this.http.get<{data: Array<AllCoinsType>}>('https://api.coincap.io/v2/assets?' + 'limit=' + numberOfLimit);
  }


}
