import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';
// import 'rxjs/add/observable/fromEvent';   // Source: https://stackoverflow.com/questions/50571550/this-property-fromevent-does-not-exist-on-type-typeof-observable-angular-6
// import 'rxjs/add/operator/map';   // It was like this for rxjs 5


import { SearchResult } from './search-result.model';
import { YouTubeSearchService } from './you-tube-search.service';

@Component({
	selector: 'app-search-box',
	template: `
      <input type="text" class="form-control" placeholder="Search" autofocus>
    `
})
export class SearchBoxComponent implements OnInit {
	// @Output specifies that events will be emitted from this component.
	@Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

	constructor(private youtube: YouTubeSearchService, private el: ElementRef) {}

	ngOnInit(): void {
		// ngOnInit function will be called after the first change detection check.
		// convert the `keyup` event into an observable stream
		Observable.fromEvent(this.el.nativeElement, 'keyup')
			.map((e: any) => e.target.value) // extract the value of the input
			.filter((text: string) => text.length > 1) // filter out if empty
			.debounceTime(250)
			.do(() => this.loading.emit(true))
			.map((query: string) => this.youtube.search(query))
			.switch() // discard old events if new input comes in
			// sophisticated event-handling stream
			// act on the return of the search
			.subscribe(
                (results: SearchResult[]) => {
                    this.loading.emit(false);
                    this.results.emit(results);
                },
                (err: any) => {
                    console.log(err);
                    this.loading.emit(false);
                },
                () => {    // on completion
                    this.loading.emit(false);
                }
            );
	}
}
