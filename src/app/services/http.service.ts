import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { clipRequestDTO } from '../models/clipRequestDTO';
import { Observable } from 'rxjs';
import { authRequestDTO } from '../models/authRequestDTO';
import { keys } from './../keys';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

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
    let params = new HttpParams().set('broadcaster_id', '37402112').set('first', '100');
    let headers = new HttpHeaders().set('client-id', this.client_id).set('Authorization', "Bearer "+this.token);

    return this.http.get<clipRequestDTO>(this.apiURL + "/clips", {headers , params });
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
}
