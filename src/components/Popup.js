export class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    this._popup.classList.remove("popup_hidden");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popup.classList.add("popup_hidden");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    const closeBtn =
      this._popup.querySelector(".popup__cerrar") ||
      this._popup.querySelector(".popup-editor-profile__close-button") ||
      this._popup.querySelector(".popup-add-card__close-button");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
    this._popup.addEventListener("mousedown", (evt) => {
      if (
        evt.target === this._popup ||
        evt.target.classList.contains("popup-editor-profile__overlay") ||
        evt.target.classList.contains("popup-add-card__overlay") ||
        evt.target.classList.contains("popup-confirm-delete__overlay")
      ) {
        this.close();
      }
    });
  }
}
