/*
Ett program för ett hunddagis som hanterar hundar och hundskötare.
Har funktioner som låter hundskötare snabbt kontrollera vilka hundar de ska ta ut,
vilka boxar dessa hundar befinner sig i samt vad och hur mycket specifika hundar ska äta.
*/

// HTML element
const HUNDDAGISNAMN = document.getElementById("hunddagisNamn");
const HUNDSKOTARESEKTION = document.getElementById("hundskotareSektion");
const HUNDARSEKTION = document.getElementById("hundarSektion");
const HUNDSKOTAREDIV = document.getElementById("hundSkotareDiv");
const HUNDARINNEDIV = document.getElementById("hundarInneDiv");
const NAMNSKOTAREINPUT = document.getElementById("namnSkotareInput");
const LAGGTILLHUNDSKOTAREKNAPP = document.getElementById("laggTillHundskotareKnapp");
const NAMNHUNDINPUT = document.getElementById("namnHundInput");
const BOXHUNDINPUT = document.getElementById("BoxHundInput");
const ANSVARIGSKOTAREINPUT = document.getElementById("ansvarigSkotareInput");
const LAGGTILLHUND = document.getElementById("laggTillHund");
const BYTDAGISNAMNTITEL = document.getElementById("bytDagisnamnTitel");
const NYTTDAGISNAMNINPUT = document.getElementById("nyttDagisnamnInput");
const BYTDAGISNAMNKNAPP = document.getElementById("bytDagisnamnKnapp");
const VILKENBOXINPUT = document.getElementById("vilkenBoxInput");
const KOLLABOXKNAPP = document.getElementById("kollaBoxKnapp");
const BOXOUTPUT = document.getElementById("boxOutput");
const TYPAVFODERINPUT = document.getElementById("typAvFoderInput");
const MANGDFODERINPUT = document.getElementById("mangdFoderInput");
// Arrayer med de hundar som är inne på dagiset samt hundskötare
let hundarInne = [];
let listaHundskotare = [];

// Eventlyssnare
LAGGTILLHUNDSKOTAREKNAPP.addEventListener("click", skapaHundskotare);
LAGGTILLHUND.addEventListener("click", skapaHund);
BYTDAGISNAMNKNAPP.addEventListener("click", bytDagisnamn);
KOLLABOXKNAPP.addEventListener("click", function () {
  kontrolleraBox(VILKENBOXINPUT.value);
});

/*
Kontrollerar om hunddagis namn redan har skrivits in.

Finns det inget namn på hunddagis så döljs sektionerna med hundar och hundskötare,
elementen inuti "bytDagisnamnSektion" ändras så att det indikerar ett första val av namn
istället för ändring av nuvarande namn.
Finns det ett hunddagis namn så har programmet körs förut så alla sektioner visas och
titeln hämtas från localstorage och sätts in i h1 elementet.
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
https://blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/
https://stackoverflow.com/questions/16010827/html5-localstorage-checking-if-a-key-exists
*/
if (localStorage.getItem("hunddagiset") === null) {
  BYTDAGISNAMNTITEL.innerHTML = "Välj dagisnamn:";
  BYTDAGISNAMNKNAPP.innerHTML = "Starta programmet";
  HUNDSKOTARESEKTION.style.display = "none";
  HUNDARSEKTION.style.display = "none";
} else {
  HUNDDAGISNAMN.innerHTML = window.localStorage.getItem("hunddagiset");
}

/*
Lägger till hundskötare igen om dessa har sparats från tidigare sessioner.

Det kommer aldrig att finnas fler hundskötare än antal objekt i localStorage,
så den kontrollerar hundskotare0, hundskotare1, hundskotare2 osv tills den har gått igenom
såpass många element som finns i localstorage.
Finns inte ett element som man försöker hämta med getItem så returneras null,
därför kan man kontrollera om denna finns med hjälp av "!== null".
Skapar ett nytt objekt av klassen Hundskotare och tar värden från det parsade localstorage objektet, skapar man bara ett objekt av värdet från localstorage så blir det inte
ett objekt av klassen Hundskotare så därför måste alla värden manuellt sättas in
i ett nytt Hundskotare objekt.
https://attacomsian.com/blog/javascript-iterate-over-local-storage-keys
https://webbkurs.ei.hv.se/~pb/exempel/GJP/localstorage/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
*/
for (let i = 0; i < localStorage.length; i++) {
  if (localStorage.getItem("hundskotare" + i) !== null) {
    const NYHUNDSKOTARE = JSON.parse(localStorage.getItem("hundskotare" + i));
    const NYSKOTAREDIV = document.createElement("div");
    const NYSKOTAREBILD = document.createElement("img");
    const NYSKOTAREP = document.createElement("p");
    const TABORTSKOTAREKNAPP = document.createElement("button");
    const PROMENADKNAPP = document.createElement("button");

    // Skapar objektet
    listaHundskotare[i] = new Hundskotare(NYHUNDSKOTARE.namn);

    // Skapar HTML elementen
    NYSKOTAREDIV.setAttribute("id", "hundskotare" + i);
    NYSKOTAREBILD.setAttribute("src", "images/manniska-ikon.jpg");
    NYSKOTAREBILD.style.width = "50px";
    NYSKOTAREBILD.style.height = "50px";
    NYSKOTAREP.innerHTML = NYHUNDSKOTARE.namn;
    TABORTSKOTAREKNAPP.innerHTML = "Ta bort";
    TABORTSKOTAREKNAPP.addEventListener("click", function () {
      taBortHundSkotare(i);
    });
    PROMENADKNAPP.innerHTML = "Vilka hundar ska " + NYHUNDSKOTARE.namn + " ta ut?";
    PROMENADKNAPP.addEventListener("click", function () {
      gaPaPromenad(listaHundskotare[i]);
    });
    NYSKOTAREDIV.appendChild(NYSKOTAREBILD);
    NYSKOTAREDIV.appendChild(NYSKOTAREP);
    NYSKOTAREDIV.appendChild(TABORTSKOTAREKNAPP);
    NYSKOTAREDIV.appendChild(PROMENADKNAPP);
    HUNDSKOTAREDIV.appendChild(NYSKOTAREDIV);
  }
}

/*
Lägger till hundar igen om dessa har sparats från tidigare sessioner.

Återskapar objekt på samma sätt som hundskötarna i kodblocket ovan.
Innan objektet skapas så letar den efter hundskotar objektet med samma namn
som sparades i localstorage då localstorage inte sparar själva klassobjektet utan bara
attributen.
Men genom att matcha namnet så läggs det faktiska hundskotar objektet till hund objektet.
*/
for (let i = 0; i < localStorage.length; i++) {
  if (localStorage.getItem("hund" + i) !== null) {
    const NYHUND = JSON.parse(localStorage.getItem("hund" + i));
    const NYHUNDDIV = document.createElement("div");
    const NYHUNDBILD = document.createElement("img");
    const NYHUNDP = document.createElement("p");
    const TABORTHUNDKNAPP = document.createElement("button");
    const ANDRAHUNDSKOTAREKNAPP = document.createElement("button");
    const KONTROLLERAFODERKNAPP = document.createElement("button");

    // Skapar objektet
    for (let j = 0; j < listaHundskotare.length; j++) {
      if (NYHUND.vilkenSkotare.namn === listaHundskotare[j].namn) {
        hundarInne[i] = new Hund(
          NYHUND.namn,
          NYHUND.box,
          listaHundskotare[j],
          NYHUND.typAvFoder,
          NYHUND.mangdFoder
        );
      }
    }

    // Skapar HTML elementen
    NYHUNDDIV.setAttribute("id", "hund" + i);
    NYHUNDBILD.setAttribute("src", "images/hund-ikon.jpg");
    NYHUNDBILD.style.width = "50px";
    NYHUNDBILD.style.height = "50px";
    NYHUNDP.innerHTML =
      NYHUND.namn +
      "<br>Box: " +
      NYHUND.box +
      "<br>Anvsarig hundskötare: " +
      NYHUND.vilkenSkotare.namn;
    TABORTHUNDKNAPP.innerHTML = "Ta bort";
    TABORTHUNDKNAPP.addEventListener("click", function () {
      taBortHund(i);
    });
    ANDRAHUNDSKOTAREKNAPP.innerHTML = "Ändra ansvarig hundskötare";
    ANDRAHUNDSKOTAREKNAPP.addEventListener("click", function () {
      andraAnsvarigHundskotare(i);
    });
    KONTROLLERAFODERKNAPP.innerHTML = "Kontrollera foder";
    KONTROLLERAFODERKNAPP.addEventListener("click", function () {
      hundarInne[i].kollaFoder();
    });
    NYHUNDDIV.appendChild(NYHUNDBILD);
    NYHUNDDIV.appendChild(NYHUNDP);
    NYHUNDDIV.appendChild(TABORTHUNDKNAPP);
    NYHUNDDIV.appendChild(ANDRAHUNDSKOTAREKNAPP);
    NYHUNDDIV.appendChild(KONTROLLERAFODERKNAPP);
    HUNDARINNEDIV.appendChild(NYHUNDDIV);
  }
}

/*
Skapar en ny hundskötare till systemet.

Tar in värdet som användaren har skrivit in i rutan för "lägg till hundskötare".
Kontrollerar om namnet redan är taget då detta skulle orsaka en konflikt i övriga programmet.
Går igenom arrayen med hundskötare för att hitta första tomma plats,
sedan skapas ett nytt objekt med hjälp av detta värde av klassen Hundskotare
och placerar denna i den tomma platsen i arrayen.
Detta objekt sparas även i localstorage med hjälp av stringify (endast attributen)
så att objekten kan återskapas nästa session.
Skapar även HTML elementen för detta objekt.
*/
function skapaHundskotare() {
  const NAMNET = NAMNSKOTAREINPUT.value;
  const NYSKOTAREDIV = document.createElement("div");
  const NYSKOTAREBILD = document.createElement("img");
  const NYSKOTAREP = document.createElement("p");
  const TABORTSKOTAREKNAPP = document.createElement("button");
  const PROMENADKNAPP = document.createElement("button");

  for (let i = 0; i < listaHundskotare.length + 1; i++) {
    if (listaHundskotare[i] === undefined) {
      continue;
    } else if (listaHundskotare[i].namn === NAMNET) {
      alert(
        "Det finns redan en hundskötare med detta namn, var vänlig skriv med denna användares efternamn för att undvika en konflikt i systemet"
      );
      return;
    }
  }

  for (let i = 0; i < listaHundskotare.length + 1; i++) {
    if (listaHundskotare[i] === undefined) {
      listaHundskotare[i] = new Hundskotare(NAMNET);
      let stringifiedSkotare = JSON.stringify(listaHundskotare[i]);
      window.localStorage.setItem("hundskotare" + i, stringifiedSkotare);
      NYSKOTAREDIV.setAttribute("id", "hundskotare" + i);
      NYSKOTAREBILD.setAttribute("src", "images/manniska-ikon.jpg");
      NYSKOTAREBILD.style.width = "50px";
      NYSKOTAREBILD.style.height = "50px";
      NYSKOTAREP.innerHTML = NAMNET;
      TABORTSKOTAREKNAPP.innerHTML = "Ta bort";
      TABORTSKOTAREKNAPP.addEventListener("click", function () {
        taBortHundSkotare(i);
      });
      PROMENADKNAPP.innerHTML = "Vilka hundar ska " + NAMNET + " ta ut?";
      PROMENADKNAPP.addEventListener("click", function () {
        gaPaPromenad(listaHundskotare[i]);
      });
      NYSKOTAREDIV.appendChild(NYSKOTAREBILD);
      NYSKOTAREDIV.appendChild(NYSKOTAREP);
      NYSKOTAREDIV.appendChild(TABORTSKOTAREKNAPP);
      NYSKOTAREDIV.appendChild(PROMENADKNAPP);
      HUNDSKOTAREDIV.appendChild(NYSKOTAREDIV);
      NAMNSKOTAREINPUT.value = "";
      break;
    }
  }
}

/*
Tar bort en hundskötare från systemet.

Kontrollerar först om hundskötaren är ansvarig för någon hund i systemet.
Är denna ansvarig för minst en hund så får användaren ett felmeddelande och funktionen avbryts.
När button elementet skapades så sattes hundskötarens nummer som inparameter till funktionen,
med denna så byts rätt index ut till "undefined" med hjälp av splice istället för att ta bort
element då indexen skiftas och resterande kod inte fungerar ordentligt annars.
Elementen måste behålla samma index.
Med detta index hittas även rätt objekt i localstorage och tas bort med removeItem.
Till sist så tas HTML elementen bort
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
*/
function taBortHundSkotare(hundskotarensNummer) {
  const HTMLELEMENTET = document.getElementById("hundskotare" + hundskotarensNummer);

  for (let i = 0; i < hundarInne.length; i++) {
    if (hundarInne[i] === undefined) {
      continue;
    } else if (hundarInne[i].vilkenSkotare === listaHundskotare[hundskotarensNummer]) {
      alert(
        "Denna hundskötare har ansvar för en eller fler hundar, kontrollera hundarnas skötare och byt ansvarig skötare på dessa, sedan kan du ta bort denna hundskötare"
      );
      return;
    }
  }
  listaHundskotare.splice(hundskotarensNummer, 1, undefined);
  window.localStorage.removeItem("hundskotare" + hundskotarensNummer);
  HTMLELEMENTET.remove();
}

/*
Skapar en ny hund till systemet.

Tar in värdet som användaren har skrivit in i rutan för "lägg till hund".
Jämför först värdet för Ansvarig hundskötare för att se om skötaren finns i systemet,
finns denna inte så visas en pop up ruta för användaren som ber denne att dubbelkolla värdet.
Finns hundskötaren i systemet så går programmet vidare och skapar ett nytt hund-objekt med
attributen för namn, box och ansvarig skötare.
Kontrollerar även box då dagiset bara har 10 platser.
Skapar även HTML element för objektet samt sparar hunden i localstorage för att kunna
återskapas i framtida sessioner.
*/
function skapaHund() {
  const NAMNET = NAMNHUNDINPUT.value;
  const BOXEN = BOXHUNDINPUT.value;
  const FODERTYP = TYPAVFODERINPUT.value;
  const FODERMANGD = MANGDFODERINPUT.value;
  const NYHUNDDIV = document.createElement("div");
  const NYHUNDBILD = document.createElement("img");
  const NYHUNDP = document.createElement("p");
  const TABORTHUNDKNAPP = document.createElement("button");
  const ANDRAHUNDSKOTAREKNAPP = document.createElement("button");
  const KONTROLLERAFODERKNAPP = document.createElement("button");
  let hittadeSkotare = false;

  for (let i = 0; i < listaHundskotare.length; i++) {
    if (listaHundskotare[i] === undefined) {
      continue;
    } else if (isNaN(BOXEN)) {
      alert("Värdet måste vara en siffra, var vänlig ange box igen");
      return;
    } else if (BOXEN < 1 || BOXEN > 10) {
      alert("Hunddagiset har bara 10 platser, var vänlig ange box 1-10");
      return;
    } else if (listaHundskotare[i].namn === ANSVARIGSKOTAREINPUT.value) {
      for (let j = 0; j < hundarInne.length + 1; j++) {
        if (hundarInne[j] === undefined) {
          // Skapar klassobjektet
          hundarInne[j] = new Hund(NAMNET, BOXEN, listaHundskotare[i], FODERTYP, FODERMANGD);
          // Skapar objekt i localstorage
          let stringifiedHund = JSON.stringify(hundarInne[j]);
          window.localStorage.setItem("hund" + j, stringifiedHund);
          // Skapar HTML elementen
          NYHUNDDIV.setAttribute("id", "hund" + j);
          NYHUNDBILD.setAttribute("src", "images/hund-ikon.jpg");
          NYHUNDBILD.style.width = "50px";
          NYHUNDBILD.style.height = "50px";
          NYHUNDP.innerHTML =
            NAMNET + "<br>Box: " + BOXEN + "<br>Anvsarig hundskötare: " + listaHundskotare[i].namn;
          TABORTHUNDKNAPP.innerHTML = "Ta bort";
          TABORTHUNDKNAPP.addEventListener("click", function () {
            taBortHund(j);
          });
          ANDRAHUNDSKOTAREKNAPP.innerHTML = "Ändra ansvarig hundskötare";
          ANDRAHUNDSKOTAREKNAPP.addEventListener("click", function () {
            andraAnsvarigHundskotare(j);
          });
          KONTROLLERAFODERKNAPP.innerHTML = "Kontrollera foder";
          KONTROLLERAFODERKNAPP.addEventListener("click", function () {
            hundarInne[j].kollaFoder();
          });
          NYHUNDDIV.appendChild(NYHUNDBILD);
          NYHUNDDIV.appendChild(NYHUNDP);
          NYHUNDDIV.appendChild(TABORTHUNDKNAPP);
          NYHUNDDIV.appendChild(ANDRAHUNDSKOTAREKNAPP);
          NYHUNDDIV.appendChild(KONTROLLERAFODERKNAPP);
          HUNDARINNEDIV.appendChild(NYHUNDDIV);
          NAMNHUNDINPUT.value = "";
          BOXHUNDINPUT.value = "";
          ANSVARIGSKOTAREINPUT.value = "";
          TYPAVFODERINPUT.value = "";
          MANGDFODERINPUT.value = "";

          hittadeSkotare = true;
          break;
        }
      }
    }
  }
  if (!hittadeSkotare) {
    alert(
      "Hittar ingen hundskötare med detta namn, kolla listan av hundskötare och var vänlig skriv ner en utav de tillgängliga hundskötarna"
    );
  }
}

/*
Tar bort en hund från systemet.

När button elementet skapades så sattes hundens nummer som inparameter till funktionen,
med denna så tas rätt index bort från arrayen med hundar med hjälp av splice,
byter ut elementet till "undefined" istället för att ta bort element då indexen skiftas och 
resterande kod inte fungerar ordentligt annars. Elementen måste behålla samma index.
Med detta index hittas även rätt objekt i localstorage och tas bort med removeItem.
Till sist så tas HTML elementen bort
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
*/
function taBortHund(hundensNummer) {
  const HTMLELEMENTET = document.getElementById("hund" + hundensNummer);
  hundarInne.splice(hundensNummer, 1, undefined);
  window.localStorage.removeItem("hund" + hundensNummer);
  HTMLELEMENTET.remove();
}

/*
Ändrar ansvarig hundskötare för existerande hund i systemet.

Begär ett nytt namn från användaren.
Kontrollerar först om hundskötaren finns i systemet,
skickar bara felmeddelande om hundskötaren inte finns.
Finns hundskötaren så ändras denna i hund objektet.
Ändrar även i HTML objektet för denna hund,
sparar även över det gamla objektet i localstorage.
*/
function andraAnsvarigHundskotare(hundensNummer) {
  const NYASKOTAREN = prompt("Vilken hundskötare vill du ändra till?");
  const HTMLELEMENTET = document
    .getElementById("hund" + hundensNummer)
    .getElementsByTagName("p")[0];
  let hittadeSkotare = false;

  for (let i = 0; i < listaHundskotare.length; i++) {
    if (listaHundskotare[i] === undefined) {
      continue;
    } else if (listaHundskotare[i].namn === NYASKOTAREN) {
      hundarInne[hundensNummer].vilkenSkotare = listaHundskotare[i];
      HTMLELEMENTET.innerHTML =
        hundarInne[hundensNummer].namn +
        "<br>Box: " +
        hundarInne[hundensNummer].box +
        "<br>Anvsarig hundskötare: " +
        hundarInne[hundensNummer].vilkenSkotare.namn;
      let stringifiedHund = JSON.stringify(hundarInne[hundensNummer]);
      window.localStorage.setItem("hund" + hundensNummer, stringifiedHund);
      hittadeSkotare = true;
      break;
    }
  }
  if (!hittadeSkotare) {
    alert(
      "Hittar ingen hundskötare med detta namn, kolla listan av hundskötare och var vänlig skriv ner en utav de tillgängliga hundskötarna"
    );
  }
}

/*
Byter namn på hunddagiset

Lägger till hunddagisets namn i localstorage (skriver över gamla värdet om namnet ska bytas ut).
Byter ut värdet i h1 elementet på webbplatsen.
Visar sedan de övriga blocken (dessa döljs om det inte finns en dagisnamn valt) och ändrar innehållet på "bytDagisnamnSektion" till att ändra dagisnamnet istället för att göra första valet.
Tömmer även input rutan.
*/
function bytDagisnamn() {
  const NYTTNAMN = NYTTDAGISNAMNINPUT.value;

  if (NYTTNAMN === "") {
    alert("Du måste ange ett namn på hunddagiset");
  } else {
    window.localStorage.setItem("hunddagiset", NYTTNAMN);
    HUNDDAGISNAMN.innerHTML = NYTTNAMN;
    HUNDSKOTARESEKTION.style.display = "block";
    HUNDARSEKTION.style.display = "block";
    BYTDAGISNAMNTITEL.innerHTML = "Byt dagisnamn:";
    BYTDAGISNAMNKNAPP.innerHTML = "Byt namnet";
    NYTTDAGISNAMNINPUT.value = "";
  }
}

/*
Kontrollerar vilka hundar som finns i vald box.

Skapar en array,
går sedan igenom alla hundar i listan av hundar och
jämför om värdet av vilken box som ska kollas matchar den box hund objektet har blivit tilldelad,
matchar dom så läggs hunden till i arrayen.
Till sist så skrivs alla hundar i arrayen ut till användaren.
*/
function kontrolleraBox(vilkenBox) {
  let listaMedHundar = [];

  if (isNaN(vilkenBox)) {
    alert("Värdet måste vara en siffra, var vänlig ange box igen");
  } else if (vilkenBox < 1 || vilkenBox > 10) {
    alert("Hunddagiset har bara 10 platser, var vänlig ange box 1-10");
  } else {
    for (let i = 0; i < hundarInne.length; i++) {
      if (vilkenBox === hundarInne[i].box) {
        listaMedHundar.push(hundarInne[i].namn);
      }
    }
    BOXOUTPUT.innerHTML = "Hundarna i box " + vilkenBox + " är: " + listaMedHundar.join(", ");
  }
}

/*
Funktion som berättar för användaren vilka hundar en vald hunskötare ska gå med
samt vilka boxar dessa hundar finns i.

Går igenom alla hundarna på dagiset,
matchar hundskötaren med den hundskötare som angivits för hunden så läggs det
till textsträngen som initieras i början av funktionen.
Har även en boolean flagga, om inga hundskötare matchas med hundar så har denna
inte ansvar för några hundar, då skrivs ett meddelande ut i slutet om detta.
Har användaren ansvar för minst en hund så skrivs det ihopsatta meddelandet sedan ut.
*/
function gaPaPromenad(hundSkotaren) {
  let meddelande = hundSkotaren.namn + " ska ta ut ";
  let harHundarUnderAnsvar = false;

  for (let i = 0; i < hundarInne.length; i++) {
    if (hundSkotaren === hundarInne[i].vilkenSkotare) {
      meddelande += hundarInne[i].namn + " (box " + hundarInne[i].box + "), ";
      harHundarUnderAnsvar = true;
    }
  }

  if (harHundarUnderAnsvar) {
    meddelande += "trevlig promenad!";
    alert(meddelande);
  } else {
    alert("Denna hundskötare har inte ansvar över några hundar.");
  }
}
