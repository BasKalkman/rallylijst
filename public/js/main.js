var rijdersMan = [];
var rijdersVrouw = [];
var bijrijdersVrouw = [];
var bijrijdersMan = [];

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

    console.log('rijders man: ', rijdersMan);
    console.log('rijders vrouw: ', rijdersVrouw);
    console.log('bijrijders man: ', bijrijdersMan);
    console.log('bijrijders vrouw: ', bijrijdersVrouw);
  })
  .catch(err => console.log(err));

// RITTEN
var ritten = 6;

// GROEPEN maken
function maakGroep(arr) {
  let groepen = Math.floor(arr.length / ritten);
  let extra = arr.length % ritten;
  let splitsPer = ritten + Math.floor(extra / groepen);
  let returnArray = [];
  let tempArray = [];

  for (i = 1; i <= arr.length; i++) {
    tempArray.push(arr[i]);

    if (i % splitsPer === 0) {
      returnArray.push(tempArray);
      tempArray = [];
    }
    if (i === arr.length) {
      returnArray.push(tempArray);
      return returnArray;
    }
  }
}

function test() {
  var groepManRijders = maakGroep(rijdersMan);
  var groepVrouwRijders = maakGroep(rijdersVrouw);
  var groepManBijRijders = maakGroep(bijrijdersMan);
  var groepVrouwBijRijders = maakGroep(bijrijdersVrouw);

  console.log('Groep rijdersMan: ', groepManRijders);
  console.log('Groep rijdersVrouw: ', groepVrouwRijders);
  console.log('Groep bijrijders Man: ', groepManBijRijders);
  console.log('Groep bijrijders Vrouw: ', groepVrouwBijRijders);
}
