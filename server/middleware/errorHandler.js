const {logEvents} =require('./logger')

const errorHnadler =(err,req,res,next)=>{
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode:500 //server error

    res.status(status)

    res.json({msg:err.message})
}

module.exports =errorHnadler