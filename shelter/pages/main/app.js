const PETS = [
  {
    "name": "Jennifer",
    "img": "../../assets/images/pets-jennifer.jpg",
    "type": "Dog",
    "breed": "Labrador",
    "description": "Jennifer is a sweet 2 months old Labrador that is patiently waiting to find a new forever home. This girl really enjoys being able to go outside to run and play, but won't hesitate to play up a storm in the house if she has all of her favorite toys.",
    "age": "2 months",
    "inoculations": ["none"],
    "diseases": ["none"],
    "parasites": ["none"]
  },
  {
    "name": "Sophia",
    "img": "../../assets/images/pets-sophia.jpg",
    "type": "Dog",
    "breed": "Shih tzu",
    "description": "Sophia here and I'm looking for my forever home to live out the best years of my life. I am full of energy. Everyday I'm learning new things, like how to walk on a leash, go potty outside, bark and play with toys and I still need some practice.",
    "age": "1 month",
    "inoculations": ["parvovirus"],
    "diseases": ["none"],
    "parasites": ["none"]
  },
  {
    "name": "Woody",
    "img": "../../assets/images/pets-woody.jpg",
    "type": "Dog",
    "breed": "Golden Retriever",
    "description": "Woody is a handsome 3 1/2 year old boy. Woody does know basic commands and is a smart pup. Since he is on the stronger side, he will learn a lot from your training. Woody will be happier when he finds a new family that can spend a lot of time with him.",
    "age": "3 years 6 months",
    "inoculations": ["adenovirus", "distemper"],
    "diseases": ["right back leg mobility reduced"],
    "parasites": ["none"]
  },
  {
    "name": "Scarlett",
    "img": "../../assets/images/pets-scarlett.jpg",
    "type": "Dog",
    "breed": "Jack Russell Terrier",
    "description": "Scarlett is a happy, playful girl who will make you laugh and smile. She forms a bond quickly and will make a loyal companion and a wonderful family dog or a good companion for a single individual too since she likes to hang out and be with her human.",
    "age": "3 months",
    "inoculations": ["parainfluenza"],
    "diseases": ["none"],
    "parasites": ["none"]
  },
  {
    "name": "Katrine",
    "img": "../../assets/images/pets-katrine.jpg",
    "type": "Cat",
    "breed": "British Shorthair",
    "description": "Katrine is a beautiful girl. She is as soft as the finest velvet with a thick lush fur. Will love you until the last breath she takes as long as you are the one. She is picky about her affection. She loves cuddles and to stretch into your hands for a deeper relaxations.",
    "age": "6 months",
    "inoculations": ["panleukopenia"],
    "diseases": ["none"],
    "parasites": ["none"]
  },
  {
    "name": "Timmy",
    "img": "../../assets/images/pets-timmy.jpg",
    "type": "Cat",
    "breed": "British Shorthair",
    "description": "Timmy is an adorable grey british shorthair male. He loves to play and snuggle. He is neutered and up to date on age appropriate vaccinations. He can be chatty and enjoys being held. Timmy has a lot to say and wants a person to share his thoughts with.",
    "age": "2 years 3 months",
    "inoculations": ["calicivirus", "viral rhinotracheitis"],
    "diseases": ["kidney stones"],
    "parasites": ["none"]
  },
  {
    "name": "Freddie",
    "img": "../../assets/images/pets-freddie.jpg",
    "type": "Cat",
    "breed": "British Shorthair",
    "description": "Freddie is a little shy at first, but very sweet when he warms up. He likes playing with shoe strings and bottle caps. He is quick to learn the rhythms of his human’s daily life. Freddie has bounced around a lot in his life, and is looking to find his forever home.",
    "age": "2 months",
    "inoculations": ["rabies"],
    "diseases": ["none"],
    "parasites": ["none"]
  },
  {
    "name": "Charly",
    "img": "../../assets/images/pets-charly.jpg",
    "type": "Dog",
    "breed": "Jack Russell Terrier",
    "description": "This cute boy, Charly, is three years old and he likes adults and kids. He isn’t fond of many other dogs, so he might do best in a single dog home. Charly has lots of energy, and loves to run and play. We think a fenced yard would make him very happy.",
    "age": "8 years",
    "inoculations": ["bordetella bronchiseptica", "leptospirosis"],
    "diseases": ["deafness", "blindness"],
    "parasites": ["lice", "fleas"]
  }
];
const bodyElement = document.querySelector('body');
const sliderWrapper = document.querySelector('.slider__wrapper');
let isEnabled = true;

const getCountCardsInSliderItem = () => {
  const widthScreen = document.documentElement.clientWidth;
  let countCardsInSliderItem = 3;
  if (widthScreen < 767) {
    countCardsInSliderItem = 1;
  } else if ( widthScreen < 1279 ) {
    countCardsInSliderItem = 2;
  }
  return countCardsInSliderItem;
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const getPopupTemplate = ({name, img, breed, description, age, inoculations, diseases, parasites}) => (
  `<div class="popup__content">
    <div class="popup__image">
      <img src="${img}" alt="${name}">
    </div>
    <div class="popup__note">
      <div class="popup__name">${name}</div>
      <div class="popup__breed">${breed}</div>
      <p class="popup__description">${description}</p>
      <ul class="popup__feature">
        <li class="popup__feature-item"><b>Age:</b> ${age}</li>
        <li class="popup__feature-item"><b>Inoculations:</b> ${inoculations.join(' ')}</li>
        <li class="popup__feature-item"><b>Diseases:</b> ${diseases.join(' ')}</li>
        <li class="popup__feature-item"><b>Parasites:</b> ${parasites.join(' ')}</li>
      </ul>
      <button class="btn btn--secondary popup__close-btn">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="popup__close-btn-svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z" fill="#292929"/>
        </svg>
      </button>
    </div>
  </div>`
  );
const closePopup = (evt) => {
  const target = evt.target;
  if (target.classList.contains('popup') || target.classList.contains('popup__close-btn') || target.classList.contains('popup__close-btn-svg')) {
    document.querySelector('.popup').remove();
    bodyElement.classList.remove('lock');
  }
}

const createPopup = card => {
  const popupElement = document.createElement('div');
  popupElement.classList.add('popup');
  popupElement.insertAdjacentHTML('beforeend', getPopupTemplate(card));
  popupElement.addEventListener('click', closePopup);
  return popupElement;
}

const openPopup = evt => {
  const namePet = evt.currentTarget.dataset.pet;
  const pet = PETS.find(pet => pet.name === namePet);
  const outElement = document.querySelector('.out');
  outElement.insertAdjacentElement('beforeend', createPopup(pet) );
  bodyElement.classList.add('lock')

}

const getCardTemplate = ({name, img}) => (
  `<div class="card__image">
    <img src="${img}" alt="${name}">
  </div>
  <div class="card__description">
    <div class="card__title">${name}</div>
    <buttton class="slider__btn btn btn--secondary">Learn more</buttton>
  </div>`);

const getCard = card => {
  const fragment = document.createElement('div');
  fragment.classList.add('card')
  fragment.dataset.pet = card.name;
  fragment.insertAdjacentHTML('beforeend', getCardTemplate(card));
  fragment.addEventListener('click', openPopup)
  return fragment;
}

const createSliderItem = (classItem) => {
  const sliderItem = document.createElement('div');
  const countCards = getCountCardsInSliderItem();
  sliderItem.classList.add('slider__item')
  sliderItem.classList.add(classItem);
  const cards = new Set();

  while(cards.size < countCards) {
    cards.add(PETS[getRandomInt(0, PETS.length)]);
  }
  cards.forEach(card => sliderItem.insertAdjacentElement('beforeend', getCard(card)));
  return sliderItem;
}

const hideItem = direction => {
  isEnabled = false;
  const hideSliderItem = document.querySelector('.slider__item--active');
  hideSliderItem.classList.add(direction);
  hideSliderItem.addEventListener('animationend', function() {
    this.remove();
  });
}

const showItem = direction => {
  const nextSliderItem = document.querySelector('.slider__item--next')
  nextSliderItem.classList.add(direction);
  nextSliderItem.addEventListener('animationend', function() {
    this.classList.remove('slider__item--next', direction);
    this.classList.add('slider__item--active');
    isEnabled = true;
  });
}

const nextItem = () => {
  hideItem('to-left');
  showItem('from-right');
}

const previousItem = () => {
  hideItem('to-right');
  showItem('from-left');
}

document.querySelector('.slider__nav-btn--prev').addEventListener('click', function() {
  if (isEnabled) {
    sliderWrapper.insertAdjacentElement('afterbegin', createSliderItem('slider__item--next'));
    previousItem();
  }
});

document.querySelector('.slider__nav-btn--next').addEventListener('click', function() {
  if (isEnabled) {
    sliderWrapper.insertAdjacentElement('beforeend', createSliderItem('slider__item--next'));
    nextItem();
  }
});

sliderWrapper.innerHTML = '';
sliderWrapper.insertAdjacentElement('beforeend', createSliderItem('slider__item--active'));

// const ITEMS_PAGE = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5', 'item 6', 'item 7', 'item 8'];
//
// const countCardInPage = 3;
// const countPage = 16;
// let ALL = [];
// const pages = [];
// for (let i = 0; i < 6; i++) {
//   ALL.push(...ITEMS_PAGE);
// }
// console.log(ALL);
//
// const createPage = () => {
//   const page = new Set();
//   while(page.size < countCardInPage) {
//     const index = getRandomInt(0, ALL.length);
//     page.add(ALL.splice(index, 1).join(''));
//   }
//   return page;
// }
//
// for (let i = 0; i < 16; i++) {
//   pages.push(createPage());
// }
//
// console.log(pages);
