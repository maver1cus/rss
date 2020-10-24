const page = document.querySelector(".cards__list");
const numPage = document.querySelector(".cards__count");
const btnPrev = document.querySelector('.cards__btn--prev');
const btnNext = document.querySelector('.cards__btn--next');
const btnFirst = document.querySelector('.cards__btn--first')
const btnLast = document.querySelector('.cards__btn--last')
const bodyElement = document.querySelector('body');

fetch("./js/pets.json")
  .then((res) => res.json())
  .then((pets) => {

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
      
    const createPopup = card => {
      const popupElement = document.createElement('div');
      popupElement.classList.add('popup');
      popupElement.insertAdjacentHTML('beforeend', getPopupTemplate(card));
      popupElement.addEventListener('click', closePopup);
      return popupElement;
    }
    
    const openPopup = evt => {
      console.log(fullPetsList);
      console.log(12);
      const namePet = evt.currentTarget.dataset.pet;
      const pet = fullPetsList.find(pet => pet.name === namePet);
      const outElement = document.querySelector('.out');
      outElement.insertAdjacentElement('beforeend', createPopup(pet) );
      bodyElement.classList.add('lock')
    
    }
    
    const closePopup = (evt) => {
      const target = evt.target;
      if (target.classList.contains('popup') || target.classList.contains('popup__close-btn') || target.classList.contains('popup__close-btn-svg')) {
        document.querySelector('.popup').remove();
        bodyElement.classList.remove('lock');
      }
    }
    
    const getCardTemplate = ({name, img}) => (
      `<div class="card">
        <div class="card__image">
          <img src="${img}" alt="${name}">
        </div>
        <div class="card__description">
          <div class="card__title">${name}</div>
          <buttton class="btn btn--secondary">Learn more</buttton>
        </div>
      </div>`
    );

    const getCard = card => {
      const fragment = document.createElement('li');
      fragment.classList.add('cards__item')
      fragment.dataset.pet = card.name;
      fragment.insertAdjacentHTML('beforeend', getCardTemplate(card));
      fragment.addEventListener('click', openPopup)
      return fragment;
    }
    
    
    const getStatePagination = (array) => {
      let countCardPage = 8;
      if (
        document.querySelector("body").offsetWidth >= 768 &&
        document.querySelector("body").offsetWidth < 1280
      ) {
        countCardPage = 6;
      } else if (document.querySelector("body").offsetWidth < 768) {
        countCardPage = 3;
      }
      return {
        countCardPage: countCardPage,
        countPages: array.length / countCardPage,
        currentPage: 0,
      };
    };
    
    const sort863 = (pets) => {
      let list = JSON.parse(JSON.stringify(pets));
      let unique8List = [];
      let length = list.length;
      for (let i = 0; i < length / 8; i++) {
        const uniqueStepList = [];
        for (j = 0; j < list.length; j++) {
          if (uniqueStepList.length >= 8) {
            break;
          }
          const isUnique = !uniqueStepList.some((item) => {
            return item.name === list[j].name;
          });
          if (isUnique) {
            uniqueStepList.push(list[j]);
            list.splice(j, 1);
            j--;
          }
        }
        unique8List = [...unique8List, ...uniqueStepList];
      }
      list = unique8List;
    
      list = sort6recursively(list);
    
      return list;
    };
    
    const sort6recursively = (list) => {
      const length = list.length;
    
      for (let i = 0; i < length / 6; i++) {
        const stepList = list.slice(i * 6, i * 6 + 6);
    
        for (let j = 0; j < 6; j++) {
          const duplicatedItem = stepList.find((item, ind) => {
            return item.name === stepList[j].name && ind !== j;
          });
    
          if (duplicatedItem !== undefined) {
            const ind = i * 6 + j;
            const which8OfList = Math.trunc(ind / 8);
    
            list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);
    
            sort6recursively(list);
          }
        }
      }
    
      return list;
    };
    
    const renderPage = (currentPage, fullPetsList, countCardPage) => {
      const start = currentPage * countCardPage;
      const end = currentPage * countCardPage + countCardPage;
    
      const petsCurentPage = fullPetsList.slice(start, end);
      page.innerHTML = ''
      html = "";
    
      petsCurentPage.forEach(card => page.insertAdjacentElement('beforeend', getCard(card)));
      numPage.innerText = currentPage + 1;
    };
    
    const blockBtn = (currentPage, countPages) => {
      if (currentPage === countPages - 1) {
        btnNext.setAttribute("disabled", true);
        btnLast.setAttribute("disabled", true);
      } else {
        btnNext.removeAttribute("disabled");
        btnLast.removeAttribute("disabled");
      }
    
      if (currentPage <= 0) {
        btnPrev.setAttribute("disabled", true);
        btnFirst.setAttribute("disabled", true);
      } else {
        btnPrev.removeAttribute("disabled", true);
        btnFirst.removeAttribute("disabled", true);
      }
    };

    let list = [];
    for (let i = 0; i < 6; i++) {
      list = [...list, ...pets.sort(() => Math.random() - 0.5)];
    }
    let fullPetsList = sort863(list);

    let { countCardPage, countPages, currentPage } = getStatePagination(
      fullPetsList
    );
    renderPage(currentPage, fullPetsList, countCardPage);
    blockBtn(currentPage, countPages);

    btnNext.addEventListener('click', () => {
      currentPage += 1;
      renderPage(currentPage, fullPetsList, countCardPage);
      blockBtn(currentPage, countPages);
    });
  
    btnPrev.addEventListener('click', () => {
      currentPage -= 1;
      renderPage(currentPage, fullPetsList, countCardPage);

      blockBtn(currentPage, countPages);
    });
  
    btnFirst.addEventListener('click', () => {
      currentPage = 0;
      renderPage(currentPage, fullPetsList, countCardPage);

      blockBtn(currentPage, countPages);
    })


    btnLast.addEventListener('click', () => {
      currentPage = countPages - 1;
      renderPage(currentPage, fullPetsList, countCardPage);

      blockBtn(currentPage, countPages);
    })
  });
