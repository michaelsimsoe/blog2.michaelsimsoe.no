---
title: Hva er ng-template i Angular?
date: '2020-10-06T20:00:00.000Z'
updated: '2020-10-06T20:00:00.000Z'
description: 'Hva er egentlig ng-template i Angular og hva brukes den til?'
slug: 'hva-er-ng-template-i-angular'
tags:
  - javascript
  - angular
  - direktiver
# heroimage: ./images/webpack.png
published: true
id: a6a65aff-f76f-44b2-99c1-c07db1d2a924
---

_Jeg skal bli den beste Angularutvikleren jeg kan bli. For å bli best må man kunne det grunnleggende godt. Meget godt!_

# 🤔 Hva er greia med ng-template?

I korte trekk: ng-template er direktivet som produseres i bakkant når du bruker snacksy angularsukker som \*ngIf og \*ngFor.

Du skriver dette:

```javascript
<div *ngIf="noe som kan være sant">
    Et eller annet..
</div>
```

og Angular produserer no a la dette i bakkant:

```javascript
<ng-template [ngIf]="noe som kan være sant">
  <div>
    Et eller annet..
  </div>
</ng-template>
```

Ikke så veldig livsendrende informasjon å sitte på, men kult å vite. Uansett så har du nok vært borti iværtfall to anledning hvor du har vært nødt til å benytte ng-template.

### 🔀 En else til din ngIf

Du kan selvfølgelig fyre opp en \*ngIf for både den positive og den negative tilstanden, sånn ca. slik:

```javascript
<div *ngIf="noe">
    Et eller annet..
</div>

<div *ngIf="!noe">
    Et eller annet annet...
</div>
```

For så vidt greit. Innhold inne i <ng-template></ng-template> vil ikke i utgangspunktet vise seg, det må ha ett eller annet som driver det frem. Men hvis du bruker dem med en template reference variable kan du referere til elemente i andre sammenhenger og få frem innholdet.

```javascript
<div *ngIf="noe else alternativet">
    Et eller annet..
</div>

<ng-template #alternativet">
    Et eller annet annet...
</ng-template>
```

eller evt.

```javascript
<ng-template [ngIf="noe"] [ngIfElse]="alternativet">
    Et eller annet..
</ng-template>

<ng-template #alternativet">
    Et eller annet annet...
</ng-template>
```

for \*ngFor blir magien i bakkant slik:

```javascript
  // det som skal itereres over
  const persons = [
    {name: 'geir'},
    {name: 'tore'},
    {name: 'berit'},
  ]

<ul>
  <li *ngFor="let person of persons; let i = index;">{{ i }}: {{ person.name }}</li>
</ul>

// Blir det samme som:

<ul>
  <ng-template ngFor let-person let-i="index" [ngForOf]="persons">
    <li>{{ i }}: {{ person.name }}</li>
  </ng-template>
</ul>
```

<br />

### 🛑 Flere strukturelle direktiver på samme element? Njet!

Det hender jo absolutt innimellom at man ønsker å løkke gjennom noe 'hvis' ett eller annet. Da hadde det jo vært glimrende å kunne gjøre noe slikt:

```javascript
  <div *ngFor="let cat of cats" *ngIf="noDogs">
    {{ cat.hungry? }}
  </div>
```

Akk, men nei! Det lar seg ei gjøre. Løsning kan jo tenkes å bli noe slik da:

```javascript
  <div  *ngIf="noDogs">
    <div *ngFor="let cat of cats">
      {{ cat.hungry? }}
    </div>
  </div>
```

Litt skittent med litt ekstra fjas i dokumentet 🚯, så hva hvis vi henter inn en venn av ng-template? La meg introdusere ng-content!

```javascript
  <ng-content  *ngIf="noDogs">
    <div *ngFor="let cat of cats">
      {{ cat.hungry? }}
    </div>
  </ng-content>
```

🏆 Kult! Fungerer som bare det. ng-content har så meget kult å by på. Jeg tenker at vi gløtter litt mer på den i en egen post.
