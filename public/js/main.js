fetch('/ophalen')
  .then(response => response.json())
  .then(data => {
    console.log('Data', data);
    var rijders = data.filter(isRijder);
    var bijrijders = data.filter(isBijrijder);
    var rijdersMan = rijders.filter(isMan);
    var rijdersVrouw = rijders.filter(isVrouw);
    var bijrijdersMan = bijrijders.filter(isMan);
    var bijrijdersVrouw = bijrijders.filter(isVrouw);
    console.log('Man rijder:', rijdersMan);
    console.log('Vrouw rijder:', rijdersVrouw);
    console.log('Man bijrijder:', bijrijdersMan);
    console.log('Vrouw bijrijder:', bijrijdersVrouw);
  })
  .catch(err => console.log(err));

function isRijder(obj) {
  if (obj.driver === 'Rijder') {
    return true;
  }
}

function isBijrijder(obj) {
  if (obj.driver === 'Bijrijder') {
    return true;
  }
}

function isMan(obj) {
  if (obj.gender === 'male') {
    return true;
  }
}

function isVrouw(obj) {
  if (obj.gender === 'female') {
    return true;
  }
}
