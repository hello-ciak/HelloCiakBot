var helpers = require('../helpers/helpers'),
    events  = require('../events/events');

module.exports = {

    error: (chat_id, token) => {
        qs = {
            reply_markup: JSON.stringify({"hide_keyboard": true}),
            chat_id: chat_id,
            text: "Command not found, use /help for more info."
        };
        events.sendMessage(token, qs)
    },

    notResults: (chat_id, token, user_parameter) => {
        qs = {
            reply_markup: JSON.stringify({"hide_keyboard":true}),
            chat_id: chat_id,
            text: `${helpers.textResponse.sorry} *${user_parameter}*`
        };
        events.sendMessage(token, qs);
    },

    notFound: (chat_id, token) => {
        qs = {
            chat_id: chat_id,
            text: helpers.textResponse.hint_keyboard
        };
        events.sendMessage(token, qs)
    },

    start: (chat_id, user_name, token) => {
        qs = {
            reply_markup: JSON.stringify({"hide_keyboard": true}),
            chat_id: chat_id,
            text: `Hello ${user_name}.\nUse /getcinema to receive the list of movie theaters near you.\nUse /help for more info.`,
            parse_mode: "Markdown"
        };
        events.sendMessage(token, qs)
    },

    reset: (chat_id, token) => {
        qs = {
            reply_markup: JSON.stringify({"hide_keyboard": true}),
            chat_id: chat_id,
            text: "Search closed"
        };
        events.sendMessage(token, qs)
    },

    info: (chat_id, token) => {
        qs = {
            reply_markup: JSON.stringify({"hide_keyboard": true}),
            chat_id: chat_id,
            text: "Use /getcinema to start the search. \nIf the geolocation is not active, use '/getcinema' followed by your city. ex. /getcinema Venezia"
                  + helpers.textResponse.beer,
            reply_markup: JSON.stringify({
                "inline_keyboard": [
                    [
                        {
                            'text':'Donate with Paypal',
                            'url': 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PX3EU8YNJF8JS'
                        }
                    ]
                ]
            })
        };
        events.sendMessage(token, qs)
    },

    getMovies: (chat_id, token, movies) => {
        var list_movies = movies.slice(0);
        list_movies.push(['✖️']);
        qs = {
            reply_markup: JSON.stringify({
                "keyboard": list_movies,
                "resize_keyboard": true
            }),
            chat_id: chat_id,
            text: 'Click on the movie you would like to find out showtimes'
        };
        events.sendMessage(token, qs);
    },

    getInfo: (chat_id, token, movie_info) => {
        qs = {
            chat_id: chat_id,
            parse_mode: "Markdown",
            text: `*${movie_info.title}*\n${movie_info.times}\n${movie_info.info}`,
            reply_markup: JSON.stringify({
                "inline_keyboard": [
                    [
                        {
                            'text': 'Donate with Paypal',
                            'url': 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PX3EU8YNJF8JS'
                        }
                    ]
                ]
            })
        };
        events.sendMessage(token, qs);
    },

    getTheaters: (chat_id, token, theaters) => {
        var list_theaters = theaters.slice(0);
        list_theaters.push(['✖️']);
        qs = {
            reply_markup: JSON.stringify({
                "keyboard": list_theaters,
                "one_time_keyboard": true,
                "resize_keyboard": true
            }),
            chat_id: chat_id,
            parse_mode: "Markdown",
            text: '*Great!* Now choose an option:'
        };
        events.sendMessage(token, qs);
    },

    notParameter: (chat_id, token) => {
        qs = {
            reply_markup: JSON.stringify({
                "keyboard": [
                    [
                        {
                            'text':'Send my current location',
                            'request_location': true
                        }
                    ],
                    [
                        {
                            'text':'✖'
                        }
                    ]
                ]
            }),
            chat_id: chat_id,
            text: "Ok, now send your location"
        };
        events.sendMessage(token, qs);
    }

}