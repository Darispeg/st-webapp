//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./src/'));

app.get('/*', (req, res) =>
    res.sendFile('sign-in.component.html', {root: 'src/app/modules/auth/sign-in/'}),
);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "sign-in.component.html"));
  });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);