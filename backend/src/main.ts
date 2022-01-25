import express from "express";
const googleNewsScraper = require("google-news-scraper");
const url = require("url");
const cors = require("cors")({origin: true});

const config = {
  searchTerm: "",
  prettyURLs: false,
  queryVars: {
    hl: "en-US",
    gl: "US",
    ceid: "US:en",
  },
  timeframe: "1h",
  puppeteerArgs: [],
};

export type Article = {
  title: string;
  link: string;
  image: string;
  source: string;
  time: string;
};

function formatTime({
  title,
  link,
  image,
  source,
  time: unformattedTime,
}: Article): Article {
  const addMinutes = parseInt(unformattedTime.split(" ")[0]);
  const time = new Date(Date.now() - addMinutes * 60000).toString();
  return { title, link, image, source, time };
}

export function filterAndSort(articles: Article[]): Article[] {
  return articles
    .filter((a) => Object.values(a).every((v) => v))
    .map((a) => formatTime(a))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

const getNews = async (searchTerm: string): Promise<Article[]> => {
  config.searchTerm = searchTerm;
  const articles: Article[] = await googleNewsScraper(config);
  return filterAndSort(articles);
};

const app = express();

app.get("/", (req, res) => {
  cors(req, res, async () => {
    const searchTerm: string = url.parse(req.url, true).query.searchTerm;
    const news = await getNews(searchTerm);

    res.send(news);
  });
});

app.listen(5000, () => console.log("Listening on port 5000..."));
