import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  public data: string;

  constructor(private navParams: NavParams, private view: ViewController) {
  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    this.data = JSON.parse(data);
  }

  closeModal() {
    this.view.dismiss(this.data);
  }
}
