// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/',
  // recapctchaSitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' 
  recapctchaSitekey: '6LeVt3cUAAAAADO9qIyWsIHZOaiFUKr0PwWvVes9',
  FBId: '329773877659792',
  GoogleClientID: '230327847455-22t14dhl2qde7n6c48c0r7c1keqengqb.apps.googleusercontent.com',
  comment_enable: true,
  recaptchaV2Sitekey: '6Lc7u3cUAAAAADVAPG0CZLsa4Xes3VxphP2mzVpS',
  recaptchaV2InvSitekey: '6LdhEZEUAAAAAEvQu40rJReNmPsqlZ6WoAq3Vp67',
  user_per_page: 5
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
