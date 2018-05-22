import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

//import { ModalPage } from '../modal/modal';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  image: string = null;
  faces: any;
  statusShowInfo: string = "";

  constructor(
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private camera: Camera,
    public http: Http) {
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture(options)
      .then(imageData => {
        let loader = this.loadingCtrl.create({
          content: "Procesando...",
          duration: 3000
        });
        loader.present();

        this.image = `data:image/jpeg;base64,${imageData}`;
        this.faceRecognition(this.dataURLtoBlob(`data:image/jpeg;base64,${imageData}`));

      })
      .catch(error => {
        console.error(error);
      });
  }

  dataURLtoBlob(myURL) {
    let binary = atob(myURL.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  showInfo() {
    this.openModal(this.faces);
  }

  openModal(myModalData) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modalCtrl.create('ModalPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }

  faceRecognition(img: Blob) {
    this.getKeyAzure().subscribe(data => {
      let resp = JSON.parse(data["_body"]);

      var headers = new Headers();
      headers.append('Content-Type', 'application/octet-stream');
      headers.append("Ocp-Apim-Subscription-Key", resp.azure_key);

      var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
          "age,gender,headPose,smile,facialHair,glasses,emotion," +
          "hair,makeup,occlusion,accessories,blur,exposure,noise"
      };

      var params_url = Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
      }).join('&')

      this.http.post(
        "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect" + "?" + params_url, img,
        {
          headers: headers
        })
        .map(res => res.json())
        .subscribe(res => {
          this.faces = JSON.stringify(res);
          this.statusShowInfo = "show";
        }, (err) => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err,
            buttons: ['OK']
          });
          alert.present();
        })
    }, (err) => {

    }
    );
  }

  getKeyAzure() {
    return this.http.get("../assets/config.json");
  }
}
