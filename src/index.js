import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  outputClear();
  if (e.target.value.trim() != '') {
    fetchCountries(e.target.value.trim())
      .then(renderHTML)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
      });
  }
}

function outputClear() {
  listEl.innerHTML = '';
  divEl.innerHTML = '';
}

function renderHTML(country) {
  if (country.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (country.length >= 2 && country.length < 11) {
    renderCountriesList(country);
  } else if (country.length === 1) {
    renderCountryCard(country);
  }
}

function renderCountriesList(countriesArr) {
  const searchData = countriesArr
    .map(({ flags, name }) => {
      return `<li>
        <img src="${flags.svg}" width="50px">
        <p>${name.official}</p>
        </li>`;
    })
    .join('');
  listEl.insertAdjacentHTML('beforeend', searchData);
}

function renderCountryCard(country) {
  const searchData = country
    .map(({ flags, name, capital, population, languages }) => {
      return `<div><img src="${flags.svg}" width="150px">
        <p class="main-text">${name.official}<p></div>
        <p class="text"><span class="main-text">Capital:  </span> ${capital}</p>
        <p class="text"><span class="main-text">Population:  </span> ${population/1000000} million people</p>
        <p class="text"><span class="main-text">Languages:  </span> ${Object.values(languages).join(', ')}</p>`;
    }).join('');
  divEl.insertAdjacentHTML('beforeend', searchData);
}