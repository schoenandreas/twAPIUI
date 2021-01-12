import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { clipRequestDTO } from '../models/clipRequestDTO';
import { Observable } from 'rxjs';
import { authRequestDTO } from '../models/authRequestDTO';
import { keys } from './../keys';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { GamesRequestDTO } from '../models/gamesRequestDTO';
import { subMinutes } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class HTTPService implements OnInit {

  readonly authURL:string = "https://id.twitch.tv/oauth2/token";
  readonly apiURL:string = "https://api.twitch.tv/helix";

  private client_id:string = keys.client_id;
  private client_secret:string = keys.client_secret;
  private token:string = keys.token;

  constructor(private http:HttpClient) { }
  
  ngOnInit(): void {

  }

  requestClips():Observable<clipRequestDTO>{
    let params = new HttpParams().set('broadcaster_id', '37402112').set('started_at', '2020-12-31T00:00:00Z').set('first', '100');
    let headers = new HttpHeaders().set('client-id', this.client_id).set('Authorization', "Bearer "+this.token);

    return this.http.get<clipRequestDTO>(this.apiURL + "/clips", {headers , params });
  }

  getClipsForGameSince(gameID:number, length:number, since:string):Observable<clipRequestDTO>{
    let params = new HttpParams().set('game_id', ""+gameID).set('started_at', since).set('first', ""+length);
    let headers = new HttpHeaders().set('client-id', this.client_id).set('Authorization', "Bearer "+this.token);

    return this.http.get<clipRequestDTO>(this.apiURL + "/clips", {headers , params });
  }

  getTopGames(length:number):Observable<GamesRequestDTO>{
    let params = new HttpParams().set('first', ""+length);
    let headers = new HttpHeaders().set('client-id', this.client_id).set('Authorization', "Bearer "+this.token);

    return this.http.get<GamesRequestDTO>(this.apiURL + "/games/top", {headers , params });
  }

  getAuth(){
    let params = new HttpParams().set('client_id', this.client_id).set('client_secret', this.client_secret).set('grant_type', 'client_credentials');
    
    console.log(params.toString())
    let response:Observable<authRequestDTO> = this.http.post<any>(this.authURL , { params });
    response.subscribe( data =>{
      this.token = data.access_token;
      console.log(data);
    }, error => {
      console.log(error);
      console.log(params);
    
    });
    

  }

  getExcluded():Observable<String>{
    return this.http.get('assets/excluded.txt', {responseType: 'text'});
  }
}
