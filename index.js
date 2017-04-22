const x2js = require('x2js');
const rawBody = require('raw-body');

const limit = '1mb';
const encoding = 'utf8';

module.exports = function(options) {
    options = options || { limit: limit, encoding: encoding };
    return function(ctx, next) {
        if ((ctx.request.body === undefined || ctx.request.body === null) && ctx.is('application/xml', 'text/xml', 'xml') && /^(POST|PUT|PATCH)$/i.test(ctx.method)) {
            const len = ctx.request.headers['content-length'];
            options.length = len;

            if (ctx.request.charset !== undefined && ctx.request.charset !== null) {
                options.encoding = ctx.request.charset;
            }

            return rawBody(ctx.req).then((buf) => {
                const xmlObj = (new x2js).xml2js(buf.toString());
                ctx.request.body = xmlObj;
                return next();
            }).catch((e) => {
                throw e;
            });
        } else {
            return next();
        }
    }
}
