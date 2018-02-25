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

  events: Event[];
  selectedEvents: Event[];

  getCategories(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  getSelectedCategories(): void {
    this.selectedCategories = this.categoryService.getSelectedCategories();
    console.log("SEARCH: ",this.selectedCategories);
  }

  findChecked(category: Category): boolean {
    // const index: number = this.selectedCategories.indexOf(category);
    var index=-1;
    for (var i = 0; i < this.selectedCategories.length; i++ ){
      if ( this.selectedCategories[i].name === category.name )
        index = 1;
        break;
    }
    if (index !== -1) {
      console.log("FC: nai");
      return true;
    }
    else {
      console.log("FC: oxi");
      return false;
    }


  }

  onSelect(category: Category): void {

    var index=-1;
    for (var i = 0; i < this.selectedCategories.length; i++ ){
      if ( this.selectedCategories[i].name === category.name )
        index = i;
        break;
    }
    // return 0;
    // for(var i)
    if (index !== -1) {
      console.log("ON: nai");
      this.selectedCategories.splice(index, 1);
    }
    else {
      console.log("ON: oxi");
        this.selectedCategories.push(category);
    }

    console.log(JSON.stringify(this.selectedCategories));
  }

  checkedCategories:string[] = [];
  checkedCategoriesInit(){
    this.categories.forEach(element => {
      var index: number = this.selectedCategories.indexOf(element);
      if (index !== -1) {
        this.checkedCategories.push("true");
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
      }
      else {
        this.checkedCategories.push("false");
      }
    });
  }

  changeCheckbox(catIndex,catName) {
    if(this.checkedCategories[catIndex] === "false") {
      this.checkedCategories[catIndex] = catName
    }
    else {
      this.checkedCategories[catIndex] = "false"
    }
  }
  
  // --------------------- Events --------------------- //

  getEvents(): void {
    this.eventService.getEvents("", "", "", "").subscribe(events => this.events = events);
  }
  
  // -------------------- Filters -------------------- //

  show_filters: boolean;

  cost = 50;
  selectCost(Cost: number): void {
    this.cost = Cost;
    console.log(this.cost);
  }

  distance: number = 2;

  age: number;


  // -------------------- MAP -------------------- //
  
  show_map: boolean;

  public latitude: number;
  public longitude: number;
  public zoom = 14;

  checked: number;
  
  ngOnInit() {
    this.categoryService.getCategories()
    .subscribe(
      (data:any) => {
        this.categories = data
        this.checkedCategoriesInit();
        console.log(this.categories);
      }
    );
    this.getSelectedCategories();
    
    // this.getEvents();

    this.show_filters = false;

    this.show_map = false;

    //set google maps defaults
    this.latitude = 37.979499;
    this.longitude = 23.783076;
  }

}