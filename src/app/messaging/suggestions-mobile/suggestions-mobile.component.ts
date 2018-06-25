import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestions-mobile',
  templateUrl: './suggestions-mobile.component.html',
  styleUrls: ['./suggestions-mobile.component.css']
})
export class SuggestionsMobileComponent implements OnInit {
  users = [
    {
      "name": "Iman",
      "picture": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=350"
    },
    {
      "name": "Sabrina",
      "picture": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=350"
    },
    {
      "name": "Aline",
      "picture": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=350"
    },
    {
      "name": "Mélissa",
      "picture": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=350"
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
