// class Carousel {
//   /**@type {HTMLElement} */
//   #element;
//   /**@type {HTMLElement} */
//   #root;
//   /**@type {object} */
//   #options;
//   /**@type {NodeList[]} */
//   #items;
//   /**@type {HTMLElement} */
//   #container;
//   /**@type {Number} */
//   #currentItem;
//   /**@type {CallableFunction[]} */
//   #moveCallbacks;
//   /**
//    *
//    * @param {HTMLElement} element
//    * @param {object} options
//    */
//   constructor(element, options = {}) {
//     this.#element = element;
//     this.#options = {
//       slideToScroll: 1,
//       slideVisible: 1,
//       loop: true,
//       ...options,
//     };
//     const children = [...element.children];
//     this.#currentItem = 0;
//     this.#root = this.#createElementWithClass("carousel");
//     this.#container = this.#createElementWithClass("carousel__container");
//     this.#root.appendChild(this.#container);
//     this.#element.appendChild(this.#root);
//     this.#moveCallbacks = [];
//     this.#items = children.map((child) => {
//       const item = this.#createElementWithClass("carousel__item");
//       item.appendChild(child);
//       this.#container.appendChild(item);
//       return item;
//     });
//     this.#setStyle();
//     this.#createNavigation();
//     this.#moveCallbacks.forEach((cb) => cb(0));
//   }

//   /**
//    * Applique les bonnes dimensions aux éléments du carousel
//    */
//   #setStyle() {
//     const ratio = this.#items.length / this.#options.slideVisible;
//     this.#container.style.width = ratio * 100 + "%";
//     this.#items.forEach(
//       (item) =>
//         (item.style.width = 100 / this.#options.slideVisible / ratio + "%")
//     );
//   }

//   #createNavigation() {
//     const nextButton = this.#createElementWithClass("carousel__next");
//     const prevButton = this.#createElementWithClass("carousel__prev");
//     this.#root.appendChild(nextButton);
//     this.#root.appendChild(prevButton);
//     nextButton.addEventListener("click", this.#next.bind(this));
//     prevButton.addEventListener("click", this.#prev.bind(this));
//     if (this.#options.loop === true) return;
//     this.#onMove((index) => {
//       if (index === 0) {
//         prevButton.classList.add("carousel__prev--hidden");
//       } else {
//         prevButton.classList.remove("carousel__prev--hidden");
//       }
//       if (
//         this.#items[this.#currentItem + this.#options.slideVisible] ===
//         undefined
//       ) {
//         nextButton.classList.add("carousel__next--hidden");
//       } else {
//         nextButton.classList.remove("carousel__next--hidden");
//       }
//     });
//   }

//   #next() {
//     this.#gotToItem(this.#currentItem + this.#options.slideToScroll);
//   }

//   #prev() {
//     this.#gotToItem(this.#currentItem - this.#options.slideToScroll);
//   }

//   /**
//    * Deplace le carousel vers l'élément ciblé
//    * @param {number} index
//    */
//   #gotToItem(index) {
//     if (index < 0) {
//       index = this.#items.length - this.#options.slideVisible;
//     } else if (
//       index >= this.#items.length ||
//       this.#items[this.#currentItem + this.#options.slideVisible] === undefined
//     ) {
//       index = 0;
//     }
//     const translateX = (index * -100) / this.#items.length;
//     this.#container.style.transform = `translate3d(${translateX}%, 0, 0)`;
//     this.#currentItem = index;
//     this.#moveCallbacks.forEach((cb) => cb(index));
//   }

//   /**
//    *
//    * @param {CallableFunction} cb
//    */
//   #onMove(cb) {
//     this.#moveCallbacks.push(cb);
//   }

//   /**
//    *
//    * @param {string} className
//    * @returns {HTMLElement}
//    */
//   #createElementWithClass(className) {
//     const div = document.createElement("div");
//     div.setAttribute("class", className);
//     return div;
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   new Carousel(document.querySelector("#carousel1"), {
//     slideToScroll: 3,
//     slideVisible: 3,
//     loop: false,
//   });
//   new Carousel(document.querySelector("#carousel2"), {
//     slideToScroll: 2,
//     slideVisible: 2,
//   });
//   new Carousel(document.querySelector("#carousel3"), {
//     loop: false,
//   });
// });

class Carousel {
  /** @type {HTMLElement} */
  #element;
  /** @type {object} */
  #options;
  /** @type {HTMLDivElement} */
  #root;
  /** @type {HTMLDivElement} */
  #container;
  /** @type {NodeList[]} */
  #items;
  /** @type {number} */
  #currentIndex;
  /** @type {CallableFunction} */
  #moveCallback = [];
  /** @type {boolean} */
  #isMobile = false;

  /**
   *
   * @param {HTMLElement} element
   * @param {{slideScrool: number, slideVisible: number}} options
   */
  constructor(element, options = {}) {
    this.#element = element;
    this.#options = { slideVisible: 1, slideScrool: 1, loop: true, ...options };
    const children = [...element.children];
    this.#isMobile = false;
    this.#currentIndex = 0;
    this.#moveCallback = [];

    // Modification du Dom
    this.#root = this.#createElementWithClass("carousel");
    this.#root.setAttribute("tabindex", 0);
    this.#container = this.#createElementWithClass("carousel__container");
    this.#root.appendChild(this.#container);
    this.#element.appendChild(this.#root);
    this.#items = children.map((child) => {
      const item = this.#createElementWithClass("carousel__item");
      item.appendChild(child);
      this.#container.appendChild(item);
      return item;
    });
    this.#setStyle();
    this.#createNavigation();

    // Evenement
    this.#moveCallback.forEach((cb) => cb(0));
    this.#onWindowResize();
    window.addEventListener("resize", this.#onWindowResize.bind(this));
    this.#root.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight" || e.key === "Right") {
        this.#next();
      } else if (e.key === "ArrowLeft" || e.key === "Lelft") {
        this.#prev();
      }
    });
  }

  #createNavigation() {
    const nextButton = this.#createElementWithClass("carousel__next", "button");
    const prevButton = this.#createElementWithClass("carousel__prev", "button");
    this.#root.appendChild(nextButton);
    this.#root.appendChild(prevButton);
    nextButton.addEventListener("click", this.#next.bind(this));
    prevButton.addEventListener("click", this.#prev.bind(this));
    if (this.#options.loop === true) return;
    this.#onMove((index) => {
      if (index === 0) {
        prevButton.setAttribute("disabled", "");
        prevButton.classList.add("carousel__prev--hidden");
      } else {
        prevButton.removeAttribute("disabled");
        prevButton.classList.remove("carousel__prev--hidden");
      }
      if (this.#items[this.#currentIndex + this.#slideVisible] === undefined) {
        nextButton.setAttribute("disabled", "");
        nextButton.classList.add("carousel__next--hidden");
      } else {
        nextButton.removeAttribute("disabled");
        nextButton.classList.remove("carousel__next--hidden");
      }
    });
  }

  #next() {
    this.#gotToItme(this.#currentIndex + this.#slideScroll);
  }

  #prev() {
    this.#gotToItme(this.#currentIndex - this.#slideScroll);
  }

  /**
   * Déplace le carousel vers la ciblé donné
   * @param {number} index
   */
  #gotToItme(index) {
    if (index < 0) {
      if (this.#options.loop) {
        index = this.#items.length - this.#slideVisible;
      } else {
        return;
      }
    } else if (
      this.#items[this.#currentIndex + this.#slideVisible] === undefined &&
      index > this.#currentIndex
    ) {
      if (this.#options.loop) {
        index = 0;
      } else {
        return;
      }
    }
    const translateX = (index * -100) / this.#items.length;
    this.#container.style.transform = `translate3d(${translateX}%, 0, 0)`;
    this.#currentIndex = index;
    this.#moveCallback.forEach((cb) => cb(index));
  }

  /**
   * Le ratio est égal aux nombres d'enfants (items) / par le nombre d'élément que   l'on souhaite rendre visible
   *
   * Applique les bonnes dimensions aux elements du carousel
   */
  #setStyle() {
    const ratio = this.#items.length / this.#slideVisible;
    /**
     *  La Largeur du container sera égal au ratio * 100. La valeur est en pourcentage c'est pour le responsive
     */
    this.#container.style.width = ratio * 100 + "%";
    /**
     *  La Largeur des child sera égal au ratio 100 divisé par le nombre d'enfant que l'on veut rendre visible divisé par le ratio
     */
    this.#items.forEach((item) => {
      item.style.width = 100 / this.#slideVisible / ratio + "%";
    });
  }

  /**
   *
   * @param {CallableFunction} cb
   */
  #onMove(cb) {
    this.#moveCallback.push(cb);
  }

  #onWindowResize() {
    let mobile = window.innerHeight < 800;
    if (mobile !== this.#isMobile) {
      this.#isMobile = mobile;
      this.#setStyle();
      this.#moveCallback.forEach((cb) => cb(this.#currentIndex));
    }
  }

  /**
   * @param {string} className
   * @returns {HTMLElement}
   */
  #createElementWithClass(className, type = "div") {
    const element = document.createElement(type);
    element.setAttribute("class", className);
    return element;
  }

  /**
   * @returns {number}
   */
  get #slideScroll() {
    return this.#isMobile ? 1 : this.#options.slideScroll;
  }

  /**
   * @returns {number}
   */
  get #slideVisible() {
    return this.#isMobile ? 1 : this.#options.slideVisible;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Carousel(document.querySelector("#carousel1"), {
    slideScroll: 2,
    slideVisible: 2,
    loop: false,
  });
});
document.addEventListener("DOMContentLoaded", () => {
  new Carousel(document.querySelector("#carousel2"), {
    slideScroll: 1,
  });
});
document.addEventListener("DOMContentLoaded", () => {
  new Carousel(document.querySelector("#carousel3"), {
    slideScroll: 3,
    slideVisible: 4,
  });
});
