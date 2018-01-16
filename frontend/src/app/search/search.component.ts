import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Category } from '../category';
import { FILTERS } from '../mock-filters';
import { Filter } from '../filter';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

// Services
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(
    private categoriesService: CategoriesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  // ------------------- Categories ------------------- //

  categories: Category[];
  selectedCategories: Category[];

  getCategories(): void {
    this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
  }

  getSelectedCategories(): void {
    this.selectedCategories = this.categoriesService.getSelectedCategories();
    console.log(JSON.stringify(this.selectedCategories));
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
      if ( this.selectedCategories.length == 1 ){
        this.latitude = category.lat;
        this.longitude = category.lng;
      } else {
        this.latitude = ( ( this.latitude * this.selectedCategories.length ) - category.lat ) / (this.selectedCategories.length - 1 );
        this.longitude = ( ( this.longitude * this.selectedCategories.length ) - category.lng ) / (this.selectedCategories.length - 1 );
      }

      this.selectedCategories.splice(index, 1);
    }
    else {
      // reset map's center
      if ( this.selectedCategories.length == 1 ){
        this.latitude = category.lat;
        this.longitude = category.lng;
      } else {
        this.latitude = ( ( this.latitude * this.selectedCategories.length ) + category.lat ) / (this.selectedCategories.length + 1 );
        this.longitude = ( ( this.longitude * this.selectedCategories.length ) + category.lng ) / (this.selectedCategories.length + 1 );
      }

      this.selectedCategories.push(category);
    }
    console.log(JSON.stringify(this.selectedCategories));
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
    
    this.findChecked();

    this.show_filters = false;

    this.show_map = false;

    //set google maps defaults
    this.latitude = 37.979499;
    this.longitude = 23.783076;
  }

}