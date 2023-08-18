// In progress middleware for setting content type for static files

/*
const path = require('path')

console.log("Inside Set Content Type");

exports.cssContentTypeOptions = (req, res, next)=>{
    console.log("Inside CSS Content Type");

        const fileExtension = req;
        //console.log("File Extension:", fileExtension);

        if (fileExtension === '.css') {
            const css = "rockhound.css";
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Content-Type', 'text/css');
            res.send(css);
        }

        const response = res;
        //console.log("Response:", response);

        return next();
    }

/*
exports.pngContentTypeOptions = function(options) {
    return function(req, res, next) {
        const relativePath = req.url
        const absolutePath = path.join(options.src, relativePath)
        const fileExtension = path.extname(relativePath)

        if (fileExtension === '.png') {
            const css = compiler.compile(absolutePath)
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.setHeader('Content-Type', 'image/png')
            console.log('>>> BEFORE')
            res.send(png) // <----- The offending line.
            console.log('>>> AFTER')
        }
    }
}
*/
