import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  weather: any;
  title = 'transcendence-spa';

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather() {
    this.http.get('http://localhost:3000/api/weather').subscribe({
      next: (response) => {
        this.weather = response;
        console.log(this.weather);
      },
      error: (error) => console.log(error),
    });
  }
}
