"use strict";

let request = require('request');

module.exports = {

    getTheaters: (location, resolve, reject) => {

        let endPoint     = `http://cinemasbot-api.herokuapp.com/?near=${location}`,
            listTheaters = [];

        request({
            url: endPoint,
            json: {
                field1: 'data',
                field2: 'data'
            }
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

    }

}