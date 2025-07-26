const axios = require('axios');

(async () => {
    const response = await axios.post('http://localhost:3000/concat');
    console.log('sent');
    console.log(response.data);
})();