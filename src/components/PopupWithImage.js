import { Popup } from "./Popup.js";

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    //guarda referencias al img y a la leyenda
    this._image = this._popup.querySelector(".popup__imagen");
    this._caption = this._popup.querySelector(".popup__footer");
  }

  open({ src, alt }) {
    //Asigna el src y al alt a la imagen
    //console.log(src);
    this._image.src = src;
    this._image.alt = alt;
    this._caption.textContent = alt;
    //llama al metodo padre open para mostrar el popup
    super.open();
  }
}
