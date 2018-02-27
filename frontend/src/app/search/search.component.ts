import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Category } from '../category';
import { Event } from '../event';
import { FILTERS } from '../mock-filters';
import { Filter } from '../filter';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { AgmCoreModule } from '@agm/core';
import { MapService } from '../map.service';
import { AgmMap } from '@agm/core/directives/map';

// Services
import { EventService } from '../event.service';
import { CategoriesService } from '../categories.service';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { server_addr } from '../server_addr';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private categoryService: CategoriesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  // ------------------- Categories ------------------- //

  categories: Category[];
  selectedCategories: Category[];

  getCategories(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  getSelectedCategories(): void {
    this.selectedCategories = this.categoryService.getSelectedCategories();
    // console.log("SEARCH: ",this.selectedCategories);
  }

  findChecked(category: Category): boolean {
    var index = this.categoryService.categorySelectedIndex(category);
    if (index !== -1) {
      return true;
    }
    else {
      return false;
    }
  }

  onSelect(category: Category): void {
    this.selectedCategories = this.categoryService.onClickSelectCategory(category);
    this.eventService.searchEvents()
    // console.log(JSON.stringify(this.selectedCategories));
  }

  // --------------------- Events --------------------- //

  events: Event[];
  selectedEvents: Event[];

  getEvents(): void {
    this.eventService.getEvents("", "", "", "").
      subscribe(events => {
        // console.log(events);
        this.events = events
        this.events.forEach(element => {
          // element.date = new Date(       Date.parse(element.date))setTime(Date.parse(element.date)).toString());
          var time = new Date(Date.parse(element.date));
          var year = time.getFullYear();
          var month = time.getMonth() + 1;
          var date1 = time.getDate();
          var hour = time.getHours();
          var minutes = time.getMinutes();
          element.date = (date1 + "-" + month + "-" + year + " " + hour + ":" + minutes);

        });
      });
  }

  // -------------------- Filters -------------------- //

  show_filters: boolean;

  cost: number;
  selectCost(Cost: number): void {
    this.cost = Cost;
  }

  distance: number;

  age: string;

  filters() {
    console.log("Cost ", this.cost);
    console.log("Age ", this.age);
    console.log("Distance ", this.distance);
    if ( ( this.age !== null ) && ( this.age !== undefined ) )
      this.eventService.age = this.age;
    else 
      this.eventService.age = "";
    if (  ( this.cost !== null ) &&  ( this.cost !== undefined ) )
      this.eventService.price = this.cost;
    else
      this.eventService.price = -1;
    if ( ( this.distance !== null ) && ( this.distance !== undefined ) )
      this.eventService.distance = this.distance;
    else
      this.eventService.distance = -1;
    this.eventService.searchEvents();
  }

  // -------------------- MAP -------------------- //

  show_map: boolean;

  public latitude: number;
  public longitude: number;
  public zoom = 10;

  @ViewChild(AgmMap) private map: any;
  
  // mapsAPILoader.load().then(() => {let latlngbounds = new google.maps.LatLngBounds();})

  checked: number;

  ngOnInit() {
    this.getCategories();
    this.getSelectedCategories();

    // this.getEvents();
    this.eventService.eventSubscriber.subscribe((events:any) => {
      this.events = events;
      //set google maps defaults
      this.latitude = this.eventService.searchMeanLatt;
      this.longitude = this.eventService.searchMeanLong;
    })
    this.eventService.searchEvents()

    this.show_filters = false;

    this.show_map = false;

    

  }

}