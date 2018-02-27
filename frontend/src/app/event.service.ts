import { Injectable } from '@angular/core';
import { Event, eventProviderInfo } from './event';
import { EVENTS } from './mock-events';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { server_addr } from './server_addr'
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { UserDetailsService, userDetailsObj } from './user-details.service';
import { Category } from './category'
import { CategoriesService } from './categories.service';
import { NativeDateModule } from '@angular/material';
import { element } from 'protractor';

@Injectable()
export class EventService {

  selectedEvents = [];
  public searchMeanLong = 0
  public searchMeanLatt = 0
  public freeText = ""
  public age = ""//apo-ews
  public price = -1
  public distance = -1
  public eventSubscriber = new Subject();
  constructor(
    private httpClient: HttpClient,
    public userDetailsService: UserDetailsService,
    public categoriesService: CategoriesService
  ) { }

  searchEvents() {
    // var subject = new Subject<any>();
    var finalFreeText = this.freeText
    var finalAge = this.age
    var finalPrice = this.price
    var finalDistance = this.distance
    var finalSelectedCategories = this.categoriesService.selectedCategories
    var search_string = finalFreeText
    for (var i = 0; i < finalSelectedCategories.length; i++) {
      search_string += " " + finalSelectedCategories[i].name
    }

    this.httpClient.get(
      `${server_addr}/search/${search_string}`,
    )
      .map(response => this.elastic2local_event(response))
      .subscribe((data: Event[]) => {
        // console.log("Here comes the SEARCH events of ALL");
        // console.log(this.filterByAge("1-1", data));
        this.getMeanLocation(data);
        console.log("DATA BEFORE: ", data);
        var temp = this.filterByAge(this.age, data);
        console.log("TEMP: ", temp);
        console.log("AGE: ", this.age);
        console.log("DATA: ", data);
        this.eventSubscriber.next(temp)
      })
    // return of(EVENTS.find(event => event.id === id));
    // return of(EVENTS);
    // this.getProviderEvents().subscribe(data => console.log("done"));
    // return subject.asObservable();
  }

  filterByAge(age: string, eventsToFilter: Event[]) {
    if (this.age === "") { return eventsToFilter }
    else {
      var filteredEvents: Event[] = [];
      eventsToFilter.forEach(element => {
        var tempIndex = age.indexOf('-');
        console.log(tempIndex);
        var minAge = age.substring(0, tempIndex);
        var maxAge = age.substring(tempIndex + 1);
        console.log("min_age: ", minAge);
        console.log("max_age: ", maxAge);
        if (!(element.age_min > +maxAge) || (element.age_max < +minAge)) {
          console.log("ELEMENT ", element);
          filteredEvents.push(element);
        }
      });
      return filteredEvents;
    }
  }

  filterByPrice(maxPrice: number, eventsToFilter: Event[]) {
    if (maxPrice == -1) { return eventsToFilter }
    else {
      var filteredEvents: Event[];
      eventsToFilter.forEach(element => {
        if (element.price <= maxPrice) {
          filteredEvents.push(element)
        }
      });
      return filteredEvents
    }
  }

  filterByDistance(distance: number, eventsToFilter: Event[]) {
    if (distance == -1) { return eventsToFilter }
    else {
      var filteredEvents: Event[];
      this.setCurrentPosition();
      eventsToFilter.forEach(element => {
        function DIS(x1: number, y1: number, x2: number, y2: number) {
          return Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)))
        }
        if (DIS(this.myLat, this.myLong, element.lat, element.lng) <= distance) {
          filteredEvents.push(element)
        }
      });
      return filteredEvents
    }
  }

  myLat;
  myLong;
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.myLat = position.coords.latitude;
        this.myLong = position.coords.longitude;
      });
    }
  }







  getEvents(free_text: String, age: String, price: String, distance: String): Observable<Event[]> {
    var subject = new Subject<any>();
    this.httpClient.get(
      `${server_addr}/event`,
    )
      .map(response => this.server2local_event(response))
      .subscribe((data: Event[]) => {
        console.log("Here comes the events of ALL");
        console.log(data);
        this.getMeanLocation(data)
        subject.next(data)
      })
    // return of(EVENTS.find(event => event.id === id));
    // return of(EVENTS);
    // this.getProviderEvents().subscribe(data => console.log("done"));
    return subject.asObservable();
  }

  getSelectedEvents(): Event[] {
    return this.selectedEvents;
  }

  getMeanLocation(eventArray) {
    var eventNum = eventArray.length
    var longSum = 0
    var lattSum = 0
    for (var i = 0; i < eventArray.length; i++) {
      longSum += eventArray[i].lng
      lattSum += eventArray[i].lat
    }
    this.searchMeanLatt = lattSum / eventNum
    this.searchMeanLong = longSum / eventNum
  }

  getEventById(id) {
    var subject = new Subject();
    this.httpClient.get(
      `${server_addr}/event/${id}`
    )
      .subscribe(
        (triplet: any) => {
          var eventt = triplet.event;
          var categories = triplet.categories
          var providerInfo = triplet.provider

          eventt = this.server2local_event_single(eventt)
          var catNames = []
          for (var i = 0; i < categories.length; i++) {
            catNames.push(categories[i].category_name)
          }
          eventt.categories = catNames;
          var finalProviderInfo = new eventProviderInfo()
          finalProviderInfo.email = providerInfo.provider_email;
          finalProviderInfo.fname = providerInfo.provider_first_name;
          finalProviderInfo.lname = providerInfo.provider_last_name;
          finalProviderInfo.cname = providerInfo.provider_comp_name;
          finalProviderInfo.address = providerInfo.address;
          finalProviderInfo.phoneNum = providerInfo.provider_phone_num;
          eventt.providerInfo = finalProviderInfo;
          // console.log("This is the single event that came")
          // console.log(eventt)
          // console.log("Getting this single event")
          // console.log(eventt)
          subject.next(eventt)
        }
      )
    // return of(EVENTS[0]);
    return subject;
  }

  // TODO rename getCategory to getEvent
  // Fix all calls of getCategory στα υπόλοιπα αρχεία

  getCategory(id: number) {
    var subject = new Subject();
    this.httpClient.get(
      `${server_addr}/category/events/${id}`,
    )
      .map((response: Array<any>) => { //Get rid of what comes together
        var res = [];
        for (var i = 0; i < response.length; i++) {
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

  getActiveUserEvents() {
    var subject = new Subject()
    this.getUserEvents()
      .subscribe(
        data => {
          console.log("Woohoo got active user data")
          console.log(data)
          subject.next(this.filterActiveEvents(data))
        }
      )
    // return this.getUserEvents();
    return subject;
  }

  getOldUserEvents() {
    var subject = new Subject()
    this.getUserEvents()
      .subscribe(
        data => {
          subject.next(this.filterOldEvents(data))
        }
      )
    // return this.getUserEvents();
    return subject;
  }

  getUserEvents() {
    var subject = new Subject<any>();
    var userDetails = this.userDetailsService.getDetails();
    this.httpClient.get(
      `${server_addr}/user/events/${userDetails.username}/${userDetails.password}`,
    )
      .map((response: Array<any>) => { //Get rid of what comes together
        var res = [];
        for (var i = 0; i < response.length; i++) {
          var temp = response[i].event;
          res.push(temp)
        }
        // console.log("ALL THE USER EVENTS")
        // console.log(res)
        var res2 = []
        var dict = {}
        for (var i = 0; i < response.length; i++) {
          var temp = res[i];
          // console.log("Checking if the next object exists in dict")
          // console.log(temp)
          if (!(("" + temp.event_id) in dict)) {
            // console.log("It does")
            res2.push(temp)
            dict["" + temp.event_id] = true
          }
          else {
            // console.log("It exists")

          }
        }
        return res2;
      })
      .map(response => this.server2local_event(response))
      .subscribe((data: Event[]) => {
        // console.log("Woohoo got user dataaa")
        // console.log(data)
        subject.next(data);
        // console.log("here come the events of a user");console.log(data)
      })
    return subject.asObservable();
  }

  filterActiveEvents(eventArray) {
    var res = []
    var currentDate = new Date()
    for (var i = 0; i < eventArray.length; i++) {
      if (new Date(eventArray[i].date) > currentDate) {
        res.push(eventArray[i])
      }
    }
    return res;
  }

  filterOldEvents(eventArray) {
    var res = []
    var currentDate = new Date()
    for (var i = 0; i < eventArray.length; i++) {
      if (new Date(eventArray[i].date) <= currentDate) {
        res.push(eventArray[i])
      }
    }
    return res;
  }

  parentGetEventTickets(id) {
    var subject = new Subject();
    var uname = this.userDetailsService.userDetails.username;
    var passwd = this.userDetailsService.userDetails.password;

    this.httpClient.get(
      `${server_addr}/user/event/${uname}/${passwd}/${id}`,
    )
      .subscribe(
        (data: any) => {
          // console.log("Got some tickets!!!")
          // console.log(data)
          var res = [];
          for (var i = 0; i < data.length; i++) {
            res.push(data[i].transaction_id)
          }
          // console.log("tickets become this")
          // console.log(res)
          subject.next(res)
        }
      )

    return subject;
  }

  providerGetEventTickets(id) {
    var subject = new Subject();
    var uname = this.userDetailsService.userDetails.username;
    var passwd = this.userDetailsService.userDetails.password;

    this.httpClient.get(
      `${server_addr}/provider/event/${uname}/${passwd}/${id}`,
    )
      .subscribe(
        (data: any) => {
          console.log("Got some tickets!!!")
          console.log(data)
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var temp = {
              transaction_id: data[i].transaction_id,
              user_firstName: data[i].user.user_first_name,
              user_LastName: data[i].user.user_last_name,
              user_email: data[i].user.user_email,
              user_phoneNum: data[i].user.user_phone_num
            };
            res.push(temp)
          }
          subject.next(res)
        }
      )

    return subject;
  }

  buyEvent(id) {
    var subject = new Subject();
    var userDetails = this.userDetailsService.getDetails()
    this.httpClient.get(
      `${server_addr}/user/buy/${userDetails.username}/${userDetails.password}/${id}`,
    )
      .subscribe(
        (data: any) => {
          console.log(data)
          if (data == null || data.hasOwnProperty("error")) {
            subject.next(false)
          }
          else {
            var uname = this.userDetailsService.userDetails.username;
            var passwd = this.userDetailsService.userDetails.password;
            this.userDetailsService.login(uname, passwd, "Parent")
            subject.next(true)
          }

        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
          subject.next(false)
        }
      )
    return subject;
  }

  updateEvent(eventObj: Event) {
    var subject = new Subject()
    if (this.userDetailsService.userType != "Provider") {
      subject.next(false)
    }
    else {
      console.log("This is what the update will look like")
      console.log(eventObj)
      var updateDetails = new HttpParams()
        .set("username", "" + this.userDetailsService.userDetails.username)
        .set("password", "" + this.userDetailsService.userDetails.password)
        .set("ev_price", "" + eventObj.price)
        .set("ev_id", "" + eventObj.id)
        .set("ev_name", "" + eventObj.name)
        .set("ev_descr", "" + eventObj.description)
        .set("ev_date", "" + eventObj.date)
        .set("ev_min_age", "" + eventObj.age_min)
        .set("ev_max_age", "" + eventObj.age_max)
      this.httpClient.post(
        `${server_addr}/event/update`,
        updateDetails.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')

        }
      )
        .subscribe(
          (data: any) => {
            console.log("This is what came after event update")
            console.log(data)
            if (data == null || data.hasOwnProperty("error")) {
              subject.next(false)
            }
            else {
              subject.next(true)
            }

          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            subject.next(false)
          }
        )
    }
    // return of(true)
    return subject;
  }

  createEvent(eventObj: Event) {
    var subject = new Subject()
    if (this.userDetailsService.userType != "Provider") {
      subject.next(false)
    }
    else {
      // console.log("This is the event creation object")
      // console.log(eventObj)
      var creationDetails = new HttpParams()
        .set("username", "" + this.userDetailsService.userDetails.username)
        .set("password", "" + this.userDetailsService.userDetails.password)
        .set("ev_price", "" + eventObj.price)
        .set("ev_name", "" + eventObj.name)
        .set("ev_descr", "" + eventObj.description)
        .set("ev_date", "" + eventObj.date)
        .set("ev_avail_tick", "" + eventObj.available_tickets)
        .set("ev_latt", "" + eventObj.lat)
        .set("ev_long", "" + eventObj.lng)
        .set("ev_min_age", "" + eventObj.age_min)
        .set("ev_max_age", "" + eventObj.age_max)
        .set("ev_mdata", "" + eventObj.location)
      // .set("ev_base64",""+eventObj.ev_base64)

      // console.log("This is the length of the categories array!!!!")
      // console.log(eventObj.categories.length)
      for (var i = 0; i < eventObj.categories.length; i++) {
        // console.log( `Loopa ${i}, id ${this.categoriesService.categoryIdByName(eventObj.categories[i])}`)
        // console.log(`ev_cats[${i+1}]`)
        // console.log(`${this.categoriesService.categoryIdByName(eventObj.categories[i])}`)
        creationDetails = creationDetails.set(`ev_cats[${i + 1}]`, `${this.categoriesService.categoryIdByName(eventObj.categories[i])}`)
      }
      creationDetails = creationDetails.set("ev_base64", "" + eventObj.ev_base64);

      this.httpClient.post(
        `${server_addr}/event`,
        creationDetails.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')

        }
      )
        .subscribe((eventAnswer) => {
          console.log("REQUEST ANSWER")
          console.log(eventAnswer)

          if (eventAnswer == null || eventAnswer.hasOwnProperty("error")) {
            subject.next(false)
          }
          else {
            subject.next(true)
          }
        },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            subject.next(false)
          }
        )
      // subject.next(true)
    }
    // subject.next(true)
    return subject.asObservable()
  }

  getActiveProviderEvents() {
    var subject = new Subject()
    this.getProviderEvents()
      .subscribe(
        (data: any) => {
          subject.next(this.filterActiveEvents(data))
        }
      )
    return subject;
    // return this.getProviderEvents()
  }

  getOldProviderEvents() {
    var subject = new Subject()
    this.getProviderEvents()
      .subscribe(
        (data: any) => {
          subject.next(this.filterOldEvents(data))
        }
      )
    return subject;
    // return this.getProviderEvents()
  }

  getProviderEvents() {
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
      .subscribe(data => {
        subject.next(data);
        /*console.log("here come the events of a provider");console.log(data)*/
      })
    return subject.asObservable();
  }

  server2local_event(server_event_array) {
    var final_res = [];

    for (var i = 0; i < server_event_array.length; i++) {
      var res = new Event();
      var server_event = server_event_array[i]
      res.id = +server_event.event_id;
      res.available_tickets = +server_event.event_available_tickets;
      res.date = server_event.event_date
      res.description = server_event.event_description
      res.lat = +server_event.event_lattitude
      res.lng = +server_event.event_longtitude
      res.location = server_event.event_map_data
      res.age_max = +server_event.event_maximum_age
      res.age_min = +server_event.event_minimum_age
      res.name = server_event.event_name
      res.price = +server_event.event_price
      res.provider_id = +server_event.event_provider_id
      res.img = `/images/${res.id}.image.png`
      final_res.push(res);
    }
    // console.log("Final Res:")
    // console.log(final_res)
    return final_res;
  }

  elastic2local_event(server_event_array) {
    var final_res = [];

    for (var i = 0; i < server_event_array.length; i++) {
      var res = new Event();
      var server_event = server_event_array[i]
      res.id = +server_event._id;
      res.available_tickets = +server_event._source.event_available_tickets;
      res.date = server_event._source.event_datetime
      res.description = server_event._source.event_description
      res.lat = +server_event._source.event_lattitude
      res.lng = +server_event._source.event_longtitude
      res.location = server_event._source.event_map_data
      res.age_max = +server_event._source.event_maximum_age
      res.age_min = +server_event._source.event_minimum_age
      res.name = server_event._source.event_name
      res.price = +server_event._source.event_price
      res.provider_id = +server_event.event_provider_id
      res.img = `/images/${res.id}.image.png`
      final_res.push(res);
    }
    // console.log("Final Res:")
    // console.log(final_res)
    return final_res;
  }

  server2local_event_single(server_event) {
    // var final_res =  [];

    // for(var i = 0;i<server_event_array.length;i++){
    var res = new Event();
    // var server_event = server_event_array[i]
    res.id = +server_event.event_id;
    res.available_tickets = +server_event.event_available_tickets;
    res.date = server_event.event_date
    res.description = server_event.event_description
    res.lat = +server_event.event_lattitude
    res.lng = +server_event.event_longtitude
    res.location = server_event.event_map_data
    res.age_max = +server_event.event_maximum_age
    res.age_min = +server_event.event_minimum_age
    res.name = server_event.event_name
    res.price = +server_event.event_price
    res.provider_id = +server_event.event_provider_id
    res.img = `/images/${res.id}.image.png`
    // final_res.push(res);
    // }
    // console.log("Final Res:")
    // console.log(final_res)
    return res;
  }

  humanReadableDatetime(externalDate) {
    var time = new Date(Date.parse(externalDate));
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date1 = time.getDate();
    // var hour = time.getHours();


    // var minutes = time.getMinutes();
    var minutes = ("0" + time.getMinutes()).slice(-2);
    var hour= ("0" + time.getHours()).slice(-2);
    // var formattedMin= ("0" + minutes).slice(-2);

    return (date1 + "-" + month + "-" + year + " " + hour + ":" + minutes);
  }

  navbar_extended = 0;

  getNavbar(): number {
    return this.navbar_extended;
  }

}
