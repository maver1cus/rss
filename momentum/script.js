// DOM Elements
const time = document.querySelector('.time'),
      date = document.querySelector('.date'),
      greeting = document.querySelector('.greeting'),
      name = document.querySelector('.name'),
      focus = document.querySelector('.focus'),
      changeBtn = document.querySelector('.change-btn'),
      bodyElement = document.querySelector('body'),
      city = document.querySelector('.weather__city'),
      ONTHS  = ['Января', 'Февраля', 'Марта', 'Апреля', 'Май', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
      DAYS_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      IMAGES = {
        day: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'],
        evening: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'],
        morning: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'] ,
        night: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg']
      },
      images = [];

images.push(...IMAGES.night.sort(() => Math.random() - 0.5).slice(0, 6).map(el => `night/${el}`));
images.push(...IMAGES.morning.sort(() => Math.random() - 0.5).slice(0, 6).map(el => `morning/${el}`));
images.push(...IMAGES.day.sort(() => Math.random() - 0.5).slice(0, 6).map(el => `day/${el}`));
images.push(...IMAGES.evening.sort(() => Math.random() - 0.5).slice(0, 6).map(el => `evening/${el}`));

const currentTime = new Date();
let currentImage = Number(currentTime.getHours());

const PATH_TO_BACKROUNDS = 'assets/images/'

const getCurrentDate = () => {
  const currentDate = new Date(),
    day = currentDate.getDate() < 10 ? `0{currentDate.getDate()}` : currentDate.getDate(),
    month = MONTHS[currentDate.getMonth()],
    dayWeek = DAYS_WEEK[currentDate.getDay()];
  date.innerHTML = `${dayWeek}, ${day} ${month}`;

}

const getCurrentTime = () => {
  const currentTime = new Date(),
    hour = String(currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours()),
    min = String(currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes()),
    sec = String(currentTime.getSeconds() <10 ? `0${currentTime.getSeconds()}` : currentTime.getSeconds());
  if (hour === '00' && min === '00' && sec === '00' ) {
    getCurrentDate();
  }
  if (min === '00' && sec === '00') {
    currentImage = Number(hour);
    showBg();
    setBgGreet();
  }
  time.innerHTML = `<span>${hour}</span>:<span>${min}</span>:<span>${sec}</span>`;
  setTimeout(getCurrentTime, 1000);
}

const onBlur = evt => {
  evt.target.textContent = evt.target.dataset.text;
  evt.target.removeEventListener('click', onBlur);
}

const onKeypress = (evt) => {
  if (evt.code === 'Enter') {
    evt.preventDefault()
    if (evt.target.textContent.trim()) {
      evt.target.dataset.text = evt.target.textContent;
      localStorage.setItem(evt.target.dataset.type, evt.target.textContent);
      if (evt.target.dataset.type = 'city') {
        getWeather(evt.target.textContent);
      }
    } else {
      evt.target.textContent = evt.target.dataset.text;
    }
    evt.target.blur();
    evt.target.removeEventListener('keydown', onKeypress);
  }
}

const onClickInput = (evt) => {
  evt.target.dataset.text = evt.target.textContent;
  evt.target.textContent = '';
  evt.target.addEventListener('keydown', onKeypress);
  evt.target.addEventListener('blur', onBlur)
}

const showBg = () => {
  const src = `${PATH_TO_BACKROUNDS}${images[currentImage]}`;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {
    bodyElement.style.backgroundImage = `url(${src})`;
  };
  currentImage = (currentImage + 1 >= images.length - 1 ? 0 : currentImage + 1);
}

const setBgGreet = () => {
  const currentTime = new Date(),
        hour = currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours();

  if (hour < 6 ) {
    // night
    greeting.textContent = 'Доброй ночи, , ';

  } else if (hour < 12) {
    // day
    greeting.textContent = 'Доброе утро, ';
  } else if (hour < 18) {
    // day
    greeting.textContent = 'Добрый день, ';
    bodyElement.classList.add('light')
  } else {
    greeting.textContent = 'Добрый вечер, ';
    bodyElement.classList.add('light')
  }
}

const getQuote = () => {
  fetch('https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru')
    .then(res => res.json() )
    .then(data => {
      document.querySelector('blockquote p').textContent = data.quoteText;
      document.querySelector('blockquote cite').textContent = data.quoteAuthor;
    })
    .catch(() => {
      console.log(12)
    })
}

name.textContent = name.dataset.text = localStorage.getItem('name') ?? '[Введите Ваше имя]';
focus.textContent = focus.dataset.text = localStorage.getItem('focus') ?? '[Введите Ваше дело]';
city.textContent = city.dataset.text = localStorage.getItem('city') ?? '[Введите Ваш город]';


showBg();
setBgGreet();
getCurrentDate();
getCurrentTime();
getQuote();

changeBtn.addEventListener('click', showBg);

name.addEventListener('click', onClickInput);
focus.addEventListener('click', onClickInput);
city.addEventListener('click', onClickInput);








const btnChangeQuote = document.querySelector('.change-quote');

btnChangeQuote.addEventListener('click', getQuote);
const renderWeather = data => {
  const wrap = document.querySelector('.weather__wrap');
  if (data.code) {
    console.log(12);
    return false;
  }
  const html =
    `
    <div class="weather__image">
      <i class="weather-icon owf owf-5x owf-${data.weather[0].id}-d"></i>
      <div class="weather-description">${data.weather[0].description}</div>
    </div>
    <div class="weather__note">
      <div class="temperature">Температура: ${data.main.temp} </div>
      <div class="humidity">Влажность ${data.main.humidity} &#8451;</div>
      <div class="wind">Ветер <span class="weather__wind-direction" style="transform: rotate(${data.wind.deg}deg)"> &#8594; </span> ${data.wind.speed} м/с</div>
    </div>
`;

  wrap.innerHTML = html;
}
const getWeather = async city => {
  return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=0b137ef9c971f6f4714730ade5c3ef77&units=metric`)
    .then(res => res.json())
    .then(data => renderWeather(data))
    .catch((err) => {
      const wrap = document.querySelector('.weather__wrap');
      const html =
        `<p>Город ${city} не найден.</p>
         <p>Ввведите другой город.</p>`;
      wrap.innerHTML = html;
    })
}

if (localStorage.getItem('city')) {
  getWeather(localStorage.getItem('city'));
  city.textContent = localStorage.city
} else {
  city.textContent = 'Ввведите город';
}
