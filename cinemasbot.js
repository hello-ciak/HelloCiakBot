var request = require('request'),
    cheerio = require('cheerio');

var theater_name = $('.theater .desc .name a');

module.exports = {

    sendMessage: function(token, qs){
        request({
            url: 'https://api.telegram.org/' + token + '/sendMessage',
            method: 'POST',
            qs: qs
        }, function (err, response, body) {
            if (err) {
                console.log("ERROR SENDMESSAGE", err); return;
            }
        });
    },

    getCinema: function(location, callback){
        console.log('****** enter getCinema');
        var googleUrl = 'http://www.google.it/movies?near='+location;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var theaters = [];
                theater_name.each(function(index){
                    var element = {};
                    var data = $(this);
                    var name = data.text(),
                        info = data.parent().parent().find('.info').text(),
                        link = data.attr('href');
                    element = name;
                    theaters.push([element]);
                });
                if (typeof callback == "function")
                    return callback(theaters);
                else
                    return theaters;
            } else {
                console.log("ERROR GETCINEMA", err); return;
            }
        });
    },

    getMovies: function(location, theater, callback){
        console.log('****** enter getMovies');
        var googleUrl = 'http://www.google.it/movies?near='+location;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var movies = [];
                theater_name.each(function(index){
                    var text = $(this).text()
                    if (text == theater){
                        var data = $(this);
                        data.parent().parent().siblings('.showtimes').find('.movie').each(function(){
                            var element = {};
                            var data = $(this);
                            var name = data.find('.name a').text();
                            element = name;
                            movies.push([element]);
                        });
                    }
                });
                if (typeof callback == "function"){
                    return callback(movies);
                } else {
                    return movies;
                }
            } else {
                console.log("ERROR GETMOVIES", err); return;
            }
        });
    },

    getTimes: function(location, theater, movie, callback){
        console.log('****** enter getTimes');
        var googleUrl = 'http://www.google.it/movies?near='+location;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                theater_name.each(function(){
                    var text = $(this).text()
                    if (text == theater){
                        var data = $(this);
                        data.parent().parent().siblings('.showtimes').find('.movie').each(function(){
                            var text = $(this).find('.name').text();
                            if (text == movie){
                                var data = $(this);
                                var movieTimes = data.find('.times').text();
                                var responseTimes = "The show times for " + decodeURI(movie) + " are: " + movieTimes;
                                if (typeof callback == "function")
                                    return callback(responseTimes);
                                else
                                    return responseTimes;
                            }
                        });
                    }
                });
            } else {
                console.log("ERROR GETTIMES", err); return;
            }
        });
    }
}