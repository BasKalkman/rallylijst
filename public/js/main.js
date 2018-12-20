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
