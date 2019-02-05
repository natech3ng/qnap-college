import { Injectable } from '@angular/core';
import { Observable ,  Subscriber } from 'rxjs';

@Injectable()
export class AddScriptService {
  constructor(){}

  checkForScript(scriptPath: string) {
    let scriptOnPage: boolean = false;
    const selector = `script[src*="${scriptPath}"]`;
    const matches = document.querySelectorAll(selector);
    if(matches.length > 0) {
        scriptOnPage = true;
    }
    return scriptOnPage;
  }

  addScript(scriptPath: string, params: Object) {
    // if script is already on page, do nothing
    if (this.checkForScript(scriptPath)) {
      return;
    }

    // const profileId = 'ra-5a0dd7aa711366bd';
    // const baseUrl = '//s7.addthis.com/js/300/addthis_widget.js';
    const scriptInFooter = true;
    // var url;

    // if(profileId) {
    //     // preference the site's profile ID in the URL, if available
    //     url = baseUrl + '#pubid=' + profileId;
    // } else {
    //     url = baseUrl;
    // }

    // create SCRIPT element
    let script = document.createElement('script');
    script.src = scriptPath;

    // append SCRIPT element

    if(scriptInFooter !== true && typeof document.head === 'object') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  };

  addMeta(params: Object) {
    console.log('add Meta')
    let meta = document.createElement('meta');

    for (let key in params) {
      console.log(key);
      meta['key'] = params[key];
    }
    document.head.appendChild(meta);
  }

}