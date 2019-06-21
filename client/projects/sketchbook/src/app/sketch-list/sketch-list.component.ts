import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sketch-list',
  templateUrl: './sketch-list.component.html',
  styleUrls: ['./sketch-list.component.less']
})
export class SketchListComponent implements OnInit {
  objectKeys = Object.keys;
  colors = {
    red: [ '#faa', '#844' ],
    yellow: [ '#ffa', '#884' ],
    green: [ '#afa', '#484' ],
    cyan: [ '#aff', '#488' ],
    blue: [ '#aaf', '#448' ],
    magenta: [ '#faf', '#848' ]
  };

  constructor() { }

  ngOnInit() {
  }
}
