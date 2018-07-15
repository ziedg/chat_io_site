// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,


  //SERVER_URL: 'http://localhost:3002/',
  //IMAGE_BASE_URL: 'https://integration.speegar.com/images/',

  //INTEGRATION SERVERS
  SERVER_URL: 'https://integration.speegar.com:3002/',
  IMAGE_BASE_URL: 'https://integration.speegar.com/images/',
  //Todo : change with speegar account
  firebase: {
    apiKey: "AIzaSyAnCqxH5CTNWksJH6j59jIKjxkVJOyEyIk",
    authDomain: "speegar-6deca.firebaseapp.com",
    databaseURL: "https://speegar-6deca.firebaseio.com",
    projectId: "speegar-6deca",
    storageBucket: "speegar-6deca.appspot.com",
    messagingSenderId: "861552240215"
  }

};
