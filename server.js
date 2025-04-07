const app = require('./app');
const port = process.env.PORT || 3000;
const host = 'localhost';

app.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});
