import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StudySetComponent } from "./study-set.component";
import { StudySetCardComponent } from "./study-set-card/study-set-card.component";
import { StudySetFlashcardsComponent } from "./study-set-flashcards/study-set-flashcards.component";
import { StudySetQuizComponent } from "./study-set-quiz/study-set-quiz.component";
import {
  StudySetQuizQuestionComponent
} from "./study-set-quiz/study-set-quiz-question/study-set-quiz-question.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { StudySetRoutingModule } from "./study-set-routing.module";

@NgModule({
  declarations: [
    StudySetComponent,
    StudySetCardComponent,
    StudySetFlashcardsComponent,
    StudySetQuizComponent,
    StudySetQuizQuestionComponent
  ],
  exports: [StudySetCardComponent],
  imports: [
    CommonModule,
    StudySetRoutingModule,
    FontAwesomeModule,
    PopoverModule,
    TooltipModule,
    FormsModule,
    RouterModule
  ]
})
export class StudySetModule { }