import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '../category';

// MAP
import { AgmMap } from '@agm/core/directives/map';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

import { MatDialog, MatDialogRef } from '@angular/material';
import { MapComponent } from '../map/map.component';

// Services
import { CategoriesService } from '../categories.service';
import { MapService } from '../map.service';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    public userDetailsService: UserDetailsService,
    public categoriesService: CategoriesService,
    private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {}
  
  //------------ Activity ------------//

  categories: Category[];
  getCategories(): void {
    this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
  }

  activity: string;

  onSubmit() {
    this.tempLocation = (<HTMLInputElement>document.getElementById("tempLocation")).value;
    console.log(this.activity);
    console.log(this.tempLocation);
    this.router.navigate(['/search']);
  }

  //-------------- MAP --------------//
  
  mapDialogRef: MatDialogRef<MapComponent>;

  @ViewChild("searchNav")
  public searchNavElementRef: ElementRef;

  @ViewChild(AgmMap) private map: any;

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public searchControlNav: FormControl;

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

  tempLocation: string;
  geocodeLatLng(geocoder) {
    var latlng = {lat: this.mapService.getLatitude(), lng: this.mapService.getLongitude()};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // console.log(results[0].formatted_address);
          (<HTMLInputElement>document.getElementById("tempLocation")).value = results[0].formatted_address;
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
      this.searchControlNav = new FormControl();
      
      //set current position
      this.setCurrentPosition();

      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchNavElementRef.nativeElement, {
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

  //--------------------- Exit ---------------------//
  
  exit() {
    this.userDetailsService.logout();
    this.router.navigate(['']);
  }

  ngOnInit() {

    this.getCategories();

    //create search FormControl
    this.searchControlNav = new FormControl();

    this.setCurrentPosition();

  }

}
