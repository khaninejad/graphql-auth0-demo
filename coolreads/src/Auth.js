import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: '<domain_name>',
      clientID: '<client_id>',
      redirectUri: 'http://localhost:3000/callback',
      audience: '<client_domain>userinfo',
      responseType: 'token id_token',
      scope: 'openid email'
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.authFlag = 'isLoggedIn';
  }

  login() {
    this.auth0.authorize();
  }

  getIdToken() {
    return this.idToken;
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }
  signIn() {
    this.auth0.authorize();
  }
  signOut() {
    localStorage.setItem(this.authFlag, JSON.stringify(false));
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: 'LUft9iOEONnQilP8mFDdmiBHdNljGJ2u',
    });
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    localStorage.setItem(this.authFlag, JSON.stringify(true));
  }

  logout() {
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: '<client_id>',
    });
  }

  silentAuth() {
    if(this.isAuthenticated()) {
        return new Promise((resolve, reject) => {
          this.auth0.checkSession({}, (err, authResult) => {
            if (err) {
              localStorage.removeItem(this.authFlag);
              return reject(err);
            }
            this.setSession(authResult);
            resolve();
          });
        });
      }
  }

  isAuthenticated() {
    return JSON.parse(localStorage.getItem(this.authFlag));
  }
}

const auth = new Auth();

export default auth;