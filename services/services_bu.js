"use strict";

var request = require('request'),
    cheerio = require('cheerio');

var helpers = require('../helpers/helpers');

module.exports = {

    getData: (user_parameter, resolve, reject) => {

        let googleUrl = 'http://www.google.it/movies?near='+user_parameter;

        request(googleUrl, (error, response, html) => {

            if(!error){

                let $ = cheerio.load(html),
                    data = [];

                $('.theater .desc .name a').each(function(index){

                    let theaterName = $(this).text(),
                        theaterMovies = [];

                    $(this).parent().parent().siblings('.showtimes').find('.movie').each(function(i){

                        let movieName = $(this).find('.name a').text(),
                            movieTimes = $(this).find('.times').text();

                        theaterMovies.push({
                            name: movieName,
                            times: movieTimes
                        })

                    });

                    data.push({
                        'theater': theaterName,
                        'movies': theaterMovies
                    })

                })

                resolve(data)

            }

        })


    },

    getCinema: (data, resolve, reject) => {



        let theaters = [];

        for (let i = 0; i < data.length; i++) {
            theaters.push([data[i].theater])
        }

        resolve(theaters)


    },

    // getCinema: function(location, callback){
    //     var googleUrl = 'http://www.google.it/movies?near='+location;
    //     request(googleUrl, function(error, response, html){
    //         if(!error){
    //             var $ = cheerio.load(html);
    //             var theaters = [];
    //             $('.theater .desc .name a').each(function(index){
    //                 var element = {};
    //                 var data = $(this);
    //                 var name = data.text(),
    //                     info = data.parent().parent().find('.info').text(),
    //                     link = data.attr('href');
    //                 element = name;
    //                 theaters.push([element]);
    //             });
    //             if (typeof callback == "function")
    //                 return callback(theaters);
    //             else
    //                 return theaters;
    //         } else {
    //             console.log("ERROR GETCINEMA", err); return;
    //         }
    //     });
    // },

    getMovies: function(location, theater, callback){
        var googleUrl = 'http://www.google.it/movies?near='+location;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var movies = [];
                $('.theater .desc .name a').each(function(index){
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
        var googleUrl = `http://www.google.it/movies?near=${location}`;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                $('.theater .desc .name a').each(function(){
                    var text = $(this).text()
                    if (text == theater){
                        var data = $(this);
                        data.parent().parent().siblings('.showtimes').find('.movie').each(function(){
                            var text = $(this).find('.name').text();
                            if (text == movie){
                                var data = $(this);
                                var movieTimes = data.find('.times').text();
                                var responseTimes = `The show times for "${movie}" are: ${movieTimes}. ${helpers.textResponse.beer}`;
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