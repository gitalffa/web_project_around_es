export class UserInfo {
  constructor({ nameSelector, degreeSelector, avatarSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._degreeElement = document.querySelector(degreeSelector);
    this._avatarElement = document.querySelector(avatarSelector);
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      degree: this._degreeElement.textContent,
    };
  }

  setUserInfo({ name, about, avatar }) {
    if (name) this._nameElement.textContent = name;
    if (about) this._degreeElement.textContent = about;
    if (avatar && this._avatarElement) this._avatarElement.src = avatar;
  }
}
