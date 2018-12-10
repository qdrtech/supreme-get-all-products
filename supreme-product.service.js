const request = require("request");
const cheerio = require("cheerio");

SupremeProductApi = {};

SupremeProductApi.url = 'http://www.supremenewyork.com';

SupremeProductApi.getItems = (category, callback) => {
    let getURL = SupremeProductApi.url + '/shop/all/' + category;
    if (category.toLowerCase() === "all") getURL = SupremeProductApi.url + '/shop/all';
    else if (category.tolowerCase() === "new") getURL = SupremeProductApi.url + '/shop/new';

    request(getURL, function (err, resp, html, rrr, body) {
        var getURL = SupremeProductApi.url + '/shop/all/' + category;
        if (category == 'all') {
            getURL = SupremeProductApi.url + '/shop/all';
        } else if (category == 'new') {
            getURL = SupremeProductApi.url + '/shop/new';
        }

        request(getURL, (err, resp, html, rrr, body) => {

            if (!err) {
                if (err) {
                    callback('No response from website');
                } else {
                    var $ = cheerio.load(html);
                }

                var count = $('img').length;

                if ($('.shop-closed').length > 0) {
                    callback('Store Closed');
                } else if (count === 0) {
                    callback('Store Closed');
                }

                var parsedResults = [];

                $('img').each(function (i, element) {

                    var nextElement = $(this).next();
                    var prevElement = $(this).prev();
                    var image = "https://" + $(this).attr('src').substring(2);
                    var title = $(this).attr('alt');
                    var availability = nextElement.text().toUpperCase();
                    var link = SupremeProductApi.url + this.parent.attribs.href;
                    var sizesAvailable;


                    if (availability == "") availability = "Available";

                    request(link, function (err, resp, html, rrr, body) {

                        if (err) {
                            callback('No response from website');
                        } else {
                            var $ = cheerio.load(html);
                        }

                        var addCartURL = SupremeProductApi.url + $('form[id="cart-addf"]').attr('action');

                        if (availability == "Sold Out") {
                            addCartURL = null;
                        }

                        var sizeOptionsAvailable = [];
                        if ($('option')) {
                            $('option').each(function (i, elem) {
                                var size = {
                                    id: parseInt($(this).attr('value')),
                                    size: $(this).text(),
                                }
                                sizeOptionsAvailable.push(size);
                            });

                            if (sizeOptionsAvailable.length > 0) {
                                sizesAvailable = sizeOptionsAvailable
                            } else {
                                sizesAvailable = null
                            }
                        } else {
                            sizesAvailable = null;
                        }

                        var metadata = {
                            title: $('h1').attr('itemprop', 'name').eq(1).html(),
                            style: $('.style').attr('itemprop', 'model').text(),
                            link: link,
                            description: $('.description').text(),
                            addCartURL: addCartURL,
                            price: parseInt(($('.price')[0].children[0].children[0].data).replace('$', '').replace(',', '')),
                            image: image,
                            sizesAvailable: sizesAvailable,
                            images: [],
                            availability: availability
                        };

                        // Some items don't have extra images (like some of the skateboards)
                        if ($('.styles').length > 0) {
                            var styles = $('.styles')[0].children;
                            for (li in styles) {
                                for (a in styles[li].children) {
                                    if (styles[li].children[a].attribs['data-style-name'] == metadata.style) {
                                        metadata.images.push('https:' + JSON.parse(styles[li].children[a].attribs['data-images']).zoomed_url)
                                    }
                                }
                            }
                        } else if (title.indexOf('Skateboard') != -1) {
                            // Because fuck skateboards
                            metadata.images.push('https:' + $('#img-main').attr('src'))
                        }

                        parsedResults.push(metadata);

                        if (!--count) {
                            callback(null, parsedResults);
                        }

                    })

                });
            } else {
                callback('No response from website');
            }
        });
    });

}

module.exports = SupremeProductApi;