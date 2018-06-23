import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keyword } from '../_models/keyword';
import { environment } from '../../environments/environment';

@Injectable()
export class KeywordService {

  apiRoot: string = environment.apiUrl;

  constructor(private _httpClient: HttpClient) {
  }

  all(limit?: number): Observable<Keyword []> {
    let limitStr = '';
    if (limit) {
      limitStr = '?limit=' + limit;
    }
    const api_query = this.apiRoot + 'keywords' + limitStr;

    return this._httpClient.get<Keyword []>(api_query);
  }
}
