export const searchTerms = Array.from(
  document.querySelectorAll(".search-term")
);
export const eventTarget = new EventTarget();

const searchSec = document.getElementById("sec-search");
const searchBtn = document.getElementById("btn-search");
const searchInp = document.getElementById("inp-search") as HTMLInputElement;
const searchTermsDiv = document.getElementById("search-terms");
const searchErr = document.getElementById("search-error");

searchTerms.forEach((s) => s.addEventListener("click", removeSearchTerm));
searchBtn.addEventListener("click", addSearchTerm);

function removeSearchTerm(event) {
  const searchTerm = event.currentTarget;
  searchTerms.splice(searchTerms.indexOf(searchTerm), 1);
  searchTermsDiv.removeChild(searchTerm);
}

function buildSearchTerm() {
  const newSearchTerm = document.createElement("button");
  const closeIcon = document.createElement("i");
  newSearchTerm.addEventListener("click", removeSearchTerm);
  newSearchTerm.classList.add("search-term");
  closeIcon.classList.add("fas", "fa-times", "remove-icon");
  newSearchTerm.innerText = searchInp.value;
  newSearchTerm.appendChild(closeIcon);
  searchTermsDiv.appendChild(newSearchTerm);

  return newSearchTerm;
}

function searchTermExists() {
  return searchTerms.some(
    (s) =>
      s.textContent.trim().toLowerCase() == searchInp.value.trim().toLowerCase()
  );
}

function validateSearchTerm() {
  if (searchInp.value.trim() == "") {
    return false;
  } else if (searchTerms.length >= 7) {
    searchErr.innerText = "That'd surely be too much for you.";
    return false;
  } else if (searchInp.value.toLowerCase().match(/[^\w áéíóöőúüű-]/)) {
    searchErr.innerText = "What is this gibberish?";
    return false;
  } else if (searchTermExists()) {
    searchErr.innerText = "That's boring.";
    return false;
  } else {
    searchErr.innerText = "";
    return true;
  }
}

function addSearchTerm(event) {
  event.preventDefault();

  if (validateSearchTerm()) {
    searchTerms.push(buildSearchTerm());
    eventTarget.dispatchEvent(new Event("addSearchTerm"));
    searchInp.value = "";
  }
}
