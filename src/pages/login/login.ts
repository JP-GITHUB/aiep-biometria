import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private faio: FingerprintAIO,
    private platform: Platform
  ) { }

  ionViewDidLoad() {
    this.login();
  }

  login() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password' // Only Android
    })
      .then((result: any) => {
        this.navCtrl.setRoot('HomePage');
      })
      .catch((error: any) => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        });
        alert.present();
        this.platform.exitApp();
      });
  }

}