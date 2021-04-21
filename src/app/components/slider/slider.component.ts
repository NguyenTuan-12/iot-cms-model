import {
  Component,
  OnInit,
  SecurityContext,
  Output,
  EventEmitter,
} from "@angular/core";
import { Subscription, interval } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { Input } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
  keyframes,
} from "@angular/animations";
import * as _ from "lodash";

@Component({
  selector: "angular-image-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.scss"],
  animations: [
    trigger("move", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => left", [
        style({ transform: "translateX(100%)" }),
        animate(200),
      ]),
      transition("left => void", [
        animate(200, style({ transform: "translateX(0)" })),
      ]),
      transition("void => right", [
        style({ transform: "translateX(-100%)" }),
        animate(200),
      ]),
      transition("right => void", [
        animate(200, style({ transform: "translateX(0)" })),
      ]),
    ]),
  ],
})
export class SliderComponent implements OnInit {
  @Input() images : [any];
  @Input() autoRotate = false;
  @Input() autoRotateAfter = 5000;
  @Input() autoRotateRight = true;
  @Input() flagState;
  @Output() imgUrls = new EventEmitter();
  public safeUrls = [];
  public imageUrls: any;
  public state = "void";
  public disableSliderButtons = false;
  public flagMoveBtn = false;
  subscription: Subscription;
  public childState = "";
  disableBtn = true;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if(this.images && this.images.length) {
      this.images.forEach((element) => {
        this.safeUrls.unshift(element.url);
      });
    }
    this.imageUrls = this.safeUrls;
    if (this.autoRotate) {
      const source = interval(this.autoRotateAfter);
      this.subscription = source.subscribe(() =>
        this.autoRotateRight ? this.moveLeft() : this.moveRight()
      );
    }
    if (this.flagState == "view") {
      this.disableBtn = false;
    }
  }
  imageRotate(arr, reverse) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }
    return arr;
  }

  moveLeft() {
    if (this.disableSliderButtons) {
      return;
    }
    this.state = "right";
    this.imageRotate(this.imageUrls, true);
  }

  moveRight() {
    if (this.disableSliderButtons) {
      return;
    }
    this.state = "left";
    this.imageRotate(this.imageUrls, false);
  }

  onFinish($event) {
    this.state = "void";
    this.disableSliderButtons = false;
  }

  onStart($event) {
    this.disableSliderButtons = true;
  }
  removeImg = (index) => {
    this.imageUrls.splice(index, 1);
    this.images = this.imageUrls;
    this.imgUrls.emit(this.imageUrls);
    if(this.imageUrls.length === 1)  {
      this.flagMoveBtn = true;
    }
  };
}
