import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import {HttpHeaders} from "@angular/common/http";
// import 'rxjs/add/operator/catch';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  result:any;

  constructor(public http: HttpClient) {
    console.log('Hello DataProvider Provider');
  }

  getCoins(coins:any){
    let coinlist = '';

    coinlist = coins.join();

    return this.http.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinlist}&tsyms=USD`)
      .map((res)=> this.result = res);
  }

  getCoin(coin:any){
    return this.http.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD`)
      .map((res)=> this.result = res);
  }

  getChart(coin:any){
    return this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${coin}&tsym=USD&limit=30&aggregate=1`)
      .map((res)=> this.result = res);

  }

  allCoins(){
    // let corsHeaders = new HttpHeaders()
    //   .set('Access-Control-Allow-Origin', '*');

    return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist')
      .map((res)=>{
       return this.result = res
      })
  }

  errorHandler(err:any){
    console.log('in the error handler');
    console.log(err);
  }

}
