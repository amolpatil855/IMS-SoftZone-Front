import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {
  elemRef: ElementRef

  constructor(private el: ElementRef) {
    this.elemRef = el
  }

  @Input() OnlyNumber: boolean;
  @Input() DecimalPlaces: string;
  @Input() minValue: string;
  @Input() maxValue: string;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    let e = <any> event

    let valInFloat: number = parseFloat(e.target.value==''?0:e.target.value)
   
    if(e.key=='.' && (e.target.value.indexOf('.')!=-1||e.target.value=='' ||  parseInt(this.DecimalPlaces)==0))
    {
        e.preventDefault();
    }

    if(e.target.value.indexOf('.')==-1)
    {
        valInFloat=(valInFloat*10)+parseFloat(e.key);
    }
    else{
       var  splitArr= e.target.value.split('.');
        valInFloat=parseFloat(splitArr[0])+parseFloat("0."+splitArr[1]+e.key);
        if(splitArr[1].length>=(parseInt(this.DecimalPlaces)))
        e.preventDefault();
    }
    if(this.minValue.length) {
      // (isNaN(valInFloat) && e.key === "0") - When user enters value for first time valInFloat will be NaN, e.key condition is 
      // because I didn't want user to enter anything below 1.
      // NOTE: You might want to remove it if you want to accept 0
      if( valInFloat < parseFloat(this.minValue) && valInFloat!=0) {//|| (isNaN(valInFloat) && e.key === "0")
        e.preventDefault();
      }
    }

    if(this.maxValue.length) {
      if(valInFloat > parseFloat(this.maxValue)) {
        e.preventDefault();
      }
    }

    if (this.DecimalPlaces) {
      let currentCursorPos: number = -1;    
      if (typeof this.elemRef.nativeElement.selectionStart == "number") {
          currentCursorPos = this.elemRef.nativeElement.selectionStart;
      } else {
        // Probably an old IE browser 
        console.log("This browser doesn't support selectionStart");
      }

      let dotLength: number = e.target.value.replace(/[^\.]/g, '').length
      // If user has not entered a dot(.) e.target.value.split(".")[1] will be undefined
      let decimalLength = e.target.value.split(".")[1] ? e.target.value.split(".")[1].length : 0;

      // (this.DecimalPlaces - 1) because we don't get decimalLength including currently pressed character 
      // currentCursorPos > e.target.value.indexOf(".") because we must allow user's to enter value before dot(.)
      // Checking Backspace etc.. keys because firefox doesn't pressing them while chrome does by default
      if( dotLength > 1 || (dotLength === 1 && e.key === ".") || (decimalLength > (parseInt(this.DecimalPlaces) - 1) && 
        currentCursorPos > e.target.value.indexOf(".") && parseInt(this.DecimalPlaces)>0) && ["Backspace", "ArrowLeft", "ArrowRight"].indexOf(e.key) === -1 ) {
        e.preventDefault();
      }
    }  
  }

  @HostListener('change', ['$event']) onChange(event) {
    let e = <any> event

    let valInFloat: number = parseFloat(e.target.value==''?0:e.target.value)
   
    if(valInFloat< parseFloat(this.minValue))
    {
        e.target.value='';
    }
  }
}