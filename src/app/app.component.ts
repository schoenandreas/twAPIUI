import { AfterViewInit, OnInit } from '@angular/core';
import { HTTPService } from './services/http.service';
import { forkJoin, Observable } from 'rxjs';
import { clipRequestDTO, Clip } from './models/clipRequestDTO';

import { Component,ChangeDetectionStrategy,ViewChild,TemplateRef,} from '@angular/core';
import { ConverterService } from './services/converter.service';
import { Game } from './models/gamesRequestDTO';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {}
  ngOnInit(): void {}
  title = 'twAPIUI';

  clips!: Clip[];
  games!: Game[];

  minViews:number = 1;
  queryLengthPerGame:number = 10;
  maxAge:String = "01:00";

  excludedStreamers:String[] = ["FarhadXRay","ANTILIPSI","Minnie_Pinkunotori","kobemir","bukse"];

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
    this.httpService.getTopGames(20).subscribe(
      (data) => {
        this.games = data.data;
        let gameIds : number[] = [];
        this.games.forEach(game => gameIds.push(Number(game.id)));
        this.getClipsForTopGames(algo,gameIds);
      },
      (error) => {}
    );
  }

  getClipsForTopGames(algo:string, gameIds : number[]) {
    this.now = new Date();
    let d = new Date();
    d.setMinutes(d.getMinutes()-Number(this.maxAge.substr(3,5)));
    d.setHours(d.getHours()-Number(this.maxAge.substr(0,2)));
    
    const time :string = d.toISOString().substring(0,19)+"Z";
    const count : number = this.queryLengthPerGame;
    const smallCount = Math.round(count*0.5);
    const verySmallCount =Math.round(smallCount*0.5);
    const largeCount =Math.round(count*2);
    
    //if anyone sees this don't judge me, I was tired...
    forkJoin({
      a: this.httpService.getClipsForGameSince(gameIds[0],largeCount,time),
      b: this.httpService.getClipsForGameSince(gameIds[1],largeCount,time),
      c: this.httpService.getClipsForGameSince(gameIds[2],largeCount,time),
      d: this.httpService.getClipsForGameSince(gameIds[3],largeCount,time),
      e: this.httpService.getClipsForGameSince(gameIds[4],largeCount,time),
      f: this.httpService.getClipsForGameSince(gameIds[5],count,time),
      g: this.httpService.getClipsForGameSince(gameIds[6],count,time),
      h: this.httpService.getClipsForGameSince(gameIds[7],count,time),
      i: this.httpService.getClipsForGameSince(gameIds[8],count,time),
      j: this.httpService.getClipsForGameSince(gameIds[9],count,time),
      k: this.httpService.getClipsForGameSince(gameIds[10],smallCount,time),
      l: this.httpService.getClipsForGameSince(gameIds[11],smallCount,time),
      m: this.httpService.getClipsForGameSince(gameIds[12],smallCount,time),
      n: this.httpService.getClipsForGameSince(gameIds[13],smallCount,time),
      o: this.httpService.getClipsForGameSince(gameIds[14],smallCount,time),
      p: this.httpService.getClipsForGameSince(gameIds[15],verySmallCount,time),
      q: this.httpService.getClipsForGameSince(gameIds[16],verySmallCount,time),
      r: this.httpService.getClipsForGameSince(gameIds[17],verySmallCount,time),
      s: this.httpService.getClipsForGameSince(gameIds[18],verySmallCount,time),
      t: this.httpService.getClipsForGameSince(gameIds[19],verySmallCount,time),

    })
    .subscribe(({a, b, c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t}) => {
      let items:Clip[] =  [ ...a.data, ...b.data, ...c.data, ...d.data, ...e.data, ...f.data, ...g.data, ...h.data, ...i.data, ...j.data, ...k.data, ...l.data, ...m.data, ...n.data, ...o.data, ...p.data, ...q.data, ...r.data, ...s.data, ...t.data];
      
      this.clips = this.sortAlgo(items,algo);
      console.log("done");
    });
    
  }

  sortAlgo(array:Clip[],input:string):Clip[]{

    let tmp = array.filter(c => c.language=="en" && c.view_count>=this.minViews && !this.excludedStreamers.includes(c.broadcaster_name));
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
