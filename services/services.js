"use strict";

let request = require('request');
let baseUrl = "https://cinemasbot-api.herokuapp.com";

module.exports = {

    getTheaters: (location, resolve, reject) => {

        let endPoint     = `${baseUrl}/?near=${location}`,
            listTheaters = [];

        request({
            url: endPoint,
            json: true
        }, (error, response, body) => {
            if(error) {
                console.log(error);
            } else {
                for (let i=0; i< body.data.length; i++){
                    listTheaters.push([body.data[i].theater_name])
                }
                resolve(listTheaters)
            }
        });

    },

    getMovies: (location, theater, resolve, reject) => {

        let endPoint     = `${baseUrl}/?near=${location}&cinema_name=${theater}`,
            listMovies = [];

        request({
            url: endPoint,
            json: true
        }, (error, response, body) => {
            if(error) {
                console.log(error);
            } else {
                if (body.data[0]){
                    for (let i=0; i< body.data[0].movies.length; i++){
                        listMovies.push([body.data[0].movies[i].title])
                    }
                    resolve(listMovies)
                } else {
                    resolve('movie not found')
                }
            }
        });

    },

    getMovieInfo: (location, theater, movie, resolve, reject) => {

        let endPoint  = `${baseUrl}/?near=${location}&cinema_name=${theater}&movie_name=${movie}`,
            movieInfo = {};

        request({
            url: endPoint,
            json: true
        }, (error, response, body) => {
            if(error) {
                console.log(error);
            } else {
                if (body.data[0]){
                    movieInfo.info = body.data[0].movies[0].movie_info;
                    movieInfo.times = body.data[0].movies[0].times;
                    movieInfo.title = body.data[0].movies[0].title;
                    resolve(movieInfo);
                } else {
                    resolve('movie not found')
                }
            }
        });

    }

}