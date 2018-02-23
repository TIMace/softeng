import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event } from '../event';
import { EVENTS } from '../mock-events';

// Services
import { EventService } from '../event.service';

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
    private location: Location
  ) { }

  ngOnInit() {
    this.category = EVENTS[0];
    // this.getEvent();
  }

  // getEvent(): void {
  //   const id = +this.route.snapshot.paramMap.get('id');
  //   this.eventService.getEvent(id)
  //     .subscribe(event => this.event = event);
  // }

}
