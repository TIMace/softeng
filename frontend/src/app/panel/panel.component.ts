import { Component, OnInit } from '@angular/core';
import { UserDetailsService, userDetailsObj } from '../user-details.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(
    public userDetailsService: UserDetailsService
  ) { }
  
  show: number;
  show_more: boolean;

  selected_personal_info(){
    this.show = 1;
  }

  selected_present_events(){
    this.show = 2;
  }

  selected_past_events(){
    this.show = 3;
  }

  create_event(){
    this.show = 4;
  }

  ngOnInit() {
    this.show = 1;
    this.show_more = false;
  }

}
