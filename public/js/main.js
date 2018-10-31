var rijdersMan = [];
var rijdersVrouw = [];
var bijrijdersVrouw = [];
var bijrijdersMan = [];

// INIT - Ronde naar 1 zetten, Array leeg maken

fetch('/ophalen')
  .then(response => response.json())
  .then(data => {
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
  let ageValue = 1;
  let checkArray = bijrijder.gender === 'male' ? rijdersVrouw : rijdersMan;

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
function plaatsen(bijrijder) {
  let scoreArray = checkScore(bijrijder);
  let geplaatst = false;
  let i = 0;
  while (geplaatst === false) {
    if (scoreArray[i].obj.partners.indexOf(bijrijder._id) === -1) {
      // EN checken of max 1 passagier
      //Plaatsen als id niet in partners van rijder staat.
      geplaatst = true;
    } else {
      // Volgende checken
      // EN als i groter dan length rijders, toestaan +1 passagier
      // Als reeds gedubbeld, score aanpassen?
      i++;
    }
  }
}

// Ronde naar database schrijven
