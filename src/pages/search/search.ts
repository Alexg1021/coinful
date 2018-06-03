import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  objectKeys:any = Object.keys;
  likedCoins:any[] = [];
  raw:any[] = [];
  allcoins:any = [];
  liked:any[] = [];

  constructor(public navCtrl: NavController,
              public loading: LoadingController,
              private _data:DataProvider,
              private storage:Storage,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

    let loader = this.loading.create({
      content:'Refreshing...',
      spinner: 'bubbles'
    });

    loader.present()
      .then(()=>{
      this.storage.get('likedCoins')
        .then((val)=>{
        this.likedCoins = val;

        this._data.allCoins()
          .subscribe((res)=>{
            console.log(res);
            this.raw = res['Data'];
            this.allcoins = res['Data'];

            loader.dismiss();

            this.storage.get('likedCoins').then((val)=>{
              this.liked = val;
            })
          })
      });

    });
  }

  searchCoins(ev:any){
    let val = ev.target.value;

    this.allcoins = this.raw;

    if(val && val.trim() != ''){
      let filtered = Object.keys(this.allcoins)
        .filter(key => val.toUpperCase().includes(key))
        .reduce((obj, key)=>{
          obj[key] = this.allcoins[key];
          return obj;
        }, {});
      this.allcoins = filtered;
    }


  }

  addCoin(coin:any){
    this.likedCoins.push(coin);
    this.storage.set('likedCoins',this.likedCoins);

  }


}
