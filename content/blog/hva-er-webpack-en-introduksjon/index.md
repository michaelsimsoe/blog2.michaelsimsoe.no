---
title: Hva er webpack? En introduksjon
date: '2020-02-20T18:00:00.000Z'
updated: '2020-03-03T20:00:00.000Z'
description: 'Webpack er en modulbunter som bringer mer på banen enn det som tidligere har vært. Vi ser også på litt historie.'
slug: 'hva-er-webpack-en-introduksjon'
tags:
  - javascript
  - utviklingsmiljø
  - produktivitet
  - webpack
heroimage: webpack.png
published: true
---

# Hva er Webpack?

Etter hvert som kompleksiteten i den brukernære enden av en webbasert applikasjon, altså "frontenden" øker, vil det på et tidspunkt være svært ønskelig å bryte denne ned i mindre moduler.

Dette gjør man enten igjennom bruk av designmønster som utnytter egenskaper i språket som IIFEs, eller gjennom ESM/Ecmascript modules.

Det er ikke uvanlig at en slik applikasjon ender opp med hundrevis, om ikke tusenvis, av moduler, og da vil du, til tross for HTTP2s økte kapasitet for samtidige forbindelser, bli straffet ytelsesmessig.

Løsningen blir da å pakke det små sammen til noe større, som kan serveres i en leveranse, eller over flere større leveranser.

## Her kommer webpack inn

Webpack forenkler webutviklinge ved å løse et fundamentalt problem: bunting. Den tar forskjellige ressurser, som JS, css og html og transformerer dem til noe som er passende for nettleseren å konsumere.

Webpack er altså en **modulbunter**, men har kapasitet til å automatisere repeterbare oppgaver på samme måte som gulp og grunt ved hjelp av innpluggbare utvidelser.

_Hvorfor webpack hvis man har alternativ allerede?_ Vel, dette er javascriptøkosystemet så det kommer alltid noe nytt.

Men..

Webpack bringer mer på banen enn det som har eksistert. De tidligere løsningene har endt opp med å kun kjede sammen de forskjellige modulene og dermed gjort det nødvendig å bygge alt på nytt ved enhver endring.

Webpack gir også muligheten for å dele kode gjennom prosjektet vært mindre enn optimal samt at såkalt "lazy loading" og asynkron innlasting av moduler har vært utfordrende.

Med Webpack blir prosjektet ditt behandlet som en avhengighetsgraf og buntet sammen deretter. Det lar deg håndtere alle elementene i prosjektet ditt som ressurser. Webpack gir deg også mulighet til å velge hvilken modulformat du vil benytte. Kodesplitting, statisk asynkron bunting og såkalt "Tree shaking" for å fjærne ubrukt kode er også fine ting.

## Historien om webpack

Det hele startet i 2012 da Tobias Koppers måtte lage en webapplikasjon i forbindelse med en tese han jobbet med. Han hadde ikke laget en ren webapplikasjon før, men var klar på at han ønsket kodesplitting.

Tobias fant ingen buntere som tilbød dette og endte dermed opp med å med å forke _mediko/modules-webmake_ (en tidligere bunter), og introduserte kodesplitting i den. [Han endte opp med å kalle den Webpack](https://github.com/medikoo/modules-webmake/issues/7)(github).

## Gjennombruddet

Webpack tok ikke av før to år senere, i 2014 da [Pete Hunt presenterte det som en del av stacken til Instagram](https://www.youtube.com/watch?v=VkTCL6Nqm6Y)(youtube) der han forklarte at de bruker den til å bunte reactapplikasjonen sin:

Dan Abramov(link) [snubler samme år over webpack og Hot Module Replacement](https://stackoverflow.com/questions/24581873/what-exactly-is-hot-module-replacement-in-webpack)(stackoverflow). I frustrasjon over hindringer, tregheter og generelle vanskeligheter i utviklingen koker han ned Flux(link) til det som blir Redux(link). Sammen med HMR fra webpack og Redux oppnår han muligheten til å bevare tilstanden i applikasjonen han jobber med, selv når han gjør endringer i koden. Han presenterer denne såkalte "tidsreisingen" under [React Europe 2015](https://www.youtube.com/watch?v=xsSnOQynTHs)(youtube).

Etter hvert kommer også Angular og Vue etter.

## Webpack 101 - opp og kjøre

Legg til webpack som en utviklingsavhengighet:

```bash
npm i webpack -D
```

Da kan du kjøre igang webpack med:

```shell
node_modules/.bin/webpack
```

Eventuelt kan du tablere et webpack skript i package.json:

```json
...
"scripts": {
  "webpack": "webpack"
}
...
```

Du får tilgang til de kjørbare filene i node_modules/.bin ved å legge til i "scripts" i `package.json`. Mer om det en annen gang, kanskje.

Tilbake til terminalen

```bash
npm run webpack
```

Webpack kjører i utgangspunktet uten at du trenger å konfigurere noe. Det eneste den trenger er en src/index.js som input. Resultatet vil bli en dist/main.js

Du kan kjøre webpack i en overvåkingsmodus med flagget —watch. Dette vil rekompilere byggingen. Neste steg vil være å installere webpack-dev serveren:

```bash
npm install webpack-dev-server -D
```

Denne vil bygge opp filene og servere dem fra minnet fortløpende i tillegg til å oppdatere nettleservinduet på forandring.

Til slutt kan du installere en plugin for å oppnå såkalt **"Hot Module Replacement"**, hvor ny kode vil bli injisert inn uten å brekke tilstanden til applikasjonen i nettleseren.

Du kan etablere en **webpack.config.js** for å overskrive normalverdiene.

Hovedhensikten til Webpack er å bunte moduler, men du får så mye mer.

## Til slutt, litt nødvendig vokabular

**Entry**: er roten. den første filen som lastes. Denne blir definert i config.entry. Webpack starter her og konstruerer grafen

**Output**: er det webpack skal produsere når den bunter sammen, hvor og hvordan.

**Loader**: forteller webpack hvordan den skal behandle/transformere en definert filtype. Definert som regler med regex for filtype. Altså fungerer de på en per fil basis.

**Plugins**: en instans/klasse/objekt som lar det koble deg inn på livssyklusen til webpack og tilføye ny funksjonalitet utover modulbunting. Funksjonaliteten i webpack er i praksis bygget opp slike.
