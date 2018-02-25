import { Injectable } from '@angular/core';
import { Event } from './event';
import { EVENTS } from './mock-events';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {server_addr} from './server_addr'
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 
import { Subject } from 'rxjs/Subject';
import { UserDetailsService, userDetailsObj } from './user-details.service';

@Injectable()
export class EventService {

  selectedEvents = [];

  constructor(
    private httpClient:HttpClient,
    public userDetailsService: UserDetailsService
  ) { }
  
  getEvents(free_text: String, age: String, price: String, distance: String): Observable<Event[]> {
    var subject = new Subject<any>();
    this.httpClient.get(
      `${server_addr}/event`,
    )
    .map(response => this.server2local_event(response))
    .subscribe(data => {console.log("Here comes the events of ALL");
                        console.log(data);
                        subject.next(data)})
    // return of(EVENTS.find(event => event.id === id));
    // return of(EVENTS);
    // this.getProviderEvents().subscribe(data => console.log("done"));
    return subject.asObservable();
  }

  getSelectedEvents(): Event[] {
    return this.selectedEvents;
  }

  // TODO rename getCategory to getEvent
  // Fix all calls of getCategory στα υπόλοιπα αρχεία

  getCategory(id: number){
    var subject = new Subject();
    this.httpClient.get(
      `${server_addr}/category/events/${id}`,
    )
    .map((response:Array<any>) => { //Get rid of what comes together
      var res = [];
      for(var i = 0;i<response.length;i++){
        var temp = response[i].event;
        res.push(temp)
      }
      return res;
    })
    .map(response => this.server2local_event(response))
    .subscribe(data => {
                        subject.next(data);
                        console.log("Here comes the events of a category");
                        console.log(data);
                      })
    // return of(EVENTS.find(event => event.id === id));
    return subject.asObservable();
  }

  // NavBar Simple / Extended

  getUserEvents(){
    var subject = new Subject<any>();
    var userDetails = this.userDetailsService.getDetails();
    this.httpClient.get(
      `${server_addr}/user/events/${userDetails.username}/${userDetails.password}`,
    )
    .map((response:Array<any>) => { //Get rid of what comes together
      var res = [];
      for(var i = 0;i<response.length;i++){
        var temp = response[i].event;
        res.push(temp)
      }
      return Array.from(new Set(res));
    })
    .map(response => this.server2local_event(response))
    .subscribe(data => {subject.next(data);
      // console.log("here come the events of a user");console.log(data)
    })
    return subject.asObservable();
  }

  getProviderEvents(){
    var subject = new Subject<any>();
    var userDetails = this.userDetailsService.getDetails();
    this.httpClient.get(
      `${server_addr}/provider/events/${userDetails.username}/${userDetails.password}`,
    )
    // .map((response:Array<any>) => {
    //   var res = [];
    //   console.log("this is what came")
    //   console.log(response)
    //   for(var i = 0;i<response.length;i++){
    //     console.log("This is an element")
    //     console.log(response[i])
    //     var temp = response[i].event;
    //     res.push(temp)
    //   }
    //   console.log("this is what leaves")
    //   console.log(res)
    //   return res;
    // })
    .map(response => this.server2local_event(response))
    .subscribe(data => {subject.next(data);
      /*console.log("here come the events of a provider");console.log(data)*/
    })
    return subject.asObservable();
  }

  server2local_event(server_event_array){
    var final_res =  [];
    
    for(var i = 0;i<server_event_array.length;i++){
      var res = new Event();
      var server_event = server_event_array[i]
      res.id = server_event.event_id;
      res.available_tickets = server_event.event_available_tickets;
      res.date = server_event.event_date
  ​​    res.description = server_event.event_description
      res.lat = server_event.event_lattitude
      res.lng = server_event.event_longtitude
      res.location = server_event.event_map_data
      res.age_max = server_event.event_maximum_age
      res.age_min = server_event.event_minimum_age
      res.name = server_event.event_name
      res.price = server_event.event_price
      res.provider_id = server_event.event_provider_id
      final_res.push(res);
    }
    // console.log("Final Res:")
    // console.log(final_res)
    return final_res;
  }

  navbar_extended = 0;

  getNavbar(): number {
    return this.navbar_extended;
  }

}
