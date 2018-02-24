import { Injectable } from '@angular/core';
import { Event } from './event';
import { EVENTS } from './mock-events';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class EventService {

  selectedEvents = [];

  constructor() { }
  
  getEvents(free_text: String, age: String, price: String, distance: String): Observable<Event[]> {
    return of(EVENTS);
  }

  getSelectedEvents(): Event[] {
    return this.selectedEvents;
  }

  // TODO rename getCategory to getEvent
  // Fix all calls of getCategory στα υπόλοιπα αρχεία

  getCategory(id: number): Observable<Event> {
    return of(EVENTS.find(event => event.id === id));
  }

  // NavBar Simple / Extended

  navbar_extended = 0;

  getNavbar(): number {
    return this.navbar_extended;
  }

}
