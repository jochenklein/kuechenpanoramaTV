var resorts = require('./resorts.json');
var request = require('request');
var cheerio = require('cheerio');

// Initialize JSON-formatted list of resorts containing the streams for webcams
var webcams = JSON.parse(JSON.stringify(resorts));
var webcamsCount = 0;
webcams.forEach(function(resort, index) {
    if (resort.request) {
        webcamsCount += resort.cams.length;
    }
});

function callback(callback) {
    console.log('all done');
    return callback;
}

// Parse/Crawl and update stream urls
module.exports = {
    parse: function(callback) {
        var webcamsProcessed = 0;
        resorts.forEach(function(resort, resortIndex) {
            // Webcam streams of current resort
            if (resort.request) {
                resort.cams.forEach(function(cam, camIndex) {
                    request(cam.url, function(error, response, html) {
                        if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);

                            var streamSrc = $('video#fer_video source').attr('src');
                            var temperature = $('div#livebild_wetter td.p_livebild_txt nobr')[0].children[0].data;
                            var webcamTime = $('div#livebild_clock td.p_livebild_txt nobr')[0].children[0].data;

                            console.log(`${resort.name}, ${cam.name} (${webcamTime.trim()}, ${temperature.trim()}): ${cam.url} -> ${streamSrc}`);

                            webcams[resortIndex].cams[camIndex].url = streamSrc;
                            webcams[resortIndex].cams[camIndex].temperature = temperature;
                            webcams[resortIndex].cams[camIndex].time = webcamTime;
                        }
                        webcamsProcessed++;
                        if (webcamsProcessed === webcamsCount) {
                            callback(webcams);
                        }
                    });
                });
            }
        });
    }
}
