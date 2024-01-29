const { mongoose } = require('mongoose')

const stockSchema = new mongoose.Schema({
  code: String,
  likes: { type: [String], default: [] }
})
const Stock = mongoose.model('stock', stockSchema)

const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    Stock.deleteMany({})

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { Stock,connectDB }