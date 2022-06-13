//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./src/app/modules/dashboard/dashboard.component.html'));

app.get('/*', (req, res) =>
    res.sendFile('dashboard.component.html', {root: 'src/app/modules/dashboard/'}),
);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);