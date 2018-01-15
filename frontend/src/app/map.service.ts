import { Injectable } from '@angular/core';

@Injectable()
export class MapService {

  constructor() { }

  latitude: number;
  longitude: number;

  setLatitude(lat: number){
    this.latitude = lat;
  }

  setLongitude(lng: number){
    this.longitude = lng;
  }

  getLatitude(){
    return this.latitude;
  }

  getLongitude(){
    return this.longitude;
  }

}
