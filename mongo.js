const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@kissa.7tqt1zq.mongodb.net/?appName=kissa`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const get = () => {
  console.log('phonebook')
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close
  })
}

const add = (name, number) => {
  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  add(process.argv[3], process.argv[4])
} else if (process.argv.length === 3) {
  get()
}
