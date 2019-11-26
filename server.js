let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')


app.set('view engine', 'ejs')



app.use('/assets',express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({

    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure:false }

}))


app.use(require('./middlewares/flash'))

app.get('/', (request, response)=>{

    let Message = require('./models/message')
    Message.all((messages)=>{

        response.render('pages/index', {messages:messages})
    })
    
})


app.post('/', (request, response)=>{
    if (request.body.message === undefined || request.body.message === '') {
        request.flash('error', "Vous n'avez pas posté de message")
        response.redirect('/')
    }
    else{
        let Message = require('./models/message')
        Message.create(request.body.message, function() {
            request.flash('success', "Merci")
            response.redirect('/')
        })
    }
})


app.get('/messages/:id',(request,response)=>{
    let Message = require('./models/message')
    Message.find(request.params.id,(message)=>{
        response.render('messages/show',{message: message})
    })
})


app.listen(8080)