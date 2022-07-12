//LOCAL
const corsAllow = ["http://127.0.0.1:8080", "http://localhost:8080"];
const port = 8080 || process.env.PORT;
const herokuToken = "fcfb1a54-486e-42a1-a58a-666c2d765c39";

module.exports = {
  port,
  corsAllow,
  herokuToken,
};
