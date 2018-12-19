var rijdersMan = [];
var rijdersVrouw = [];
var bijrijdersVrouw = [];
var bijrijdersMan = [];
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
function plaatsen(bijrijder) {
  let scoreArray = checkScore(bijrijder);
  let geplaatst = false;
  let i = 0;
  let maxPax = 1;

  // While geplaatst false
  while (geplaatst === false) {
    // Zet obj van rijder uit scoreArray in temp var
    let rijder = scoreArray[i].obj;
    // als bijrijder id niet in rijder.partners staat
    if (rijder.partners.indexOf(bijrijder._id) === -1) {
      // -- -- Check of rijder al aanwezig in ritIndeling
      let index = ritIndeling.findIndex(item => item.rijder === rijder);
      if (index === -1) {
        // -- -- -- Zo nee: Aanmaken en plaatsen
        let obj = {
          rijder: rijder,
          bijrijder: []
        };
        obj.bijrijder.push(bijrijder);
        ritIndeling.push(obj);
        geplaatst = true;
      } else {
        // -- -- -- Anders: Check of passagiers minder dan maxPax is && genoeg ruimte in de auto
        if (ritIndeling[index].bijrijder.length < maxPax && ritIndeling[index].bijrijder.length < rijder.seats - 1) {
          // -- -- -- -- Zo ja: Plaatsen
          ritIndeling[index].bijrijder.push(bijrijder);
          geplaatst = true;
        }
      }
    }
    // Als niets getriggerd heeft. Volgende bekijken
    i++;
    // als i groter dan length rijders, toestaan +1 passagier
    if (i >= scoreArray.length) {
      maxPax++;
      i = 0;
      if (maxPax === 7) {
        alert(`Kon ${bijrijder.name} niet plaatsen. MaxPax = ${maxPax} - i: ${i}`);
        break;
      }
    }
  }
}

function maakRonde() {
  rijdersMan = [];
  rijdersVrouw = [];
  bijrijdersVrouw = [];
  bijrijdersMan = [];
  ritIndeling = [];
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
    .then(data => {
      bijrijdersMan.forEach(bijrijder => plaatsen(bijrijder));
      bijrijdersVrouw.forEach(bijrijder => plaatsen(bijrijder));

      verstuur();
    })
    .catch(err => console.log(err));
}

// Ronde naar database schrijven
function verstuur() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/verwerkIndeling', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  let verstuurIndeling = JSON.stringify(ritIndeling);
  xhr.send(verstuurIndeling);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var str = xhr.response;
      toonIndeling(str);
    }
  };
}

// Toon indeling op pagina
function toonIndeling(str) {
  let table = document.getElementById('indelingTable');
  // Empty table
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  let data = JSON.parse(str);
  console.log(data);

  // Recreate Header
  var thead = document.createElement('thead');
  thead.classList = 'thead-dark';
  var thrijder = document.createElement('th');
  thrijder.textContent = 'Rijder';
  var thbijrijder = document.createElement('th');
  thbijrijder.textContent = 'Bijrijder(s)';
  thead.appendChild(thrijder);
  thead.appendChild(thbijrijder);
  table.appendChild(thead);

  // Fill table
  data.forEach(auto => {
    // Maak rij
    let row = document.createElement('tr');
    // Maak rijder
    let rijder = document.createElement('td');
    rijder.textContent = auto.rijder.name;
    row.append(rijder);
    // Maak bijrijder(s)
    let bijrijder = document.createElement('td');
    let ul = document.createElement('ul');
    auto.bijrijder.forEach(bijrijder => {
      let li = document.createElement('li');
      li.textContent = bijrijder.name;
      ul.append(li);
    });
    bijrijder.append(ul);
    row.append(bijrijder);
    table.append(row);
  });
}
