import { Section } from "../components/Section.js";
import { Card } from "../components/Card.js";
import { FormValidator } from "../components/FromValidator.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";
import { api } from "../components/api.js";
import { PopupWithConfirmation } from "../components/PopupWithConfirmation.js";
import { weatherApi } from "../components/weatherApi.js";
import { nasaApi } from "../components/nasaApi.js";
// inicio api NASA APOD

const nasaStatus = document.querySelector(".nasa__status");
const nasaLink = document.querySelector(".nasa__link");
const nasaImage = document.querySelector(".nasa__image");
const nasaCaption = document.querySelector(".nasa__caption");
const nasaExplanation = document.querySelector(".nasa__explanation");

function showNasaError(msg = "No se pudo cargar NASA APOD.") {
  if (!nasaStatus) return;
  nasaStatus.textContent = msg;
  nasaLink?.setAttribute("hidden", "");
  nasaCaption?.setAttribute("hidden", "");
  nasaExplanation?.setAttribute("hidden", "");
}

function renderApod(apod) {
  // apod: { title, url, hdurl, explanation, media_type, date }
  if (!nasaStatus || !nasaLink || !nasaCaption || !nasaExplanation) return;

  // Si es video (a veces APOD es YouTube), lo manejamos sin romper la UI
  if (apod.media_type !== "image") {
    nasaStatus.textContent = `Hoy NASA publicó un ${apod.media_type}. Abre el enlace:`;
    nasaLink.hidden = false;
    nasaLink.href = apod.url;
    nasaLink.textContent = "Ver APOD del día";
    nasaCaption.hidden = true;
    nasaExplanation.hidden = true;
    if (nasaImage) nasaImage.hidden = true;
    return;
  }

  nasaStatus.textContent = `Fecha: ${apod.date}`;
  nasaLink.hidden = false;
  nasaLink.href = apod.hdurl || apod.url;

  nasaImage.hidden = false;
  nasaImage.src = apod.url;
  nasaImage.alt = apod.title || "NASA APOD";

  nasaCaption.hidden = false;
  nasaCaption.textContent = apod.title || "NASA APOD";

  nasaExplanation.hidden = false;
  nasaExplanation.textContent = apod.explanation || "";
}

function loadApod() {
  if (nasaStatus) nasaStatus.textContent = "Cargando…";

  nasaApi
    .getApod()
    .then(renderApod)
    .catch((err) => {
      console.error(err);
      showNasaError("No se pudo cargar la imagen NASA (intenta más tarde).");
    });
}

// Llamar al iniciar
loadApod();
// fin api nasa
// inicio api weather
const weatherStatus = document.querySelector(".weather__status");

function renderWeatherText(data) {
  const c = data.current;
  return `🌡️ ${c.temperature_2m}°C  💧 ${c.relative_humidity_2m}%  💨 ${c.wind_speed_10m} km/h`;
}

// fallback (por si no dan permiso o falla)
const FALLBACK_CITY = { name: "Tepic", lat: 21.5085, lon: -104.8957 };

function loadWeatherByCoords({ lat, lon, label }) {
  if (!weatherStatus) return;

  weatherStatus.textContent = `Cargando clima${label ? " de " + label : ""}…`;

  return weatherApi
    .getCurrentWeather({ lat, lon })
    .then((data) => {
      weatherStatus.textContent = `${label ? label + ": " : ""}${renderWeatherText(data)}`;
    })
    .catch((err) => {
      console.error(err);
      weatherStatus.textContent = "No se pudo cargar el clima.";
    });
}

function loadWeatherWithGeolocation() {
  if (!weatherStatus) return;

  // si el navegador no soporta geolocalización
  if (!("geolocation" in navigator)) {
    return loadWeatherByCoords({ ...FALLBACK_CITY, label: FALLBACK_CITY.name });
  }

  weatherStatus.textContent = "Detectando tu ubicación para mostrar el clima…";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      loadWeatherByCoords({ lat, lon, label: "Tu ubicación" });
    },
    (err) => {
      console.warn("Geolocation error:", err);
      // si niegan permiso o hay error → fallback Tepic
      loadWeatherByCoords({ ...FALLBACK_CITY, label: FALLBACK_CITY.name });
    },
    {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 5 * 60 * 1000,
    },
  );
}

// Llama esta función una vez al iniciar la app:
loadWeatherWithGeolocation();

// fin api weather

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
