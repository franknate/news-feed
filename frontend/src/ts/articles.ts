import { searchTerms, eventTarget } from "./searchTerms.js";

type Article = {
  title: string;
  link: string;
  image: string;
  source: string;
  time: string;
};

type ArticleObject = {
  [index: string]: Article[];
};

const articles: ArticleObject = {};
const scraperUrl =
  "http://localhost:5000?searchTerm=";
const news = document.getElementById("news");

async function fetchArticles(searchTerm: string): Promise<Article[]> {
  const response = await await fetch(scraperUrl + searchTerm);
  return response.ok ? await response.json() : [];
}

async function updateTopic(searchTerm: string) {
  const newArticles = await fetchArticles(searchTerm);
  if (searchTerm in articles && articles[searchTerm].length > 0) {
    let lastOfOld = articles[searchTerm][articles[searchTerm].length - 1];
    let startIndex = newArticles.map((a) => a.link).indexOf(lastOfOld.link) + 1;
    articles[searchTerm].push(...newArticles.slice(startIndex));
  } else {
    articles[searchTerm] = newArticles;
  }
}

export async function updateArticles() {
  searchTerms.forEach((s) => updateTopic(s.textContent));
}

function popArticleFromRandomTopic() {
  const topics = Object.keys(articles);
  let randomTopic;
  do {
    randomTopic = topics[Math.floor(Math.random() * topics.length)];    
  } while (articles[randomTopic].length == 0);
  const article = articles[randomTopic].shift();
  if (articles[randomTopic].length == 0) {
    delete articles[randomTopic];
  }
  return article;
}

function elapsedTime(fromStr: string) {
  const min = Math.round((new Date().getTime() - new Date(fromStr).getTime()) / 60000);
  return `${min} minutes ago`;
};

function buildArticle() {
  const articleDiv = document.createElement("div");
  const body = document.createElement("div");
  const link = document.createElement("a");
  const title = document.createElement("h2");
  const source = document.createElement("p");
  const time = document.createElement("p");
  const image = document.createElement("img");
  const article = popArticleFromRandomTopic();
  articleDiv.classList.add("article");
  title.innerText = article.title;
  source.innerText = article.source;
  time.innerText = elapsedTime(article.time);
  image.src = article.image;
  link.href = article.link;
  link.target = '_blank';
  link.appendChild(title);
  body.appendChild(link);
  body.appendChild(source);
  body.appendChild(time);
  articleDiv.appendChild(body);
  articleDiv.appendChild(image);
  return articleDiv;
}

export function addArticle() {
  if (Object.keys(articles).length != 0) {
    news.appendChild(buildArticle());
  } else {
    console.log("Articles emtpy");
  }
}

function removeTopic(event) {
    delete articles[event.target.textContent];
};

searchTerms.forEach(s => s.addEventListener('click', removeTopic));

eventTarget.addEventListener("addSearchTerm", () =>
  updateTopic(searchTerms[searchTerms.length - 1].textContent));

