/**
 * https://stackoverflow.com/questions/35538552/in-angular2-i-only-want-to-add-the-addthis-plugin-to-a-specific-route-e-g-my-b
 * Reinitiate add this.
 */ 

import { Injectable } from '@angular/core';
import { Observable ,  Subscriber } from 'rxjs';

@Injectable()
export class AddThisService {
  constructor(){}
  private removeScript(){
      let element     = null;
      let divElements = null;
      let divElement  = null;

      element = document.getElementById('addthis-js');
      if (element) {
          element.parentNode.removeChild(element);
      }

      divElement = document.getElementById('_atssh');
      if (divElement) {
          divElement.style.display = "none";
      }

      divElements = document.getElementsByClassName('addthis-smartlayers');
      while (divElements.length > 0) {
          divElements[0].parentNode.removeChild(divElements[0]);
      }

      divElements = document.getElementsByClassName('addthis-smartlayers-desktop');
      while (divElements.length > 0) {
          divElements[0].parentNode.removeChild(divElements[0]);
      }

      divElements = document.getElementsByClassName('addthis-smartlayers-mobile');
      while (divElements.length > 0) {
          divElements[0].parentNode.removeChild(divElements[0]);
      }

      return true;
  }
  showLayers() {
      var divElements = null;
      var divElement  = null;

      divElement = document.getElementById('_atssh');
      if (divElement) {
          divElement.style.display = "block";
      }

      divElements = document.getElementsByClassName('addthis-smartlayers');
      for (var i = 0; i < divElements.length; i++) {
          divElements[0].style.display = "block";
      }

      divElements = document.getElementsByClassName('addthis-smartlayers-desktop');
      for (var i = 0; i < divElements.length; i++) {
          divElements[0].style.display = "block";
      }

      divElements = document.getElementsByClassName('addthis-smartlayers-mobile');
      for (var i = 0; i < divElements.length; i++) {
          divElements[0].style.display = "block";
      }

      return true;        
  }

  hideLayers () {
          var divElements = null;
          var divElement  = null;

          divElement = document.getElementById('_atssh');
          if (divElement) {
              divElement.style.display = "none";
          }

          divElements = document.getElementsByClassName('addthis-smartlayers');
          for (var i = 0; i < divElements.length; i++) {
              divElements[0].style.display = "none";
          }

          divElements = document.getElementsByClassName('addthis-smartlayers-desktop');
          for (var i = 0; i < divElements.length; i++) {
              divElements[0].style.display = "none";
          }

          divElements = document.getElementsByClassName('addthis-smartlayers-mobile');
          for (var i = 0; i < divElements.length; i++) {
              divElements[0].style.display = "none";
          }

      return true;
  }

  private loadProject(key: string, hideLayers:boolean) {
      return Observable.create((observer: Subscriber<any>) => {
          switch (true) {                
              case (!document || !window):
              /**
               * For Angular Universal
               */
                  observer.error('Cannot render it on Server');
                  observer.complete();
              case ((document.getElementById('addthis-js') != null)):

                  if (hideLayers) {
                      this.hideLayers();
                  } else {
                      this.showLayers();
                  }
                  if ((<any>window).addthis && (<any>window).addthis.layers && (<any>window).addthis.layers.refresh) {
                      (<any>window).addthis.layers.refresh();
                  }
                  observer.next(true);
                  observer.complete();
                  break;

              case (!key):
                  observer.error('no-project');
                  observer.complete();
                  break;

              default :
                  var script    = document.createElement('script');
                  script.type   = 'text/javascript';
                  script.id     = 'addthis-js';
                  script.async  = true;
                  script.src    = 'https://s7.addthis.com/js/300/addthis_widget.js#pubid=' + key;
                  script.onload = (ev: Event) =>{
                      if (hideLayers) {
                          this.hideLayers();
                      } else {
                          this.showLayers();
                      }
                      (<any>window).addthis.init();
                      observer.next(true);
                      observer.complete();
                  };

                  var first = document.getElementsByTagName('script')[0];
                  first.parentNode.insertBefore(script, first);
          }
      });
  }
  /**
   * 
   * @param accountKey eg. ra-13245612346
   * @param hideLayers eg. true for hiding in a particular state and true for showing in another.
   */
  initAddThis(accountKey:string, hideLayers:boolean):Observable<any> {
    return this.loadProject(accountKey, hideLayers);
  };
}