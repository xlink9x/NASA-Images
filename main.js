window.fetchObject = function (url, options, onFulfil, onReject) {
  fetch(url, options)
    .then((r) => r.json())
    .then((json) => onFulfil(json))
    .catch(onReject);
};

const form = document.querySelector("#imagesearchform");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const body = document.querySelector("body");
const buttonNext = document.querySelector("#button-next");
const buttonPrev = document.querySelector("#button-prev");
const counter = document.querySelector("#resultscounter");

const state = {
  items: [],
  currentItem: -1,
};

function onDataReceived(data) {
  state.items = data.collection["items"];
  state.currentItem = 0;
  render();
}

function render() {
  // check if we have any results
  if (!state.items || state.items.length === 0) {
    title.textContent = "No results";
    description.textContent = "Try using a different search term";
    body.style.backgroundImage = "unset";

    buttonNext.enabled = false;
    buttonPrev.enabled = false;

    return;
  }

  // render counter
  counter.textContent = `${state.currentItem + 1} / ${state.items.length}`;

  // render item
  const item = state.items[state.currentItem];
  const metadata = item["data"][0];
  title.textContent = metadata["title"];
  description.textContent = metadata["description"];

  // get url of largest (renderable) image
  const links = item["links"];
  const filteredLinks = links.filter((link) => !link["href"].endsWith(".tif"));
  const imageUrl = filteredLinks[filteredLinks.length - 1]["href"];
  body.style.backgroundImage = `url(${imageUrl})`;

  if (state.currentItem === 0) {
    buttonPrev.disabled = true;
  } else {
    buttonPrev.disabled = false;
  }
  if (state.currentItem === state.items.length - 1) {
    buttonNext.disabled = true;
  } else {
    buttonNext.disabled = false;
  }
}

function loadNextImage() {
  state.currentItem += 1;
  render();
}

function loadPrevImage() {
  state.currentItem -= 1;
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  currentQueryString = data.get("querystring");

  fetchObject(
    `https://images-api.nasa.gov/search?media_type=image&q=${currentQueryString}`,
    {},
    onDataReceived,
  );
});

buttonNext.addEventListener("click", (event) => {
  event.preventDefault();
  loadNextImage();
});

buttonPrev.addEventListener("click", (event) => {
  event.preventDefault();
  loadPrevImage();
});
