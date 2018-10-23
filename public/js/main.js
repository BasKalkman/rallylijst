// Deelnemers ophalen en uitsplitsen
fetch('/ophalen')
  .then(response => response.json())
  .then(data => {
    console.log('Data', data);
    // RIJDERS MANNEN
    var rijdersMan = data.filter(function(obj) {
      if (obj.driver === 'Rijder' && obj.gender === 'male') {
        return true;
      }
    });
    //RIJDERS VROUWEN
    var rijdersVrouw = data.filter(function(obj) {
      if (obj.driver === 'Rijder' && obj.gender === 'female') {
        return true;
      }
    });
    //BIJRIJDERS MANNEN
    var bijrijdersMan = data.filter(function(obj) {
      if (obj.driver === 'Bijrijder' && obj.gender === 'male') {
        return true;
      }
    });
    //BIJRIJDERS VROUWEN
    var bijrijdersVrouw = data.filter(function(obj) {
      if (obj.driver === 'Bijrijder' && obj.gender === 'female') {
        return true;
      }
    });
    console.log('Man rijder:', rijdersMan);
    console.log('Vrouw rijder:', rijdersVrouw);
    console.log('Man bijrijder:', bijrijdersMan);
    console.log('Vrouw bijrijder:', bijrijdersVrouw);
  })
  .catch(err => console.log(err));
