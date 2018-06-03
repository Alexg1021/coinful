import {Component, ViewChild} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {Storage} from "@ionic/storage";
import Chart from 'chart.js';
import {SearchPage} from "../search/search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  objectKeys = Object.keys;
  likedCoins:any[];
  coins:Object;
  details:Object;
  detailToggle:any[] =  [];
  chart:Chart;
  showGraph:boolean = false;
  @ViewChild('canvasChart') canvasChart:any;

  constructor(public navCtrl: NavController,
              public loading:LoadingController,
              private storage:Storage,
              private dataProvider:DataProvider) {
    this.likedCoins = [];
    this.detailToggle = [];
    this.storage.remove('likedCoins');

  }

  ionViewDidLoad(){

  }

  ionViewWillEnter(){
    this.refreshCoins();
  }

  refreshCoins(){

    let loader = this.loading.create({
      content:'Refreshing...',
      spinner: 'bubbles'
    });

    loader.present().then(()=>{

      this.storage.get('likedCoins')
        .then((val)=>{
          //If the value is not set, then...
          if(!val){
            this.likedCoins.push('BTC','ETH','IOT');
            this.storage.set('likedCoins', this.likedCoins);

            this.dataProvider.getCoins(this.likedCoins)
              .subscribe((res)=>{
                this.coins = res;
                loader.dismiss();
              })
          }else{
            //It's set
            this.likedCoins = val;

            this.dataProvider.getCoins(this.likedCoins)
              .subscribe((res)=>{
                this.coins = res;
                loader.dismiss();
              })
          }

        })

    })
  }

  coinDetails(coin:any, index:number){
    if(this.detailToggle[index]){
      this.detailToggle[index] = false;
      this.showGraph = false;
    }else{
      this.detailToggle.fill(false);
      this.showGraph = false;

      this.dataProvider.getCoin(coin)
        .subscribe((res)=>{
          this.details = res['DISPLAY'][coin]['USD'];

          this.detailToggle[index] = true;

          this.dataProvider.getChart(coin)
            .subscribe((res)=>{

              let coinHistory = res['Data'].map((a)=>(a.close));
              setTimeout(()=>{
                let ctx = this.canvasChart;
                this.chart = {};
                this.chart = new Chart(ctx.nativeElement, {
                  type: 'line',
                  data: {
                    labels: coinHistory,
                    datasets: [{
                      data: coinHistory,
                      borderColor: "#3cba9f",
                      fill: false
                    }
                    ]
                  },
                  options: {
                    tooltips: {
                      callbacks: {
                        label: function(tooltipItems, data) {
                          return "$" + tooltipItems.yLabel.toString();
                        }
                      }
                    },
                    responsive: true,
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: false
                      }],
                      yAxes: [{
                        display: false
                      }],
                    }
                  }
                });

                this.showGraph = true;

              },250);
            });
        });
    }

  }

  swiped(index:number){
    this.detailToggle[index] = false;
  }

  removeCoin(coin:any){
    this.detailToggle.fill(false);

    this.likedCoins = this.likedCoins.filter(function(item){
      return item !== coin
    });

    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(()=>{
      this.refreshCoins();
    }, 300);
  }

  showSearch(){
    this.navCtrl.push(SearchPage);
  }
}
