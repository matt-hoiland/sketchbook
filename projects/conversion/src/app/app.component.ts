import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as p5 from 'p5';

import { Rainbows } from '../sketches/rainbows';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvascontainer', {read: ElementRef, static: false})
  node: ElementRef;
  pInst: p5;

  ngAfterViewInit() {
    this.pInst = new p5(
      Rainbows.initSketch,
      this.node.nativeElement
    );
  }
}
