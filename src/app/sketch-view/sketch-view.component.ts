import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as p5 from 'p5';
import { initSketch } from '../test-sketch';

@Component({
  selector: 'app-sketch-view',
  templateUrl: './sketch-view.component.html',
  styleUrls: ['./sketch-view.component.less']
})
export class SketchViewComponent implements OnInit, OnDestroy, AfterViewInit {
  pInst: p5;
  @ViewChild(
    'sketchholder',
    {
      read: ElementRef,
      static: false
    }
  )
  node: ElementRef;
  colorA: string;
  colorB: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {
    console.log("I've been made!");
  }

  ngOnInit() {
    this.colorA = `#${this.route.snapshot.paramMap.get('a')}`;
    this.colorB = `#${this.route.snapshot.paramMap.get('b')}`;
    console.log(`Colors: ${this.colorA}, ${this.colorB}`);
  }

  ngAfterViewInit() {
    this.pInst = new p5(
      initSketch(this.colorA, this.colorB),
      this.node.nativeElement
    );
    console.log(`Sketch initialized`);
  }

  ngOnDestroy() {
    console.log('p5::remove start...');
    this.pInst.remove();
    console.log('p5::remove done!');
    this.pInst = null;
  }

  goBack() {
    this.location.back();
  }

}
