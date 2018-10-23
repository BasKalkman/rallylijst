var alles = document.getElementById('alles');
var mannen = document.getElementById('mannen');
var vrouwen = document.getElementById('vrouwen');
var rijders = document.getElementById('rijders');
var bijrijders = document.getElementById('bijrijders');

function toonAlles() {
  document.querySelectorAll('.gender').forEach(function(el) {
    el.parentNode.style.display = '';
  });
}

function toonMannen() {
  var tabelMannen = document.querySelectorAll('.gender');
  tabelMannen.forEach(function(el) {
    if (el.textContent != 'male') {
      el.parentNode.style.display = 'none';
    }
  });
}

function toonVrouwen() {
  var tabelMannen = document.querySelectorAll('.gender');
  tabelMannen.forEach(function(el) {
    if (el.textContent != 'female') {
      el.parentNode.style.display = 'none';
    }
  });
}

function toonRijders() {
  var tabelMannen = document.querySelectorAll('.driver');
  tabelMannen.forEach(function(el) {
    if (el.textContent != 'Rijder') {
      el.parentNode.style.display = 'none';
    }
  });
}

function toonBijrijders() {
  var tabelMannen = document.querySelectorAll('.driver');
  tabelMannen.forEach(function(el) {
    if (el.textContent != 'Bijrijder') {
      el.parentNode.style.display = 'none';
    }
  });
}

// lISTENERS
alles.addEventListener('click', toonAlles);
mannen.addEventListener('click', toonMannen);
vrouwen.addEventListener('click', toonVrouwen);
rijders.addEventListener('click', toonRijders);
bijrijders.addEventListener('click', toonBijrijders);
