export class Card {
  constructor({ name, link }, templateSelector) {
    this.name = name;
    this.link = link;
    this.templateSelector = templateSelector;
  }
  //privados
  _handlerDelete = (evt) => {
    evt.target.closest(".card").remove();
  };

  _handlerFavorite = (evt) => {
    evt.target.classList.toggle("card__favorite-red");
  };

  _setEventListeners(cardElement) {
    cardElement
      .querySelector(".card__delete")
      .addEventListener("click", this._handlerDelete);

    cardElement
      .querySelector(".card__favorite")
      .addEventListener("click", this._handlerFavorite);
  }

  //publicos
  generateCard() {
    const cardElement = document
      .querySelector(this.templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    cardElement.querySelector(".card__image").src = this.link;
    cardElement.querySelector(".card__image").alt = this.name;
    cardElement.querySelector(".card__title").textContent = this.name;
    this._setEventListeners(cardElement);
    return cardElement;
  }
}
