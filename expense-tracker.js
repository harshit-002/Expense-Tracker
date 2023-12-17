const express = require('express')
const TelegramBot = require('node-telegram-bot-api')
const bodyParser = require('body-parser')
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri =process.env.URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

client.connect()
console.log('Connected to MongoDB')

const db = client.db()
const expenseCollection = db.collection('expenseCollection')
var currCategory

const app = express()
const port = process.env.PORT || 3000

const botToken = '6903905891:AAGYELUf_SQSBgoUcbps6-P3pK_Ks4ir65Q'
const bot = new TelegramBot(botToken, { polling: true })

const userExpense = {}
var totalExpense = 0
var budgetLimt = 0

app.use(bodyParser.json())
bot.onText(/\/totalExpense/,msg=>{
    const  chatId=msg.chat.id
    bot.sendMessage(chatId,'Click below to see all expenses: ',{
    reply_markup: {
        inline_keyboard: [
          [{ text: 'View Total Expense', callback_data: 'view-details' }],
        ]
    }})
})
bot.onText(/\/logExpense/, msg => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Choose an expense category:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🍛Food', callback_data: 'food' }],
        [{ text: '🚅Transportation', callback_data: 'transportation' }],
        [{ text: 'Miscellaneous', callback_data: 'misc' }]
      ]
    }
  })
})
bot.onText(/\/reset/,async msg=>{
    const chatId=msg.chat.id
    try{
    const data=await expenseCollection.updateMany({},{$set:{'total_exp':0}})
    if(data) console.log('Reset');
    bot.sendMessage(chatId,'All Expenses set to 0 ✅. Press /start to manage your expenses')
    }catch(e){
        console.error(e);
    }
})
//Handling the callback queries
var category = 'misc'
bot.on('callback_query', async query => {
  // console.log(query)
  const chatId = query.message.chat.id
  const userId = query.from.id

  if(query.data!=='view-details'){
  category = query.data
  bot.sendMessage(chatId, 'Enter the expense amount for ' + category + ' : ')
  }
  if(query.data==='view-details'){
    const data = await expenseCollection.find().toArray()
    
    await bot.sendMessage(chatId,'💰 Your total expenses : '+ data[0].total_exp+'$')
    await bot.sendMessage(chatId,'💰 Your total expenses for Food : '+ data[1].total_exp+'$')
    await bot.sendMessage(chatId,'💰 Your total expenses for Transportation : '+ data[2].total_exp+'$')
    await bot.sendMessage(chatId,'💰 Your total expenses for Miscellaneous : '+ data[3].total_exp+'$')
  }
})

bot.on('message',async msg => {
  const chatId = msg.chat.id
  const userId = msg.from.id
  const Text = msg.text
  console.log(Text)

  var amount = extractValue(Text)
  if (amount !== null) {
    currCategory =await expenseCollection.findOne({ 'category': category })

    let newCategoryamount = currCategory.total_exp +  amount
    const doc=await expenseCollection.findOne({'_id':1})

    let newTotalamount=doc.total_exp + amount
    await expenseCollection.updateOne({'_id':1}, {$set :{'total_exp':newTotalamount}})
    
    
    const filter = { category: category }
    // Specifying the update operation
    const update = {
      $set: {
        total_exp: newCategoryamount
      }
    }
    const success = updateDoc(filter, update)

    if (success) {
      bot.sendMessage(chatId, `Expense Logged for ${category}`)
    } else {
      bot.sendMessage(chatId, 'Error in Logging Expense')
    }
  }
})

bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id
  bot.sendMessage(
    chatId,
    'Welcome to the Expense Tracker Bot! Log your expenses to the respective categories by entering /logExpense. View all your expenses by writing /totalExpense "'
  )
})

app.listen(port, () => {
  console.log('Running on port' + port)
})

function extractValue (str) {
  const match = str.match(/\d+(\.\d+)?/)
  if (match) {
    return parseFloat(match[0])
  } else return null
}

async function updateDoc (filter, update) {
  try {
    const result = await expenseCollection.updateOne(filter, update)
    if (result.modifiedCount === 1) {
      return true
    } else return false
  } catch (e) {
    console.log('Error updating expense')
    return false
  }
}
