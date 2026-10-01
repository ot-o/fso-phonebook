const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));
app.use(cors());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((p) => p.id === request.params.id);
  if (person) {
    response.json(person);
  } else response.sendStatus(404);
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((p) => p.id !== request.params.id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  date = new Date();
  response.write(`<p>Phonebook has info for ${persons.length} people<p>`);
  response.write(date.toString());
  response.end();
});

morgan.token("body", (reg) => JSON.stringify(reg.body));
app.use(morgan(":body"));

app.post("/api/persons", (request, response) => {
  body = request.body;

  if (!body.number || !body.name || persons.find((p) => p.name === body.name)) {
    return response
      .status(400)
      .end("error: Person has missing fields or is already in the book");
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000) + "",
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
