import { Component, OnInit, Input, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../event';
import { EVENTS } from '../mock-events';
import { Location } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material';

// Services
import { EventService } from '../event.service';
import { element } from 'protractor';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { server_addr } from '../server_addr';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css']
})

export class EditActivityComponent implements OnInit {

  ev: Event;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    // private location: Location,
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  id = 0;
  name = "";
  location = "";
  img = "";
  lat = 0;
  lng = 0;
  date = new Date;
  categories = [""];
  age_min = 0;
  age_max = 0;
  description = "";
  euros = 0;
  cents = 0;
  ngOnInit() {
    this.getID();
    // console.log(this.ev);
  }

  getID(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.eventService.getEventById(id)
      .subscribe((ev:any) => {
        this.ev = ev;
        console.log("EVENT");
        console.log(ev);
        this.id = this.ev.id;
        this.name = this.ev.name;
        this.lat = this.ev.lat;
        this.lng  = this.ev.lng;
        this.location = this.ev.location;
        this.img = this.ev.img;
        this.date = new Date(this.ev.date);
        this.categories = this.ev.categories;
        this.age_min = this.ev.age_min;
        this.age_max = this.ev.age_max;
        this.description = this.ev.description;
        this.euros = Math.floor(this.ev.price / 100);
        this.cents = this.ev.price % 100; });
        console.log("KATHGORIES");
        console.log(this.categories);
        
  }

  updateEvent() {
    var eventDetails: Event;
    var localDate = new Date();
    if (this.date <= localDate) {
      alert("Πρέπει να επιλεγεί μελλοντική ημερομηνία διεξαγωγής")
    }
    else if (!Number.isInteger(+this.ev.age_min) || !Number.isInteger(+this.ev.age_max) || +this.ev.age_min > +this.ev.age_min) {
      alert("Ελέγξτε τα πεδία των ηλικιών. Οι τιμές πρέπει να είναι ακέραιες και η μέγιστη ηλικία να μην είναι μικρότερη από την ελάχιστη")
    }
    else if (!Number.isInteger(+this.euros) || !Number.isInteger(+this.cents) || +this.cents > 99) {
      alert("Ελέγξτε τα πεδία της τιμής. Οι τιμές πρέπει να είναι ακέραιες και τα Λεπτά το πολύ 99")
    }
    else {
      eventDetails = {
        id: this.id,
        price: +(this.euros) * 100 + this.cents,
        name: this.name,
        description: this.description,
        date: this.date.toISOString(),
        provider_id: null,
        available_tickets: null,
        lat: +this.lat,
        lng: +this.lng,
        age_min: +this.age_min,
        age_max: +this.age_max,
        location: this.location, //map_data ths vashs
        is_paid: null,
        img: null,
        categories: this.categories,
        providerInfo:null,
        ev_base64:null
      };

      this.eventService.updateEvent(eventDetails)
        .subscribe(
        (answer: boolean) => {
          if (answer) {
            alert("Η ανανέωση της δραστηριότητας ήταν επιτυχής");
            this.router.navigate(['/panel'])
          }
          else {
            alert("Αποτυχία ανανέωσης δραστηριότητας");
          }
        }
        );
    }
  }

  cancelEvent() {
    this.router.navigate(['/panel']);
  }

}
