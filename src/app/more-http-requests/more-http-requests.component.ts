import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Component({
    selector: 'app-more-http-requests',
    templateUrl: './more-http-requests.component.html'
})
export class MoreHttpRequestsComponent implements OnInit {
	data: Object;  // string;
	loading: boolean;
    
	constructor(private http: HttpClient) {}

    ngOnInit() {}

	makePost(): void {
		this.loading = true;
		this.http
			.post(
				'https://jonplaceholder.typicode.com/posts',
				JSON.stringify({
					body: 'bar',
					title: 'foo',
					userId: 1
				})
			)
			.subscribe((data) => {
				this.data = data;
				this.loading = false;
			});
	}

	makeDelete(): void {
		this.loading = true;
		this.http.delete('https://jonplaceholder.typicode.com/posts/1').subscribe((data) => {
			this.data = data;
			this.loading = false;
		});
	}

	makeHeaders(): void {
		const headers: HttpHeaders = new HttpHeaders({
			'X-API-TOKEN': 'ng-book'
		});

		const req = new HttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts/1', {
			headers: headers
		});
        this.http.request(req).subscribe(data => {
            this.data = data['body'];
        });
	}
}
