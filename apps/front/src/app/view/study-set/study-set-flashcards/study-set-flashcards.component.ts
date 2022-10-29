import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SetsService } from "../../../shared/http/sets.service";
import { ActivatedRoute, Router, } from "@angular/router";
import { Card } from '@prisma/client';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'scholarsome-study-set-flashcards',
  templateUrl: './study-set-flashcards.component.html',
  styleUrls: ['./study-set-flashcards.component.scss'],
})
export class StudySetFlashcardsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sets: SetsService,
    private router: Router,
    public modalService: BsModalService
  ) {}

  modalRef?: BsModalRef;

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('flashcard', { static: true }) flashcard: ElementRef;
  @ViewChild('controlbar', { static: true }) controlbar: ElementRef;
  @ViewChild('answerWith', { read: ElementRef }) answerWith: ElementRef;

  @ViewChild('settings') settings: TemplateRef<any>;

  cards: Card[];

  setId: string | null;

  answer = 'Definition';
  side = 'Term';
  index = 0;

  updateIndex() {
    this.controlbar.nativeElement.children[1].textContent = `${this.index + 1}/${this.cards.length}`;
  }

  flipCard() {
    if (this.side === 'Term') {
      this.flashcard.nativeElement.children[0].textContent = this.cards[this.index].definition;
      this.side = 'Definition';
    } else {
      this.flashcard.nativeElement.children[0].textContent = this.cards[this.index].term;
      this.side = 'Term';
    }
  }

  changeCard(direction: number) {
    this.index += direction;
    this.updateIndex();

    this.side = this.answer;

    this.flashcard.nativeElement.children[0].textContent =
      this.answer === 'Definition' ? this.cards[this.index].term : this.cards[this.index].definition;
  }

  openSettings() {
    this.modalRef = this.modalService.show(this.settings);

    console.log(this.answerWith);

    if (this.answer === 'Definition') {
      this.answerWith.nativeElement.children[0].setAttribute('checked', true);
    } else {
      this.answerWith.nativeElement.children[2].setAttribute('checked', true);
    }
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get('setId');
    if (!this.setId) {
      await this.router.navigate(['404']);
      return;
    }

    const set = await this.sets.set(this.setId);
    if (!set) {
      await this.router.navigate(['404']);
      return;
    }

    this.cards = set.cards;

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute('hidden');

    this.updateIndex();
    this.flashcard.nativeElement.children[0].textContent = this.cards[0].term;
  }

}