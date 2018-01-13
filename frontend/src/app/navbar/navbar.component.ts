import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { Router } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { Category } from '../category';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  categories: Category[];
  getCategories(): void {
    this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
  }

  navbar_extended: number;

  ngOnInit() {
    this.CurrPos();

    this.navbar_extended = this.categoriesService.getNavbar();

    this.getCategories();
  }

  activity: string;
  onSubmit() {
    for (let i = 0; i < this.categories.length; i++ )
      if ( ( this.activity != null) && ( this.categories[i].name == this.activity ) )
    this.categoriesService.selectedCategories.push(this.categories[i]);
    
    this.categoriesService.navbar_extended = 1;
    this.router.navigate(['/search']);
  }

  CurrPos() {
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

}
