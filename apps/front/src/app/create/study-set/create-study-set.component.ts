import { Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CreateCardComponent } from "./create-card/create-card.component";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { AlertComponent } from "../../shared/alert/alert.component";
import { Router } from "@angular/router";
import { SetsService } from "../../shared/http/sets.service";

@Component({
  selector: 'scholarsome-create',
  templateUrl: './create-study-set.component.html',
  styleUrls: ['./create-study-set.component.scss']
})
export class CreateStudySetComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sets: SetsService
  ) {}

  @ViewChild('cardList', { static: true, read: ViewContainerRef }) cardList: ViewContainerRef;

  @ViewChild('title', { static: false, read: ViewContainerRef }) titleInput: ViewContainerRef;
  @ViewChild('description') descriptionInput: ElementRef;
  @ViewChild('privateCheck') privateCheckbox: ElementRef;

  formDisabled = false;

  // index starts at 0
  cards: { component: ComponentRef<CreateCardComponent>, index: number }[] = [];

  async createSet() {
    const cards: { index: number; term: string; definition: string; }[] = [];

    if (!this.titleInput.element.nativeElement.value) {
      const alert = this.titleInput.createComponent<AlertComponent>(AlertComponent);

      alert.instance.message = 'Title must not be empty';
      alert.instance.type = 'danger';
      alert.instance.dismiss = true;
      alert.instance.spacingClass = 'mt-3';

      return;
    }

    for (const card of this.cards) {
      if (card.component.instance.term.length !== 0 && card.component.instance.definition.length !== 0) {
        cards.push({
          index: card.component.instance.cardIndex,
          term: card.component.instance.term,
          definition: card.component.instance.definition
        });
      } else {
        card.component.instance.notifyEmptyInput();
        return;
      }
    }

    this.formDisabled = true;

    const set = await this.sets.createSet({
      title: this.titleInput.element.nativeElement.value,
      description: this.descriptionInput.nativeElement.value,
      private: this.privateCheckbox.nativeElement.checked,
      cards
    });

    await this.router.navigate(['/view/sets/' + set?.id]);
  }

  updateCardIndices() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].component.instance.cardIndex = i;
      this.cards[i].index = i;

      this.cards[i].component.instance.upArrow = i !== 0;
      this.cards[i].component.instance.downArrow = this.cards.length - 1 !== i;
    }
  }

  addCard() {
    const card = this.cardList.createComponent<CreateCardComponent>(CreateCardComponent);
    card.instance.cardIndex = this.cardList.length - 1;

    card.instance.deleteCardEvent.subscribe(e => {
      if (this.cardList.length > 1) {
        this.cardList.get(e)?.destroy();

        this.cards.splice(this.cards.map(c => c.index).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe(e => {
      if (this.cardList.length > 1) {
        const cardIndex = this.cards.map(c => c.index).indexOf(e.index);

        this.cardList.move(this.cards[cardIndex].component.hostView, e.index + e.direction);

        this.cards[this.cards.map(c => c.index).indexOf(e.index + e.direction)].index = e.index;
        this.cards[cardIndex].index = e.index + e.direction;

        this.cards.sort((a, b) => a.index - b.index);

        this.updateCardIndices();
      }
    });

    this.cards.push({
      component: card,
      index: this.cardList.length - 1
    });

    this.updateCardIndices();
  }

  ngOnInit() {
    this.addCard();
  }
}
