const axios=require('axios');

module.exports.authUser = async (req, res, next) => {
    try {
        console.log("ehllo");
        // console.log(req.cookies.token);
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        // console.log('yha se satak liya');
        console.log(token);
        if (!token) {
            console.log('no token');
            return res.status(401).json({ message: 'No token provided' });
        }
        const response = await axios.get('http://localhost:4000/user/profile', {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        console.log(response.data);

        req.user = response.data; // Attach user info for further use
        next();
    }
    catch (err) {
        console.log('aaya maja?');
        return res.status(401).json({ message: 'Invalid user token' });
    }
}