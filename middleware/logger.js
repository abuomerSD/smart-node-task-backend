export const logger = (req, res, next) => 
{
    console.log('-'.repeat(50));
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log('-'.repeat(50));
    next();
}