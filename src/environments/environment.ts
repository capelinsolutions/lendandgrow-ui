// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let token = localStorage.getItem("access_token");
console.log(token,"token");

const domain = "http://18.217.147.94:8082";
const localDomain = "http://192.168.18.13:8082";
const lanUrl = "http://192.168.100.208:8082";
const vcUrl = "http://192.168.0.37:8082";
const tahirUrl = "http://192.168.100.61:8082";
const webSocketUrl = '192.168.18.13:8082'
const homeURL = "http://192.168.0.102:8082"

export const environment = {

  //Local Environment 

  production: false,
  apiUrl: `${localDomain}/graphql`,
  // _loginURL: `${localDomain}/oauth/token`,
  apiSubs : `ws://${webSocketUrl}/graphql/subscriptions`,
  _loginStep1: `${localDomain}/api/v1/login/`,
  _loginStep2: `${localDomain}/api/v1/login/login-with-otp`,
  uploadImageURL: `${localDomain}/api/v1/file/upload/`,
  uploadPropertyImageURL: `${localDomain}/api/v1/property/upload`,
  removeImageURL: `${localDomain}/api/v1/file/delete?userType=`,
  forgetPassword: `${localDomain}/forget-password`,
  headers : { 'Authorization': `Bearer ${token}`}

  //Qasim backend

  // production: false,
  // apiUrl: 'http://192.168.100.208:8082/graphql',
  // _loginURL: "http://192.168.100.208:8082/oauth/token",
  // uploadImageURL: "http://192.168.100.208:8082/api/v1/file/upload/",
  // uploadPropertyImageURL: "http://192.168.100.208:8082/api/v1/property/upload",
  // headers : { 'Authorization': `Bearer ${token}`}


  //Production
  // production: false,
  // apiUrl: `${localDomain}/graphql`,
  // _loginURL: `${domain}/oauth/token`,
  // uploadImageURL: `${domain}/api/v1/file/upload/`,
  // uploadPropertyImageURL: `${domain}/api/v1/property/upload`,
  // headers : { 'Authorization': `Bearer ${token}`}
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
