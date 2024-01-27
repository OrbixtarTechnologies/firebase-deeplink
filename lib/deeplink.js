const fs = require('fs');
const inliner = require('html-inline');
const stream = require('stream');
const path = require('path');
const url = require('url'); 

module.exports = function (options) {
    options = options || {};
    
    options.android_package_name = options.android_package_name || 'com.orbixtartechnologies.miningrewards';
    options.ios_store_link = options.ios_store_link || '';
    options.title = options.title || 'Mining Rewards';
    options.handle_email_action = options.handle_email_action || false

    const deeplink = function (req, res, next) {
        var queryParams = req.query
        if (options.handle_email_action) {
            options.fallback = options.fallback || url.format({ protocol: 'https', hostname: 'miningrewards.web.app', pathname: '/auth/web', query: queryParams }) 
            options.url = options.url || url.format({ protocol: 'https', hostname: 'miningrewards.web.app', pathname: '/auth/action', query: queryParams });
            options.play_store_link = 'https://market.android.com/details?id=' + options.android_package_name + '&referrer=utm_source%3Dauth_action%26utm_campaign%3D' + queryParams
        }
        const opts = {};
        Object.keys(options).forEach(function (k) {
            opts[k] = options[k];
        });

        if (req.query.url) {
            opts.url = req.query.url;
        }

        // bail out if we didn't get url
        if (!opts.url) {
            return next();
        }

        if (req.query.fallback) {
            opts.fallback = req.query.fallback;
        }

        // read template file
        const file = fs.createReadStream(
            path.join(__dirname, '/public/index.html')
        );

        // replace all template tokens with values from options
        const detoken = new stream.Transform({ objectMode: true });
        detoken._transform = function (chunk, encoding, done) {
            let data = chunk.toString();
            Object.keys(opts).forEach(function (key) {
                data = data.replace('{{' + key + '}}', opts[key]);
            });

            this.push(data);
            done();
        };

        // inline template js with html
        const inline = inliner({ basedir: path.join(__dirname, '/public') });

        // make sure the page is being sent as html
        res.set('Content-Type', 'text/html;charset=utf-8');

        // read file --> detokenize --> inline js --> send out
        file.pipe(detoken).pipe(inline).pipe(res);
    };

    return deeplink;
};