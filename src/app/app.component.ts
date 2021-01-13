import { AfterViewInit, OnInit } from '@angular/core';
import { HTTPService } from './services/http.service';
import { forkJoin, Observable } from 'rxjs';
import { clipRequestDTO, Clip } from './models/clipRequestDTO';

import { Component,ChangeDetectionStrategy,ViewChild,TemplateRef,} from '@angular/core';
import { ConverterService } from './services/converter.service';
import { Game } from './models/gamesRequestDTO';
import { Streamer } from './models/streamerRequestDTO';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {}
  ngOnInit(): void {

    this.httpService.getExcluded().subscribe(
      data => this.excludedStreamers = data);
    }
  title = 'twAPIUI';

  clips: Clip[] = [];
  games!: Game[];

  minViews:number = 1;
  queryLengthPerGame:number = 20;
  maxAge:String = "00:30";

  excludedStreamers:String = "";
  excludedGames : Number[] = [512710,21779,138585,29595,518204];//Warzone,LoL,Heartstone,Dota2,Fifa21


  selectedStreamers: string[] = ["boxbox","xqcow","gmhikaru","JustaMinx","knut","pokelawls","loltyler1","myth","forsen","ludwig","ray__c","itssliker","nmplol","destiny","hasanabi","amouranth","maya","botezlive","sashagrey","codemiko","greekgodx","sodapoppin","shroud","tfue","timthetatman","summit1g","asmongold","jinnytty","esfandtv","mizkif","healthygamer_gg","sweet_anita"];
  now = new Date();

  constructor(private httpService: HTTPService, private converterService:ConverterService) {}

  getClips() {
    this.httpService.requestClips().subscribe(
      (data) => {
        this.clips = data.data;
      },
      (error) => {}
    );
  }

  getGames(algo:string) {
    this.httpService.getTopGames(15).subscribe(
      async (data) => {
        this.games = data.data;
        let gameIds : number[] = [];
        this.games.forEach(game => {
          if(!this.excludedGames.includes(Number(game.id))){
            gameIds.push(Number(game.id))
          }
        });
        

        this.getClipsForTopGames(algo,gameIds);
      },
      (error) => {}
    );
  }

  async getClipsForTopGames(algo:string, gameIds : number[]) {
    console.log("started")
    this.now = new Date();
    let d = new Date();
    d.setMinutes(d.getMinutes()-Number(this.maxAge.substr(3,5)));
    d.setHours(d.getHours()-Number(this.maxAge.substr(0,2)));
    
    const time :string = d.toISOString().substring(0,19)+"Z";
    const count : number = this.queryLengthPerGame;
    const smallCount = Math.round(count*0.5);
    const verySmallCount =Math.round(smallCount*0.5);
    const largeCount =Math.round(count*2);

    let answers : Clip[][] = [];

    let returns:number = 0;
    
    for (const [i, value] of gameIds.entries()) {
      let c = i<5?largeCount:(i<10?count:(i<15?smallCount:verySmallCount));
      this.httpService.getClipsForGameSince(value,c,time).subscribe( 
        result => {
          answers.push(result.data);
          returns++;
          //console.log(returns,value,result.data,answers);
        }, 
        error => {
          returns++;
          console.log("error for "+gameIds[i]);
        }
        );
    }
    while(returns<gameIds.length){
      await this.delay(200);
    }

    let items: Clip[] = [];
    for (const [i, gameclips] of answers.entries()) {
      for (const [j, clip] of gameclips.entries()) {
        if(!this.excludedStreamers.includes(clip.broadcaster_name)){
            items.push(clip);
        }
      }
    }
    this.clips = this.sortAlgo(items,algo,"en");
    console.log(this.clips)
    console.log("done");
  }

  async getStreamers(){
    let streamers:Streamer[] = [];
    let returns:number = 0;
    this.selectedStreamers.forEach(str => this.httpService.getStreamerInfo(str).subscribe(
      result => {
        streamers.push(result.data[0]),
        returns++;
        //console.log(returns,value,result.data,answers);
      }, 
      error => {
        returns++;
        console.log("error for "+str);
      }
    ));
    while(returns<this.selectedStreamers.length){
      await this.delay(200);
    }
    streamers = streamers.filter(s => s.is_live);
    await this.getClipsForSelectedStreamers("time",streamers);

  }

  async getClipsForSelectedStreamers(algo:string, streamers:Streamer[]) {
    console.log("started")
    this.now = new Date();
    let d = new Date();
    d.setMinutes(d.getMinutes()-Number(this.maxAge.substr(3,5)));
    d.setHours(d.getHours()-Number(this.maxAge.substr(0,2)));
    
    const time :string = d.toISOString().substring(0,19)+"Z";
    const count : number = this.queryLengthPerGame;

    let answers : Clip[][] = [];

    let returns:number = 0;
    
    for (const [i, value] of streamers.entries()) {
      
      this.httpService.getClipsForStreamerSince(value.id,count,time).subscribe( 
        result => {
          answers.push(result.data);
          returns++;
          //console.log(returns,value,result.data,answers);
        }, 
        error => {
          returns++;
          console.log("error for "+streamers[i]);
        }
        );
    }
    while(returns<streamers.length){
      await this.delay(200);
    }

    let items: Clip[] = [];
    for (const [i, gameclips] of answers.entries()) {
      for (const [j, clip] of gameclips.entries()) {
            items.push(clip);
      }
    }
    this.clips = this.sortAlgo(items,algo,"");

    console.log(this.clips)
    console.log("done");
  }

  sortAlgo(array:Clip[],input:string,language:String):Clip[]{  

    let tmp = array.filter(c => c.view_count>=this.minViews);
    if(language != ""){
      tmp = tmp.filter(c => c.language==language);
    }
    if(input == "time"){
      return tmp.sort(function (a, b) {
        return new Date(b.created_at).getTime() -  new Date(a.created_at).getTime();
      });
    }else if(input == "views"){
      return tmp.sort(function (a, b) {
        return b.view_count - a.view_count;
      });
    }
    return array;

  }

  auth() {
    this.httpService.getAuth();
  }

  age(input:Date):string{
    let time = new Date().getTime() - new Date(input).getTime();
    let result = new Date(0,0,0);
    result.setMilliseconds(time);
    let min = result.getMinutes()<10 ? '0'+result.getMinutes():result.getMinutes();
    return result.getHours()+":"+min;
  }

  openAll(){
    for(let clip of this.clips){
        window.open(clip.url, "_blank");
    }
  }


  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
