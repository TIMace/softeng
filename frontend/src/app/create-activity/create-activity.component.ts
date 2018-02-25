import { Component, OnInit, Input, NgZone, ElementRef, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event } from '../event';
import { EVENTS } from '../mock-events';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '../categories.service';


// MAP
import { AgmMap } from '@agm/core/directives/map';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { MapComponent } from '../map/map.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapService } from '../map.service';




// Services
import { EventService } from '../event.service';
import { element } from 'protractor';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css']
})
export class CreateActivityComponent implements OnInit {
  @Input() category: Event;


  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
   // private location: Location,
    private categoriesService: CategoriesService,
    private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog

  ) { }


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






   createEvent(){

   }


   cancelEvent(){
     
   }

   checkedCategories:string[] = [];
   checkedCategoriesInit () {
     this.categories.forEach(element => {
       this.checkedCategories.push("false")
     })
   }

   date:Date;
   temp(){

    console.log(this.checkedCategories);
  }

  categories;
  ngOnInit() {
    this.categoriesService.getCategories()
    .subscribe(
      (data:any) => {
        this.categories = data
        this.checkedCategoriesInit();
        console.log(this.categories);
      }
    );
    this.category = EVENTS[0];
    this.write();
    // this.getEvent();
  };

 //l = Object.keys(this.categories).length;
  // getEvent(): void {
  //   const id = +this.route.snapshot.paramMap.get('id');
  //   this.eventService.getEvent(id)
  //     .subscribe(event => this.event = event);
  // }

  changeCheckbox(catIndex,catName) {
    if(this.checkedCategories[catIndex] === "false") {
      this.checkedCategories[catIndex] = catName
    }
    else {
      this.checkedCategories[catIndex] = "false"
    }
  }



}
