import { Section } from "../components/Section.js";
import { Card } from "../components/Card.js";
import { FormValidator } from "../components/FromValidator.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";
import { api } from "../components/api.js";
import { PopupWithConfirmation } from "../components/PopupWithConfirmation.js";

//============== UserInfo ============
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  degreeSelector: ".profile__degree",
  avatarSelector: ".profile__avatar",
});

// Guardaremos el id del usuario actual (para mejorar likes después)
let currentUserId = null;

api
  .getUser()
  .then((user) => {
    currentUserId = user._id;
    userInfo.setUserInfo(user);
  })
  .catch((err) => console.error("getUser error:", err));

// ========== Variables principales ==========
const page = document.querySelector(".page");
const buttonEdit = page.querySelector(".profile-button-edit");
const popupButtonAdd = page.querySelector(".profile-button-add");

// ========== Popup de imagen ==========
const popupImage = new PopupWithImage(".popup");
popupImage.setEventListeners();

// ========== Callbacks para Card (Like/Delete) ==========
const handleLike = (cardInstance) => {
  if (cardInstance.isLiked()) {
    return api.unlikeCard(cardInstance.getId());
  }
  return api.likeCard(cardInstance.getId());
};

const confirmDeletePopup = new PopupWithConfirmation(".popup-confirm-delete");
confirmDeletePopup.setEventListeners();

const handleDelete = (cardInstance) => {
  confirmDeletePopup.setSubmitAction(() => {
    api
      .deleteCard(cardInstance.getId())
      .then(() => {
        cardInstance.removeCard(); // lo agregamos abajo
        confirmDeletePopup.close();
      })
      .catch((err) => console.error("deleteCard error:", err));
  });

  confirmDeletePopup.open();
};

// ========== Editar perfil ==========
const popupEditProfile = new PopupWithForm(
  ".popup-editor-profile",
  (formData) => {
    popupEditProfile.renderLoading(true);
    api
      .updateUser({
        name: formData.name,
        about: formData.degree,
      })
      .then((user) => {
        userInfo.setUserInfo(user);
        popupEditProfile.close?.();
      })
      .catch((err) => console.error("updateUser error:", err))
      .finally(() => popupEditProfile.renderLoading(false));
  },
);

popupEditProfile.setEventListeners();

const formEditProfile = document.querySelector(".popup-editor-profile__form");
const inputNombre = formEditProfile.querySelector(
  '.popup-editor-profile__input[placeholder="name"]',
);
const inputGrado = formEditProfile.querySelector(
  '.popup-editor-profile__input[placeholder="Degree"]',
);

buttonEdit.addEventListener("click", () => {
  const { name, degree } = userInfo.getUserInfo();
  inputNombre.value = name;
  inputGrado.value = degree;
  popupEditProfile.open();
});

//edita avatar

const popupAvatar = new PopupWithForm(".popup-avatar", (formData) => {
  popupAvatar.renderLoading(true);
  api
    .updateAvatar(formData.avatar)
    .then((user) => {
      userInfo.setUserInfo(user);
      popupAvatar.close();
    })
    .catch((err) => console.error("updateAvatar error", err))
    .finally(() => popupAvatar.renderLoading(false));
});

popupAvatar.setEventListeners();

const avatarButton = document.querySelector(".profile__avatar-button");
avatarButton.addEventListener("click", () => {
  popupAvatar.open();
});

// ========== Galería de cards ==========
let cardSection;

api
  .getCards()
  .then((cards) => {
    cardSection = new Section(
      {
        items: cards,
        renderer: (item) => {
          const card = new Card(
            item,
            "#plantilla",
            popupImage.open.bind(popupImage),
            { handleLike, handleDelete },
          );

          const cardElement = card.generateCard();
          cardSection.addItem(cardElement);
        },
      },
      ".gallery",
    );

    cardSection.renderItems();
  })
  .catch((err) => console.error("getCards error:", err));

// ========== Agregar nueva card ==========
const formAddCard = document.querySelector(".popup-add-card__form");

const popupAddCardForm = new PopupWithForm(".popup-add-card", (formData) => {
  if (!cardSection) {
    console.error(
      "cardSection aún no está listo. Espera a que carguen las cards.",
    );
    return;
  }
  popupAddCardForm.renderLoading(true);
  api
    .addCard({ name: formData.titulo, link: formData.enlace })
    .then((res) => {
      const newCard = new Card(
        res,
        "#plantilla",
        popupImage.open.bind(popupImage),
        { handleLike, handleDelete },
      );

      cardSection.addItem(newCard.generateCard());
      popupAddCardForm.close?.();
      formAddCard.reset?.();
    })
    .catch((err) => console.error("addCard error:", err))
    .finally(() => popupAddCardForm.renderLoading(false));
});

popupAddCardForm.setEventListeners();

popupButtonAdd.addEventListener("click", () => {
  popupAddCardForm.open();
});

// ========== Validación de formularios ==========
const config = {
  inputSelector: "input",
  submitButtonSelector: 'button[type="submit"]',
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "popup-form__input_type_error",
  errorClass: "popup-form__input-error_active",
};

const validadorPerfil = new FormValidator(config, formEditProfile);
validadorPerfil.enableValidation();

const validadorCard = new FormValidator(config, formAddCard);
validadorCard.enableValidation();
