fetch('/ophalen')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
