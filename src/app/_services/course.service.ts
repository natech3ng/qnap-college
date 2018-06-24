import { AuthService } from './../auth/_services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../_models/course';
import { environment } from '../../environments/environment';

@Injectable()
export class CourseService {
  apiRoot: string = environment.apiUrl;
  public options;
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.options = [
      { name: 'Latest', value: 'publishedDate'},
      { name: 'Most Viewed', value: 'watched'},
      { name: 'Most Liked', value: 'like'}
    ];
  }
  all(limit?: number, getBy?: string): Observable<Course []> {
    let by = 'publishedDate';
    if (getBy) {
      by = getBy;
    }
    let api_query = this.apiRoot + 'courses?orderBy=' + by + ':desc';
    if (limit) {
      api_query = api_query + '&limit=' + limit;
    }
    // console.log(api_query);
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this._httpClient.get<Course []>(api_query, {headers: headers});
  }

  add(course: Course) {
    const api_query = this.apiRoot + 'courses';
    return this._httpClient.post(api_query, course, this._authService.jwtHttpClient());
  }

  update(course: Course) {
    const api_query = this.apiRoot + 'courses';
    return this._httpClient.put(api_query, course, this._authService.jwtHttpClient());
  }

  allByCategory(category: String): Observable<Course []> {
    const api_query = this.apiRoot + 'category/' + category + '/courses';
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this._httpClient.get<Course []>(api_query, {headers: headers});
  }

  get(id: any): Observable<Course> {
    const api_query = this.apiRoot + 'courses/' + id;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this._httpClient.get<Course>(api_query, {headers: headers});
  }

  getYoutubeInfo(youtubeRef: String): Observable<Course> {
    const api_query = this.apiRoot + 'courses/' + youtubeRef + '/youtubeinfo';
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this._httpClient.get<Course>(api_query, {headers: headers});
  }

  search(query: String): Observable<Course []> {
    if (!query) {
      query = '';
    }
    console.log('search');
    const api_query = this.apiRoot + 'courses/search?query=' + query;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this._httpClient.get<Course []>(api_query, {headers: headers});
  }
  delete(id: String): Observable<any> {
    const api_query = this.apiRoot + 'courses/' + id;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this._httpClient.delete<any>(api_query, this._authService.jwtHttpClient());
  }

  clicked(id: String): Observable<any> {
    const api_query = this.apiRoot + 'courses/' + id + '/clicked';
    return this._httpClient.post<any>(api_query, '');
  }

  quickClicked(course) {
    this.clicked(course._id).subscribe(
      () => {},
      (err) => {
      }
    );
  }
}
