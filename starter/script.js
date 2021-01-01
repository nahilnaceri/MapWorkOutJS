'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  workouts = [];
  #map;
  #mapEv;
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._togglerElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function() {
          alert('Could not get coords');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(mapEvent) {
    this.#mapEv = mapEvent;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _togglerElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    e.preventDefault();
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value =
      '';

    const { lat, lng } = this.#mapEv.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'cycling-popup'
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}
let mapEv;
let map;
class Workout {
  constructor(coords, dist, duration) {
    this.coords = coords;
    this.dist = dist;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, dist, duration, cadence, pace) {
    super(coords, dist, duration);
    self.cadence = cadence;
    self.pace = pace;
  }
}

class Cycling extends Workout {
  constructor(coords, dist, duration, elevGain, speed) {
    super(coords, dist, duration);
    this.elevGain = elevGain;
    this.speed = speed;
  }
}

const app = new App();
