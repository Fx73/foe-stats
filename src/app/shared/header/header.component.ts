import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

import { RouterModule } from '@angular/router';
import { WelcomeComponent } from 'src/app/home/welcome/welcome.component';
import { WikiaService } from './../../services/wikia.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class HeaderComponent implements OnInit {

  @Input()
  title: string = "Welcome";

  constructor(private modalController: ModalController, private wikiaService: WikiaService) { }

  ngOnInit() {
    if (!localStorage.getItem('hideModal'))
      this.showModal()
  }

  async showModal() {
    localStorage.removeItem('hideModal')
    const modal = await this.modalController.create({
      component: WelcomeComponent,
      componentProps: {
        // Envoyez des données au composant modal si nécessaire
      }
    });
    return await modal.present();
  }

  refreshData() {
    this.wikiaService.refreshBuildings()
  }

  isworking() {
    return this.wikiaService.isWorking()
  }
}

