const express = require('express');
const app = express();
const cors = require('cors');
const api = require('./routes/api');

app.use(cors());
app.use(express.json());

app.use('/api', api);

app.get('/', (req, res) => {
    res.send('Express back end for MEAN stack authentication demo.');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Express server is running on port ' + PORT);
});