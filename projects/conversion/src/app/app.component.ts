import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as p5 from 'p5';

import { DarkTree } from '../sketches/darktree';

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
      DarkTree.initSketch,
      this.node.nativeElement
    );
  }
}
