import { updateArticles, addArticle } from './articles.js';

const updateFrequency = 3; // Minutes
const addFrequency = 5; // Seconds

updateArticles();
setInterval(updateArticles, updateFrequency * 60000);
setInterval(addArticle, addFrequency * 1000);

