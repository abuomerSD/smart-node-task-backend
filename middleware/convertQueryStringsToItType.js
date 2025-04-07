function convertQueryStringsToItType(req, res, next) {
    // Iterate over each key in req.query
    for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
            const value = req.query[key];

            // Convert "true" and "false" strings to boolean
            if (value === 'true') {
                req.query[key] = true;
            } else if (value === 'false') {
                req.query[key] = false;
            }
        }
        // additional functionality to convert limit and page to integers
        if (key === 'limit' || key === 'page') {
            req.query[key] = parseInt(req.query[key]);
        }
    }

    next(); // Call next middleware or route handler
}

module.exports = convertQueryStringsToItType;
