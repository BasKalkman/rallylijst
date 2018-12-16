var rijdersMan = [];
var rijdersVrouw = [];
var bijrijdersVrouw = [];
var bijrijdersMan = [];

// INIT - Ronde naar 1 zetten, Array leeg maken
var ritIndeling = [];

// Data ophalen
fetch('/ophalen')
  .then(response => response.json()) // Data van bitstream naar json
  .then(data => {
    // Uitsplitsen mannen/vrouwen, rijders/bijrijders
    data.forEach(el => {
      if (el.gender === 'male' && el.driver === 'Rijder') {
        rijdersMan.push(el);
      }
      if (el.gender === 'male' && el.driver === 'Bijrijder') {
        bijrijdersMan.push(el);
      }
      if (el.gender === 'female' && el.driver === 'Rijder') {
        rijdersVrouw.push(el);
      }
      if (el.gender === 'female' && el.driver === 'Bijrijder') {
        bijrijdersVrouw.push(el);
      }
    });
  })
  .then(function() {
    // Overzicht naar HTML schrijven
    var liMan = document.createElement('li');
    var liVrouw = document.createElement('li');

    liMan.textContent = `Rijders man: ${rijdersMan.length} - Bijrijders vrouw: ${bijrijdersVrouw.length}`;
    liVrouw.textContent = `Rijders vrouw: ${rijdersVrouw.length} - Bijrijders man: ${bijrijdersMan.length}`;

    document.getElementById('indelingOverzicht').appendChild(liMan);
    document.getElementById('indelingOverzicht').appendChild(liVrouw);

    checkFouten();
  })
  .catch(err => console.log(err));

// AANTAL RITTEN
var ritten = 6;

// FOUTEN VOOR INDELING
function checkFouten() {
  let waarschuwing = document.getElementById('waarschuwing');
  waarschuwing.textContent = '';
  // Waarschuwing bij teveel rijders
  if (rijdersMan > bijrijdersVrouw || rijdersVrouw > bijrijdersMan) {
    waarschuwing.textContent += `\r\nLET OP! Meer rijders dan bijrijders! -- Pas aan via deelnemerslijst`;
  }

  // Waarchuwing bij te weinig rijders voor hoeveelheid ritten
  if (
    (rijdersMan.length < ritten && rijdersMan.length != 0) ||
    (rijdersVrouw.length < ritten && rijdersVrouw.length != 0)
  ) {
    waarschuwing.textContent += `\r\nLET OP! Te weinig rijders voor hoeveelheid ritten.`;
  }

  // Waarschuwing bij bijrijders zonder rijders
  if (
    (rijdersMan.length === 0 && bijrijdersVrouw.length > 0) ||
    (rijdersVrouw.length === 0 && bijrijdersMan.length > 0)
  ) {
    waarschuwing.textContent += `\r\nLET OP! Er zijn bijrijders, maar geen rijders`;
  }
}

// Indeling op score

// Score maken van alle rijders bij gegeven bijrijder
function checkScore(bijrijder) {
  let scoreArray = [];
  let ageValue = 2; // Waarde om van startscore af te trekken per jaar leeftijdsverschil
  let checkArray = bijrijder.gender === 'male' ? rijdersVrouw : rijdersMan; // Als man, rijdersVrouw checken, anders rijdersMan checken

  checkArray.forEach(function(rijder) {
    // Maak kwaliteitscore voor plaatsing
    let startValue = 100;
    let diff = Math.abs(bijrijder.age - rijder.age); // Bereken verschil, altijd positief getal
    startValue -= diff * ageValue; // Aftrekkenv van startValue
    scoreArray.push({ obj: rijder, score: startValue }); //Schrijf waarde naar Array
  });
  //Sorteer op hoogste waarde
  scoreArray.sort(function(a, b) {
    return b.score - a.score;
  });

  return scoreArray;
}

// Door array lopen en checken of ze al samen gereden hebben. Zo niet, plaatsen
// TODO Logica om over te slaan indien voor deze ronde gevuld
// TODO logica voor dubbelen als alle plaatsen vergeven zijn
// TODO Logica om aantal stoelen te checken
function plaatsZoeken(bijrijder) {
  let autoPaar = { rijder: '', bijrijder: [] };
  let scoreArray = checkScore(bijrijder);
  let geplaatst = false;
  let i = 0;
  while (geplaatst === false) {
    let rijder = scoreArray[i].obj;
    // Als bijrijder ID nog nooit aan rijder gekoppeld is
    if (rijder.partners.indexOf(bijrijder._id) === -1) {
      // EN checken of er niet al iemand anders is ingedeeld
      if (checkBeschikbaarheidRijder(ritIndeling, rijder._id)) {
        autoPaar.rijder = scoreArray[i].obj._id; // ID van rijder naar obj, dat weer naar array gaat
        autoPaar.bijrijder.push(bijrijder._id); // ID van bijrijder naar obj
        ritIndeling.push(autoPaar); // naar ritIndeling

        geplaatst = true; // einde loop, bijrijder geplaatst
      } else {
        i++;
      }
    } else {
      // Volgende checken
      // EN als i groter dan length rijders, toestaan +1 passagier
      i++;
    }
  }
}

// Check of rijder ID al bestaat, check of bijrijder al gekoppeld is
function checkBeschikbaarheidRijder(arr, idRijder) {
  arr.forEach(paar => {
    if (paar.rijder === idRijder) {
      return true;
    }
  });
}

// Functie paar naar ritIndeling schrijven

// Ronde naar database schrijven
