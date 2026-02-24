// utils.js

// Abrir popup de edición de perfil
export function quitaNoneEditor(popupEditorProfile) {
  popupEditorProfile.classList.remove("popup_hidden");
}

// Cerrar popup de edición de perfil
export function poneNoneEditor(popupEditorProfile) {
  popupEditorProfile.classList.add("popup_hidden");
}

// Abrir popup para agregar una tarjeta
export function quitaNoneAddCard(popupAddCard) {
  popupAddCard.classList.remove("popup_hidden");
}

// Cerrar popup para agregar una tarjeta
export function poneNoneAddCard(popupAddCard) {
  popupAddCard.classList.add("popup_hidden");
}

// Limpiar inputs y abrir formulario para agregar tarjeta
export function manipulaFormAddCard(popupAddCard) {
  quitaNoneAddCard(popupAddCard);
  const inputs = document.querySelectorAll(
    ".popup-add-card__form .popup-add-card__input"
  );
  if (inputs.length >= 2) {
    inputs[0].value = "";
    inputs[1].value = "";
  }
}

// Limpiar inputs y abrir formulario para editar perfil
export function manipulaFormEdit(profileId, popupEditorProfile) {
  quitaNoneEditor(popupEditorProfile);
  const nombre = profileId.querySelector(".profile__name").textContent;
  const grado = profileId.querySelector(".profile__degree").textContent;
  const inputs = document.querySelectorAll(
    ".popup-editor-profile__form .popup-editor-profile__input"
  );
  if (inputs.length >= 2) {
    inputs[0].value = nombre;
    inputs[1].value = grado;
  }
}
