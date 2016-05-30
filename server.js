"use strict";

var express     = require('express'),
    bodyParser  = require('body-parser'),
    //         = require('underscore'),
    ua          = require('universal-analytics'),
    util        = require('util');

var helpers  = require('./helpers/helpers'),
    commands = require('./commands'),
    services = require('./services/services'),
    events   = require('./events/events');

var app     = express(),
    token   = process.env.TELEGRAM_TOKEN,
    visitor = ua(process.env.UA_TOKEN);

var qs = {};

var session_request = {};

var User = {};

let user_location;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.post('/', function (req, res) {

    console.log(req.body)

    var chat_id = req.body.message.chat.id,
        user_message = req.body.message.text + " ";

    switch (helpers.messageType(req)) {

        case 'text':

            if (helpers.isCommand(user_message)) {

                let user_command = user_message.split(' ')[0],
                    user_parameter = user_message.substring(user_command.length + 1, user_message.length);

                switch(user_command) {

                    case '/start':
                        commands.start(chat_id, req, token)
                    break;

                    case '/dev':
                        commands.creator(chat_id, token)
                    break;

                    case '/getcinema':
                        if (!user_parameter) {
                            console.log('-- command not parameter')
                        } else {

                            new Promise((resolve, reject) => {

                                services.getTheaters(user_parameter, resolve, reject)

                            }).then((data) => {

                                if (data.length > 0){
                                    events.sendMessage(token, qs)
                                    commands.getTheaters(chat_id, token, data)
                                } else {
                                    commands.notresults(chat_id, token, user_parameter)
                                }

                            })

                        }
                    break;

                    default:
                        commands.error(chat_id, token)

                }
            }

        break;


    };

    res.send();


});

app.listen(process.env.PORT);
console.log(`Magic happens on port ${process.env.PORT}`);
