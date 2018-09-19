import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ selector: '[appRunScripts]' })
export class RunScriptsDirective implements OnInit {
    constructor(private elementRef: ElementRef) { }
    ngOnInit(): void {
      console.log('run scripts');
        setTimeout(() => { // wait for DOM rendering
            this.reinsertScripts();
        }, 3000);
    }
    reinsertScripts(): void {
      const scripts = this.elementRef.nativeElement.getElementsByTagName('script');
      const scriptsInitialLength = scripts.length;
      for (let i = 0; i < scriptsInitialLength; i++) {
        console.log(i);
      }
      for (let i = 0; i < scriptsInitialLength; i++) {
        console.log(i);
          const script = scripts[i];
          const scriptCopy = <HTMLScriptElement>document.createElement('script');
          scriptCopy.type = script.type ? script.type : 'text/javascript';
          if (script.innerHTML) {
              scriptCopy.innerHTML = script.innerHTML;
          } else if (script.src) {
              console.log(script.src);
              scriptCopy.src = script.src;
          }
          scriptCopy.async = false;
          script.parentNode.replaceChild(scriptCopy, script);
      }
    }
}
