/* export const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg",
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg",
  },
]; */

export class Card {
  constructor(
    { name, link, _id, isLiked, likes = [] },
    templateSelector,
    handleCardClick,
    { handleLike, handleDelete } = {},
  ) {
    this._name = name;
    this._link = link;
    this._id = _id;

    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;

    this._handleLike = handleLike;
    this._handleDelete = handleDelete;

    this._isLiked = Boolean(isLiked);
    this._likes = likes; // ✅ antes no lo estabas guardando
  }

  // públicos “pequeños” para callbacks
  getId() {
    return this._id;
  }

  isLiked() {
    return this._isLiked;
  }

  removeCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  // privados
  _handlerDelete = () => {
    // Si hay callback (server), borra en server y luego en DOM
    if (this._handleDelete) {
      this._handleDelete(this);
      return;
    }

    // fallback local
    this._cardElement.remove();
  };

  _handlerFavorite = () => {
    // Con server
    if (this._handleLike) {
      this._handleLike(this)
        .then((updatedCard) => {
          this._setLikes(updatedCard.likes);
        })
        .catch((err) => console.error("like error:", err));
      return;
    }

    // fallback local
    this._isLiked = !this._isLiked;
    this._renderLikeState();
  };

  _setLikes(likes) {
    this._likes = likes;

    // ✅ Por ahora togglamos (funciona), después lo haremos “perfecto” con currentUserId
    this._isLiked = !this._isLiked;

    this._renderLikeState();

    if (this._likeCounter) {
      this._likeCounter.textContent = likes.length;
    }
  }

  _renderLikeState() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__favorite-red");
    } else {
      this._likeButton.classList.remove("card__favorite-red");
    }
  }

  _setEventListeners() {
    this._deleteButton.addEventListener("click", this._handlerDelete);
    this._likeButton.addEventListener("click", this._handlerFavorite);

    this._image.addEventListener("click", () => {
      this._handleCardClick({ src: this._link, alt: this._name });
    });
  }

  generateCard() {
    this._cardElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._image = this._cardElement.querySelector(".card__image");
    this._deleteButton = this._cardElement.querySelector(".card__delete");
    this._likeButton = this._cardElement.querySelector(".card__favorite");
    this._likeCounter = this._cardElement.querySelector(
      ".card__favorite-count",
    );

    this._image.src = this._link;
    this._image.alt = this._name;
    this._cardElement.querySelector(".card__title").textContent = this._name;

    // Estado inicial
    this._renderLikeState();
    if (this._likeCounter) this._likeCounter.textContent = this._likes.length;

    this._setEventListeners();
    return this._cardElement;
  }
}
