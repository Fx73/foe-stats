import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class WelcomeComponent {

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }

  dismissAndHide() {
    this.modalController.dismiss();
    localStorage.setItem('hideModal', 'true')
  }
}
