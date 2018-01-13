import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Category } from '../category';
import { FILTERS } from '../mock-filters';
import { Filter } from '../filter';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  show_filters = 1;

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  categories: Category[];

  selectedCategories: Category[];

  onSelect(category: Category): void {
    const index: number = this.selectedCategories.indexOf(category);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
    else {
      this.selectedCategories.push(category);
    }
    console.log("lalala");
    console.log(JSON.stringify(this.selectedCategories));
  }

  cost: number = 50;
  selectCost(Cost: number): void {
    this.cost = Cost;
    console.log(this.cost);
  }

  distance: number = 2;
  
  getCategories(): void {
    this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
  }

  getSelectedCategories(): void {
    this.selectedCategories = this.categoriesService.getSelectedCategories();
    console.log(JSON.stringify(this.selectedCategories));
  }

  constructor(
    private categoriesService: CategoriesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  checked: number;

  findChecked(): void {
    for ( let i = 0; i < this.categories.length; i++ )
      if ( ( this.selectedCategories.length > 0 ) && ( this.categories[i].name === this.selectedCategories[0].name ) ){
        this.checked = this.categories[i].id;
        console.log(this.checked);
      }
  }

  // findChecked(category: Category): number {
  //   const index: number = this.selectedCategories.indexOf(category);
  //   if ( index !== -1 )
  //     return 1;
  //   else
  //     return 0;
  // }
  
  ngOnInit() {

    this.getSelectedCategories();

    this.getCategories();

    this.findChecked();

    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      // let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      //   types: ["address"]
      // });
      // autocomplete.addListener("place_changed", () => {
      //   this.ngZone.run(() => {
      //     //get the place result
      //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

      //     //verify result
      //     if (place.geometry === undefined || place.geometry === null) {
      //       return;
      //     }

      //     //set latitude, longitude and zoom
      //     this.latitude = place.geometry.location.lat();
      //     this.longitude = place.geometry.location.lng();
      //     this.zoom = 12;
      //   });
      // });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}
