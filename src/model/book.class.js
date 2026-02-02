export default class Book {
  constructor({
    id,
    userId,
    moduleCode,
    publisher,
    price,
    pages,
    status,
    photo = "",
    comments = "",
    soldDate = ""
  }) {
    this.id = id;
    this.userId = userId;
    this.moduleCode = moduleCode;
    this.publisher = publisher;
    this.price = price;
    this.pages = pages;
    this.status = status;
    this.photo = photo;
    this.comments = comments;
    this.soldDate = soldDate;
  }

  toString() {
    return `${this.id}: ${this.moduleCode} - ${this.publisher} (${this.price}€) ${this.status}`;
  }

  get forSale() {
    return this.soldDate === "";
  }
}

export class User {
  constructor(id, nick, email, password) {
    this.id = id;
    this.nick = nick;
    this.email = email;
    this.password = password;
  }

  toString() {
    return `${this.id}: ${this.nick} (${this.email})`;
  }
}

export class Module {
  constructor(code, cliteral, vliteral, courseId) {
    this.code = code;
    this.cliteral = cliteral;
    this.vliteral = vliteral;
    this.courseId = courseId;
  }

  toString() {
    return `${this.code} - ${this.cliteral} (${this.vliteral})`;
  }
}