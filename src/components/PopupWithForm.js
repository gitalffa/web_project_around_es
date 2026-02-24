import { Popup } from "./Popup.js";

export class PopupWithForm extends Popup {
  constructor(popupSelector, handlerFormSubmit) {
    super(popupSelector);
    this._handlerFormSubmit = handlerFormSubmit;

    this._form = this._popup.querySelector("form");
    this._inputList = Array.from(this._form.querySelectorAll("input"));

    this._submitButton = this._form.querySelector('button[type="submit"]');
    this._defaultButtonText = this._submitButton.textContent;
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }

  renderLoading(isLoading, loadingText = "Guardando...") {
    if (!this._submitButton) return;
    this._submitButton.textContent = isLoading
      ? loadingText
      : this._defaultButtonText;

    this._submitButton.disabled = isLoading;
  }

  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      // 👇 ahora solo llamamos al handler
      // y el cierre del popup lo decides en index.js (cuando termine el fetch)
      this._handlerFormSubmit(this._getInputValues());
    });
  }

  close() {
    super.close();
    this._form.reset();
    this.renderLoading(false); // ✅ por si se quedó en "Guardando..."
  }
}
