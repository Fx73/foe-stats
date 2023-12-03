import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

import { HeaderComponent } from "../shared/header/header.component";
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, RouterModule, NgIf]
})
export class HomePage {
  constructor(private modalController: ModalController) {
  }




}
