import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Category } from '../category';
import { Event } from '../event';
import { FILTERS } from '../mock-filters';
import { Filter } from '../filter';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

// Services
import { EventService } from '../event.service';
import { CategoriesService } from '../categories.service';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {server_addr} from '../server_addr';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
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
  ) {}

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
    // console.log(JSON.stringify(this.selectedCategories));
  }
  
  // --------------------- Events --------------------- //

  events: Event[];
  selectedEvents: Event[];

  getEvents(): void {
    this.eventService.getEvents("", "", "", "").
    subscribe(events => {
      console.log(events);
      this.events = events});
  }
  
  // -------------------- Filters -------------------- //

  show_filters: boolean;

  cost = 50;
  selectCost(Cost: number): void {
    this.cost = Cost;
  }

  distance: number = 2;

  age: number;

  filters() {
    console.log("Cost ", this.cost);
    console.log("Age ", this.age);
    console.log("Distance ", this.distance);
  }

  // -------------------- MAP -------------------- //
  
  show_map: boolean;

  public latitude: number;
  public longitude: number;
  public zoom = 14;

  checked: number;
  
  ngOnInit() {
    this.getCategories();
    this.getSelectedCategories();
    
    this.getEvents();

    this.show_filters = false;

    this.show_map = false;

    //set google maps defaults
    this.latitude = 37.979499;
    this.longitude = 23.783076;

  }

}