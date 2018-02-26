import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';

import { Category } from '../category';
import { FILTERS } from '../mock-filters';
import { Filter } from '../filter';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

// MAP
import { AgmMap } from '@agm/core/directives/map';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

import { MatDialog, MatDialogRef } from '@angular/material';
import { MapComponent } from '../map/map.component';

// Services
import { CategoriesService } from '../categories.service';
import { MapService } from '../map.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private eventService: EventService,
    private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) { }

  //--------------------- Form ---------------------//

  //------------ Activity ------------//

  categories: Category[];
  getCategories(): void {
    this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
  }

  activity: string;

  onSubmit(){
    // console.log(this.activity);
    
    // for (let i = 0; i < this.categories.length; i++ )
    //   if ( ( this.activity != null) && ( this.categories[i].name == this.activity ) )
    //     this.categoriesService.selectedCategories.push(this.categories[i]);
    
    this.categoriesService.navbar_extended = 1;
    this.categoriesService.selectedCategories = this.selectedCategories;
    // console.log("HOME: ", this.selectedCategories);
    if ( this.activity !== null )
      this.eventService.freeText = this.activity;
    this.eventService.searchEvents();

    this.router.navigate(['/search']);
  }

  //-------------- MAP --------------//

  mapDialogRef: MatDialogRef<MapComponent>;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild(AgmMap) private map: any;

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public searchControl: FormControl;

  openMap() {
    this.mapService.setLatitude(this.latitude);
    this.mapService.setLongitude(this.longitude);
    this.mapDialogRef = this.dialog.open(MapComponent, {
      height: "80%",
      width: "80%",
    });

    this.mapDialogRef.afterClosed().subscribe(result => {
      console.log(`Map closed!`); // Pizza!
      this.latitude = this.mapService.getLatitude();
      this.longitude = this.mapService.getLongitude();
      var geocoder = new google.maps.Geocoder;
      this.geocodeLatLng(geocoder);
    });
  }

  location: string;
  geocodeLatLng(geocoder) {
    var latlng = {lat: this.mapService.getLatitude(), lng: this.mapService.getLongitude()};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // console.log(results[0].formatted_address);
          // this.location = results[0].formatted_address;
          // console.log(this.location);
          (<HTMLInputElement>document.getElementById("location")).value = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  write() {

    //create search FormControl
    this.searchControl = new FormControl();
 
    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.mapService.setLatitude(this.latitude);
          this.mapService.setLongitude(this.longitude);

          this.zoom = 12;
        });
      });
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

  //--------------------- Button Categories ---------------------//
  show_categories: boolean;
  selectedCategories: Category[];

  onSelect(category: Category): void {
    // this.categoriesService.navbar_extended = 1;
    // this.categoriesService.selectedCategories.push(category);
    // this.router.navigate(['/search']);
    this.selectedCategories.push(category);
  }

  ngOnInit() {
    // Appearance Initializations
    this.categoriesService.navbar_extended = 0;
    this.categoriesService.selectedCategories = [];

    // Requests from service
    this.getCategories();
    this.selectedCategories = this.categoriesService.getSelectedCategories();

    this.write();
  }

}
