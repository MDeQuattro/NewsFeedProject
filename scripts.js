/**
 * Created by DeQuatts on 11/27/2016.
 */
//this forces javascript to conform to some rules, like declaring variables with var
"use strict";

const usnews_url = "http://www.usnews.com/rss/news";
const worldnews_url = "http://feeds.bbci.co.uk/news/world/rss.xml";
const sports_url = "http://espn.go.com/espn/rss/nhl/news";
const weather_url = "http://rss.accuweather.com/rss/blog_rss.asp?blog=headlines";
const technology_url = "http://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk";



function init(){
    getLastVisitDate();

    addRemoveNews(document.getElementById("usnews"), usnews_url); // init the us news
}

// Display the last date you visited and store the current date for next time
function getLastVisitDate() {
    if (typeof(Storage) !== "undefined") {
        var dateField = document.getElementById("lastVisit");

        if (!localStorage.getItem("lastVisitDate")) {
            dateField.innerHTML = "Welcome to the news feed!";
        } else {
            dateField.innerHTML = "Welcome back to the news feed! <br> The last time you were here was: " + localStorage.getItem("lastVisitDate").toString();
        }
        localStorage.setItem("lastVisitDate", new Date());
    }
}

function parseEntries(values, id) {
    var html = "";
    values.forEach(function (feed) {
        var title = feed.title;
        var description = feed.content;
        var link = feed.link;
        var pubDate = feed.publishedDate;

        //present the item as HTML
        var line = '<div class="item">';
        line += "<h2>"+title+"</h2>";
        line += '<p><i>'+pubDate+'</i> - <a href="'+link+'" target="_blank">See original</a></p>';
        //title and description are always the same (for some reason) so I'm only including one
        line += "<p>"+description+"</p>";
        line += "</div>";

        html += line;
    });
    document.querySelector("#content_" + id).innerHTML = html;

    $("#content").fadeIn(500);
}

function addRemoveNews(checkbox, url) {
    if (checkbox.checked) {
        $.ajax({
            type: "GET",
            url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
            dataType: 'json',
            error: function () {
                alert('Unable to load feed, Incorrect path or invalid feed');
            },
            success: function (xml) {
                var feed = xml.responseData.feed;
                parseEntries(feed.entries, checkbox.id);
            }
        });
    } else {
        document.querySelector("#content_" + checkbox.id).innerHTML = "";
    }
}