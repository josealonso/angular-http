import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchResult } from './search-result.model';

export const YOUTUBE_API_KEY: string = "AIzaSyApn94h3wuIoNCFEK3U305p2pjBCJZvM-M";
export const YOUTUBE_API_URL: string = "https://www.googleapis.com/youtube/v3/search";
// To help with this environment configuration, one of the things we can do is make these constants injectable.
// In order to make these values injectable, we use the { provide: ... , useValue: ... } syntax.

@Injectable()
export class YouTubeSearchService  {
    constructor(
        private http: HttpClient,
        @Inject(YOUTUBE_API_KEY) private apiKey: string,
        @Inject(YOUTUBE_API_URL) private apiUrl: string,
    ) {}

    search(query: string): Observable<SearchResult[]> {
      const params: string = [
          `q=${query}`,
          `key=${this.apiKey}`,
          `part=snippet`,
          `type=video`,
          `maxResults=10`
      ].join('&');
      const queryUrl = `${this.apiUrl}?${params}`;
      // Source: https://stackoverflow.com/questions/50412389/property-map-does-not-exist-on-type-observable-after-upgrading-rxjs-to-6
      return this.http.get(queryUrl).pipe(
          map(response => {
          return <any>response['items'].map(item => {
              console.log("raw item", item);
              return new SearchResult({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnailUrl: item.snippet.thumbnails.high.url
              });
          });
      })
      );
    }
}