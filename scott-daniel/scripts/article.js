'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// DONE: Why isn't this method written as an arrow function?
// the arrow function doesnt have the data for the contextual "this" and it will throw an error

Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // DONE: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  //It is a conditional operator, for determining the amount of days ago that it was published. Checking to see if there is a published on value. if not returns draft.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// DONE: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called below within the Article.fetchAll function and will run if there is local storeage for rawData. Now, rawData has become the JSON object strings as shown in the data directory. This is different from previous labs because we are working with AJAX methods to retreive the data.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.getItem('rawData')));
    articleView.initIndexPage();

  } else {
    $.getJSON('../data/hackerIpsum.json')
      .then( data => {
        localStorage.setItem('rawData', JSON.stringify(data));
        Article.loadAll(data);
        articleView.initIndexPage();
      },
      function(err) {
        console.error(err);
      });
  }
}

//DONE: Explain how you and your partner determined the sequence of code execution.
//Our fetchAll() method first checks if "rawData" exists in local storage, and if so it uses the loadAll() method to GET the rawData from local storage and parse it, then passes the initIndexPage() method to render the articles to the page. The else statement first grabs the rawData from the data directory by searching for its url, then sets it to local storage for the next page load. 
