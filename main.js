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

function onDataReceived(data) {
  const collection = data.collection;
  if (collection.items.length > 0) {
    const item = collection.items[0];
    const metadata = item["data"][0];
    title.textContent = metadata["title"];
    description.textContent = metadata["description"];

    // get url of largest (renderable) image
    const links = item["links"];
    const filteredLinks = links.filter(
      (link) => !link["href"].endsWith(".tif"),
    );
    const imageUrl = filteredLinks[filteredLinks.length - 1]["href"];
    body.style.backgroundImage = `url(${imageUrl})`;
  }
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
