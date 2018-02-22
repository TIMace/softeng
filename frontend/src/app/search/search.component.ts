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
    console.log(JSON.stringify(this.selectedEvents));
  }

  findChecked(): void {
    for ( let i = 0; i < this.categories.length; i++ )
      if ( ( this.selectedCategories.length > 0 ) && ( this.categories[i].name === this.selectedCategories[0].name ) ){
        this.checked = this.categories[i].id;
        console.log(this.checked);
      }
  }

  onSelect(category: Category): void {
    const index: number = this.selectedCategories.indexOf(category);
    if (index !== -1) {
      // reset map's center
      // if ( this.selectedCategory.length == 1 ){
      //   this.latitude = category.lat;
      //   this.longitude = category.lng;
      // } else {
      //   this.latitude = ( ( this.latitude * this.selectedCategories.length ) - category.lat ) / (this.selectedCategories.length - 1 );
      //   this.longitude = ( ( this.longitude * this.selectedCategories.length ) - category.lng ) / (this.selectedCategories.length - 1 );
      // }

      this.selectedCategories.splice(index, 1);
      this.categoryService.removeCategory(index);

    }
    else {
      // reset map's center
      // if ( this.selectedCategories.length == 1 ){
      //   this.latitude = event.lat;
      //   this.longitude = event.lng;
      // } else {
      //   this.latitude = ( ( this.latitude * this.selectedEvents.length ) + event.lat ) / (this.selectedEvents.length + 1 );
      //   this.longitude = ( ( this.longitude * this.selectedEvents.length ) + event.lng ) / (this.selectedEvents.length + 1 );
      // }

      this.selectedCategories.push(category);
      this.categoryService.selectedCategories.push(category);
    }
    console.log(JSON.stringify(this.selectedEvents));
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
    this.getCategories();
    this.getSelectedCategories();
    
    this.getEvents();
    
    this.findChecked();

    this.show_filters = false;

    this.show_map = false;

    //set google maps defaults
    this.latitude = 37.979499;
    this.longitude = 23.783076;
  }

}