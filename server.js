"use strict";

var express     = require('express'),
    body_parser = require('body-parser'),
    helpers     = require('./helpers/helpers'),
    commands    = require('./commands/commands'),
    services    = require('./services/services'),
    events      = require('./events/events');

var app          = express(),
    token        = process.env.TELEGRAM_TOKEN,
    qs, user_session = {};

const STATUSES = {
    INITIAL: 1,
    THEATERS_RECEIVED: 2,
    MOVIES_RECEIVED: 3
};

app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json());

app.post('/', function (req, res) {

    console.log(req.body)

    var from_id      = req.body.message.from.id,
        user_message = req.body.message.text + " ";

    if (!user_session.from_id){
        user_session.from_id = {
            chat_id: req.body.message.chat.id,
            location: undefined,
            theater: undefined,
            movie: undefined,
            status: STATUSES.INITIAL
        }
    }

    switch (helpers.messageType(req)) {

        case 'text':

            if (helpers.isCommand(user_message)) {

                let user_command = user_message.split(' ')[0],
                    user_parameter = user_message.substring(user_command.length + 1, user_message.length);

                switch(user_command) {

                    case '/start':
                        commands.start(user_session.from_id.chat_id, req.body.message.chat.first_name, token)
                    break;

                    case '/help':
                        commands.info(user_session.from_id.chat_id, token)
                    break;

                    case '/reset':
                        user_session.from_id.status = STATUSES.INITIAL
                        commands.reset(user_session.from_id.chat_id, token)
                    break;

                    case '/getcinema':
                        user_session.from_id.status = STATUSES.INITIAL
                        if (!user_parameter) {
                            commands.notParameter(user_session.from_id.chat_id, token)
                        } else {

                            new Promise((resolve, reject) => {

                                services.getTheaters(user_parameter, resolve, reject)

                            }).then((data) => {

                                if (data.length > 0){
                                    user_session.from_id.status = STATUSES.THEATERS_RECEIVED;
                                    user_session.from_id.location = user_parameter;
                                    commands.getTheaters(user_session.from_id.chat_id, token, data)
                                } else {
                                    commands.notResults(user_session.from_id.chat_id, token, user_parameter)
                                }

                            })

                        }
                    break;

                    default:
                        commands.error(user_session.from_id.chat_id, token)

                }
            } else {

                if (user_message.charAt(0) == '✖') {

                    user_session.from_id.status = STATUSES.INITIAL
                    commands.reset(user_session.from_id.chat_id, token)

                } else {

                    switch(user_session.from_id.status){

                        case STATUSES.THEATERS_RECEIVED:
                            user_session.from_id.theater = user_message;
                            new Promise((resolve, reject) => {
                                services.getMovies(user_session.from_id.location, user_message, resolve, reject)
                            }).then((theaterData) => {
                                if (typeof theaterData == 'object'){
                                    console.log('theaterData', theaterData)
                                    user_session.from_id.status = STATUSES.MOVIES_RECEIVED;
                                    commands.getMovies(user_session.from_id.chat_id, token, theaterData)
                                } else {
                                    commands.notFound(user_session.from_id.chat_id, token)
                                }
                            });
                            break;

                        case STATUSES.MOVIES_RECEIVED:
                            new Promise((resolve, reject) => {
                                services.getMovieInfo(user_session.from_id.location, user_session.from_id.theater, user_message, resolve, reject)
                            }).then((movieData) => {
                                if (typeof movieData == 'object'){
                                    commands.getInfo(user_session.from_id.chat_id, token, movieData)
                                } else {
                                    commands.notFound(user_session.from_id.chat_id, token)
                                }
                            });
                            break;

                    }

                }

            }

        break;

        case 'location':

            user_session.from_id.location = `${req.body.message.location.latitude},${req.body.message.location.longitude}`;

            new Promise((resolve, reject) => {

                services.getTheaters(user_session.from_id.location, resolve, reject)

            }).then((data) => {

                if (data.length > 0){
                    commands.getTheaters(user_session.from_id.chat_id, token, data)
                    user_session.from_id.status = STATUSES.THEATERS_RECEIVED;
                } else {
                    commands.notResults(user_session.from_id.chat_id, token, user_parameter)
                }

            })
            break;


    };

    res.send();


});

app.listen(process.env.PORT);
console.log(`Magic happens on port ${process.env.PORT}`);
