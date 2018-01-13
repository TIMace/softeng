import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Category } from '../category';
import { FILTERS } from '../mock-filters';
import { Filter } from '../filter';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { CategoriesService } from '../categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  categories: Category[];

  selectedCategories: Category[];

  onSelect(category: Category): void {
    this.categoriesService.navbar_extended = 1;

    this.categoriesService.selectedCategories.push(category);

    this.router.navigate(['/search']);
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

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}


  ngOnInit() {

    this.categoriesService.navbar_extended = 0;

    this.categoriesService.selectedCategories = [];

    this.getCategories();

    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //     types: ["address"]
    //   });
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       //get the place result
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       //verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       //set latitude, longitude and zoom
    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });
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

  onSubmit(){
    this.categoriesService.navbar_extended = 1;
    this.router.navigate(['/search']);
  }

}
