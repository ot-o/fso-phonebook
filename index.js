require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
app.use(morgan('tiny'))

app.get('/api/persons', (_request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.sendStatus(404)
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.sendStatus(404)
    }

    person.name = name
    person.number = number
    // person.validate();
    return person
      .save()
      .then((updatedPerson) => response.json(updatedPerson))
      .catch((error) => next(error))
  })
})

app.get('/info', (_request, response, next) => {
  const date = new Date()
  if (date === undefined) {
    return response.sendStatus(500)
  }
  Person.find({})
    .then((persons) => {
      response.write(`<p>Phonebook has info for ${persons.length} people<p>`)
      response.write(date.toString())
      response.end()
    })
    .catch((error) => next(error))
})

morgan.token('body', (reg) => JSON.stringify(reg.body))
app.use(morgan(':body'))

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error))
})

const errorHandler = (error, _request, response, next) => {
  console.log('kissa')
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(errorHandler)
