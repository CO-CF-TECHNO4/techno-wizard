const MySQL = require('@nano-sql/adapter-mysql').MySQL
const nSQL = require('@nano-sql/core').nSQL
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const useragent = require('express-useragent')
const axios = require('axios')
const crypto = require('crypto')

let debugMode = true
let debugModeIndex
debugModeIndex = 0

let install = false

let wizardRobotID = "=="

let wizardapp = express()
wizardapp.use(bodyParser.urlencoded({extended: true}), cors())
wizardapp.use(useragent.express())
wizardapp.set('trust proxy', true)

let apiKey
let webKey

let renderWarningsCounter
let renderErrorCounter
renderWarningsCounter = 0
renderErrorCounter = 0

function debuggero(type, endpoint, user, reference, mssg, useragent, ip) {
    debugModeIndex++

    let logData = JSON.stringify({
        "type": type,
        "data": "",
        "app": "wizard",
        "url": endpoint,
        "userid": "",
        "username": user,
        "schema": "",
        "reference": reference,
        "message": `${debugModeIndex} ${mssg}`,
        "ua": useragent,
        "ip": ip
    })

    let logConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://loggero.kwtk.tech/?token=',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : logData
    }

    if (install == false) {
        axios.request(logConfig).then((response) => {
            if (debugModeIndex == 1) {
                console.log(`See logs on loggero.kwtk.tech ${JSON.stringify(response.data)}`)
            }
        })
        .catch((error) => {
            console.error(`Loggero can not send payload :: ${error}`)
        })
    }
    else if (install == true) {
        console.log(mssg)
    }
}

function randomGenerator(type) {
    if (type === "keygen") {
        let generated = []
        let counter01
        for (counter01 = 0; counter01 < 5; counter01++) {
            generated.push(`${Math.random().toString(10).substring(2, 6)}`)
        }
        return generated.join('-')
    }
    else if (type === "imageid") {
        return Math.random().toString(10).substring(2, 6)
    }
    else if (type === "token") {
        let generated = []
        let counter02
        for (counter02 = 0; counter02 < 5; counter02++) {
            generated.push(`${Math.random().toString(36).substring(2, 6)}`)
        }
        return generated.join('-')
    }
    else if (type === "personalCode") {
        let generated = []
        let counter03
        for (counter03 = 0; counter03 < 4; counter03++) {
            generated.push(`${Math.random().toString(36).substring(2, 6)}`)
        }
        return generated.join('-')
    }
    else if (type === "uuid") {
        var dt = new Date().getTime()
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0
            dt = Math.floor(dt/16)
            return (c=='x' ? r :(r&0x3|0x8)).toString(16)
        })
        return uuid
    }
    else if (type === "password") {
        let generatePassword = (
                length = 20,
                wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            ) =>
            Array.from(crypto.randomFillSync(new Uint32Array(length)))
                .map((x) => wishlist[x % wishlist.length])
                .join('')
        return generatePassword()
    }
}


function installDBInitDB() {
    nSQL().connect({
        id: "main",
        mode: new MySQL({
            host: "localhost",
            database: "",
            user: "",
            password: ""
        }),
        tables: [
                {
                    name: "system",
                    model: {
                        "id:uuid": {pk: true},
                        "dbstatus:string": {},
                        "developer:string": {},
                        "company:string": {},
                        "link:string": {},
                        "email:string": {},
                        "apiKey:string": {},
                        "webKey:string": {}
                    }
                },
                {
                    name: "users",
                    model: {
                        "id:uuid": {pk: true},
                        "joomlaID:int": {},
                        "status:string": {},
                        "role:string": {},
                        "userPublicAddress:string": {},
                        "userSecret:string": {},
                        "firstName:string": {},
                        "lastName:string": {},
                        "email:string": {},
                        "avatar:string": {},
                        "complaints:string": {},
                        "phone1:string": {},
                        "phone2:string": {},
                        "social:string": {}
                    }
                },
                {
                    name: "messages",
                    model: {
                        "id:uuid": {pk: true},
                        "messageComplaints:string": {},
                        "messageTimestamp:string": {},
                        "messageFrom:string": {},
                        "messageTo:string": {},
                        "messageData:string": {},
                        "messageAttachment:string": {},
                    }
                },
                {
                    name: "friends",
                    model: {
                        "id:uuid": {pk: true},
                        "friendshipTimestamp:string": {},
                        "friendshipOne:string": {},
                        "friendshipTwo:string": {},
                    }
                },
                {
                    name: "projects",
                    model: {
                        "id:uuid": {pk: true},
                        "git:string": {},
                        "version:string": {},
                        "ownerID:string": {},
                        "basedOnID:string": {},
                        "status:string": {},
                        "complaints:string": {},
                        "timestamp:string": {},
                        "filetype:string":{},
                        "filename:string": {},
                        "data:string": {},
                    }
                },
            ]
    }).then(function() {
        if (install == true) {
            debuggero("info", "", "system", "INSTALLER", `WARNING!!! Installation mode activated.`, "", "")
            debuggero("info", "", "system", "INSTALLER", `Waiting: 5.`, "", "")
            setTimeout(function() {debuggero("info", "", "system", "INSTALLER", `Waiting: 4.`, "", "")}, 1000)
            setTimeout(function() {debuggero("info", "", "system", "INSTALLER", `Waiting: 3.`, "", "")}, 2000)
            setTimeout(function() {debuggero("info", "", "system", "INSTALLER", `Waiting: 2.`, "", "")}, 3000)
            setTimeout(function() {debuggero("info", "", "system", "INSTALLER", `Waiting: 1.`, "", "")}, 4000)
            setTimeout(function() {
                nSQL("system").query("upsert", [
                    {
                        dbstatus: "installed", 
                        developer: "MYKOLA BITHOLDEX ZGHURSKYI", 
                        company: "TECHNO4", 
                        link: "https://techno4.online", 
                        email: "mykola@techno4.online",
                        apiKey: randomGenerator("keygen"),
                        webKey: randomGenerator("keygen")
                    }
                ]).exec().then(function(rows) {
                    debuggero("info", "", "system", "INSTALLER", `Database installed.
                        Status: ${rows[0].dbstatus}.
                        Developer: ${rows[0].developer}.
                        Company: ${rows[0].company}.
                        Link: ${rows[0].link}.
                        E-mail: ${rows[0].email}.
                        API Key: ${rows[0].apiKey}.
                        WEB Key: ${rows[0].webKey}.`, "", "")
                    apiKey = rows[0].apiKey
                    webKey = rows[0].webKey
                })
                nSQL("users").query("upsert", [
                    {
                        joomlaID: 0,
                        status: "active",
                        role: "su",
                        userPublicAddress: randomGenerator("uuid"),
                        userSecret: randomGenerator("password"),
                        firstName: "Mykola Bitholdex",
                        lastName: "Zghurskyi",
                        email: "mykola@techno4.online",
                        avatar: "",
                        complaints: "",
                        phone1: "+380637486470",
                        phone2: "+380938324664",
                        socia: {}
                    }
                ]).exec().then(function(rows) {
                    debuggero("info", "", "system", "INSTALLER", `Super Administrator created.
                        Status: ${rows[0].status}.
                        Role: ${rows[0].role}.
                        First name: ${rows[0].firstName}.
                        Last name: ${rows[0].lastName}.
                        E-mail: ${rows[0].email}.
                        User Public Address: ${rows[0].userPublicAddress}.
                        User Secret: ${rows[0].userSecret}.`, "", "")
                })
            }, 5000)
        }
        else if (install == false) {
            nSQL(`system`).query("select").where(["dbstatus", "=", "installed"]).exec().then((rows) => {
                apiKey = rows[0].apiKey
                webKey = rows[0].webKey
            }).catch(function(error) {
                debuggero("error", "", "system", "STARTINIT", `Get API keys error: ${error}.`, "error")
            })
        }
    }).catch(function(error) {
        debuggero("error", "", "system", "STARTINIT", `Database connection: ${error}.`, "error")
    })
}

installDBInitDB()

// setTimeout(() => {
//     nSQL(`projects`).query("select").exec().then((rows2) => {
//         debuggero("info", "projects", ``, "Projects", ` ${JSON.stringify(rows2)}`, ``, ``)
//     })
// }, 3000)

setTimeout(() => {
    nSQL(`users`).query("select").where([["role","=", "su"], "AND", ["status", "=", "active"]]).exec().then((rows2) => {
        console.log(rows2)
        //debuggero("info", "users", ``, "Users", ` ${JSON.stringify(rows2)}`, ``, ``)
    })
}, 4000)

setTimeout(() => {
    nSQL("users").query("describe").exec().then((rows) => {
        console.log(rows)
        //debuggero("info", "users", ``, "Users", `${JSON.stringify(rows)}`, ``, ``)
    })
}, 5000)

// setTimeout(() => {
//     nSQL("friends").query("select").exec().then((rows) => {
//         console.log(rows)
//         //+debuggero("info", "users", ``, "Users friends", `${JSON.stringify(rows)}`, ``, ``)
//     })
// }, 13000)

function databaseSynchronizer(payload, mode) {
    let dbPayloadUsers = []
    let dbPayloadArticles = []
    let dbPayloadSystemArticles = []
    let dbPayloadNews = []

    function createPayload() {
        dbPayloadUsers.length = 0
        dbPayloadArticles.length = 0
        dbPayloadSystemArticles.length = 0
        dbPayloadNews.length = 0

        let dbCreatePayloadIndex
        for (dbCreatePayloadIndex = 0; dbCreatePayloadIndex < payload.length; dbCreatePayloadIndex++) {
            if (mode === "users") {
                let dbPayloadUsersItemSU = {
                    joomlaID: payload[dbCreatePayloadIndex].attributes.id,
                    status: payload[dbCreatePayloadIndex].attributes.block,
                    role: "su",
                    userPublicAddress: payload[dbCreatePayloadIndex].attributes.userpublicaddress,
                    userSecret: payload[dbCreatePayloadIndex].attributes.usersecret,
                    firstName: payload[dbCreatePayloadIndex].attributes.name,
                    lastName: payload[dbCreatePayloadIndex].attributes.username,
                    email: payload[dbCreatePayloadIndex].attributes.email
                }

                let dbPayloadUsersItemREG = {
                    joomlaID: payload[dbCreatePayloadIndex].attributes.id,
                    status: payload[dbCreatePayloadIndex].attributes.block,
                    role: "regular",
                    userPublicAddress: payload[dbCreatePayloadIndex].attributes.userpublicaddress,
                    userSecret: payload[dbCreatePayloadIndex].attributes.usersecret,
                    firstName: payload[dbCreatePayloadIndex].attributes.name,
                    lastName: payload[dbCreatePayloadIndex].attributes.username,
                    email: payload[dbCreatePayloadIndex].attributes.email
                }

                if (payload[dbCreatePayloadIndex].attributes.group_names === "Super Users" || payload[dbCreatePayloadIndex].attributes.group_names === "Administrator\nSuper Users") {
                    // console.log(dbPayloadUsersItemSU)
                    dbPayloadUsers.push(dbPayloadUsersItemSU)
                }
                else if (payload[dbCreatePayloadIndex].attributes.group_names === "Registered" || payload[dbCreatePayloadIndex].attributes.group_names === "Administrator") {
                    // console.log(dbPayloadUsersItemREG)
                    dbPayloadUsers.push(dbPayloadUsersItemREG)
                }
            }
            // Else if for articles
        }
    }
    createPayload()

    setTimeout(function() {
        debuggero("info", "", "system", "DATABASESYNCHRONIZER", `Users :: ${dbPayloadUsers.length}`, "", "")

        function upsertToDatabase() {
            let upsertToDatabaseIndex
            for (upsertToDatabaseIndex = 0; upsertToDatabaseIndex < dbPayloadUsers.length; upsertToDatabaseIndex++) {
                nSQL(`${mode}`).query("upsert", dbPayloadUsers[upsertToDatabaseIndex]).exec().then((dbPayloadUsers) => {
                    // debuggero("info", "", "system", "DATABASESYNCHRONIZER", `Update DB :: ${JSON.stringify(dbPayloadUsers)}`, "", "")
                })
            }
        }

        upsertToDatabase()
    }, 1000)
}


function syncUsers () {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://techno4.online/api/index.php/v1/users?page%5Boffset%5D=0&page%5Blimit%5D=100000`,
        headers: { 
          'Authorization': `Bearer ${wizardRobotID}`
        }
    };
      
    axios.request(config).then((response) => {
        //console.log(JSON.stringify(response.data))
        databaseSynchronizer(response.data.data, "users")
    })
    .catch((error) => {
        debuggero("error", "", "system", "DATABASEFETCHER(-)", `To Joomla request failure. ${error}`, "", "")
    });
}

function databaseFetcherLoader() {
    if (install == false) {
        setTimeout(function() {
            syncUsers ()
        }, 10000)
        setInterval(function() {
            syncUsers ()
        }, 600000)
    }
    else {
        debuggero("warning", "", "system", "DATABASEFETCHER(-)", `INSTALL MODE. Request skipped.`, "", "")
    }
}

databaseFetcherLoader ()



wizardapp.get('/', function (request, response, next) {
    let payloadSuccess = {
        code: 403,
        message: "Techno Wizard. Access denided. Visit https://techno4.online for more details."
    }

    response.json(payloadSuccess)
})

wizardapp.get('/render/:id?', function (request, response, next) {
    nSQL(`projects`).query("select").where(["id", "=", request.query.id]).exec().then((rows2) => {
        renderWarningsCounter++

        if (rows2.length == 1) {
            debuggero("success", "render", ``, "ENDPOINT", `Requested ${request.query.id} And find ${rows2.length} And type: ${rows2[0].filetype}`, ``, ``)
            if (rows2[0].filetype === "html") {
                response.type('.html')
                response.send(rows2[0].data)
            }
            else if (rows2[0].filetype === "css") {
                response.type('.css')
                response.send(rows2[0].data)
            }
            else if (rows2[0].filetype === "js") {
                response.type('.js')
                response.send(rows2[0].data)
            }
            else {
                renderWarningsCounter++
                debuggero("warning", "open", `${request.body.userPublicAddress}`, "ENDPOINT", `More than ${renderWarningsCounter} 404 notfound.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)

                let renderPayloadError = {
                    code: 404,
                    message: "File type error."
                }
                response.send(renderPayloadError)
            }
        }
        else if (rows2.length == 0) {
            renderErrorCounter++
            debuggero("warning", "render", `${request.body.userPublicAddress}`, "ENDPOINT", `More than ${renderErrorCounter} 404 notfound.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)

            let renderPayloadError = {
                code: 404,
                message: "Project not found."
            }

            response.json(renderPayloadError)
        }
    })
})

wizardapp.post('/login/', function (request, response) {
    debuggero("info", "login", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "login", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length >= 1) {
                debuggero("info", "login", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)

                let payloadSuccess = {
                    code: 200,
                    id: rows[0].id,
                    joomlaID: rows[0].joomlaID,
                    userPublicAddress: rows[0].userPublicAddress,
                    status: rows[0].status,
                    role: rows[0].role,
                    firstName: rows[0].firstName,
                    lastName: rows[0].lastName,
                    email: rows[0].email,
                    avatar: rows[0].avatar,
                    complaints: rows[0].complaints,
                    phone1: rows[0].phone1,
                    phone2: rows[0].phone2,
                    social: rows[0].social
                }
                
                response.json(payloadSuccess)
            }
            else if (rows.length == 0) {
                debuggero("error", "login", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "login", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.post('/create/', function (request, response) {
    debuggero("info", "create", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "create", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length == 1) {
                debuggero("info", "create", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                
                let payload = {
                    status: request.body.status,
                    ownerID: request.body.userPublicAddress,
                    basedOnID: request.body.basedOnID,
                    filetype: request.body.fileType,
                    filename: request.body.fileName,
                    data: request.body.payload
                }

                nSQL(`projects`).query("upsert", payload).exec().then((rows4) => {
                    debuggero("info", "create", `${rows4}`, "ENDPOINT", `${JSON.stringify(rows4)}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                    response.json(rows4)
                })
            }
            else if (rows.length == 0) {
                debuggero("error", "create", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "create", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.get('/open/:id?', function (request, response, next) {
    debuggero("info", "open", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "open", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`projects`).query("select").where(["id", "=", request.query.id]).exec().then((rows2) => {
    
            if (rows2.length == 1) {
                debuggero("success", "open", ``, "ENDPOINT", `Requested ${request.query.id} And find ${rows2.length} And type: ${rows2[0].filetype}`, ``, ``)
                response.json(rows2[0])
            }
            else if (rows2.length == 0) {
                renderErrorCounter++
                debuggero("warning", "open", `${request.body.userPublicAddress}`, "ENDPOINT", `More than ${renderErrorCounter} 404 notfound.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
    
                let renderPayloadError = {
                    code: 404,
                    message: "Project not found."
                }
    
                response.json(renderPayloadError)
            }
        })
    }
    else {
        debuggero("error", "create", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.patch('/create/', function (request, response) {
    debuggero("info", "create:patch", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "create:patch", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length == 1) {
                debuggero("info", "create:patch", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                
                let payload = {
                    status: request.body.status,
                    data: request.body.payload,
                    basedOnID: request.body.basedOnID
                }

                nSQL(`projects`).query("upsert", payload).where(["id", "=", request.body.projectID]).exec().then((rows4) => {
                    debuggero("info", "create:patch", `${rows4}`, "ENDPOINT", `${JSON.stringify(rows4)}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                    response.json(rows4)
                })
            }
            else if (rows.length == 0) {
                debuggero("error", "create:patch", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "create:patch", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.post('/addfriend/', function (request, response) {
    debuggero("info", "addfriend", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "addfriend", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length >= 1) {
                debuggero("info", "addfriend", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                
                let payload = {
                    friendshipTimestamp: new Date(),
                    friendshipOne: request.body.userPublicAddress,
                    friendshipTwo: request.body.friendPublicAddress,
                }

                nSQL(`friends`).query("upsert", payload).exec().then((rows4) => {
                    debuggero("info", "addfriend", `${rows4}`, "ENDPOINT", `${JSON.stringify(rows4)}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                    response.json(rows4)
                })
            }
            else if (rows.length == 0) {
                debuggero("error", "addfriend", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "addfriend", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.post('/friendship/', function (request, response) {
    debuggero("info", "friendship", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "friendship", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length >= 1) {
                debuggero("info", "friendship", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)

                nSQL(`friends`).query("select").where([["friendshipOne", "LIKE", request.body.userPublicAddress], "OR", ["friendshipTwo", "LIKE", request.body.userPublicAddress]]).exec().then((rows4) => {
                    debuggero("info", "friendship", `${rows4}`, "ENDPOINT", `${JSON.stringify(rows4)}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                    response.json(rows4)
                })
            }
            else if (rows.length == 0) {
                debuggero("error", "friendship", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "friendship", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.post('/sendmessage/', function (request, response) {
    debuggero("info", "sendmessage", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
    
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "sendmessage", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
    
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length >= 1) {
                debuggero("info", "sendmessage", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                
                let payload = {
                    messageTimestamp: new Date(),
                    messageFrom: request.body.userPublicAddress,
                    messageTo: request.body.friendPublicAddress,
                    messageData: request.body.messageData,
                }

                nSQL(`messages`).query("upsert", payload).exec().then((rows4) => {
                    debuggero("info", "sendmessage", `${rows4}`, "ENDPOINT", `${JSON.stringify(rows4)}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                    response.json(rows4)
                })
            }
            else if (rows.length == 0) {
                debuggero("error", "sendmessage", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "sendmessage", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.post('/getmessages/', function (request, response) {
    debuggero("info", "getmessages", `${request.body.userPublicAddress}`, "ENDPOINT", `Request :: ${JSON.stringify(request.body)}`,`${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
  
    if (request.body.apiKey === undefined || request.body.userPublicAddress === undefined || request.body.userSecret === undefined) {
        debuggero("error", "getmessages", `${request.body.userPublicAddress}`, "ENDPOINT", `Bad request.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let ordersPayloadError3 = {
            code: 400,
            message: "Bad request."
        }
  
        response.json(ordersPayloadError3)
    }
    else if (request.body.apiKey === apiKey) {
        nSQL(`users`).query("select").where([["userPublicAddress", "=", request.body.userPublicAddress], "AND", ["userSecret", "=", request.body.userSecret]]).exec().then((rows) => {
            if (rows.length >= 1) {
                debuggero("info", "getmessages", `${rows[0].joomlaID}`, "ENDPOINT", `User found. Access granted for :: ${rows[0].firstName} ${rows[0].lastName}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)

                nSQL(`messages`).query("select").where([["messageFrom", "LIKE", request.body.userPublicAddress], "OR", ["messageTo", "LIKE", request.body.userPublicAddress]]).exec().then((rows4) => {
                    debuggero("info", "getmessages", `${rows4}`, "ENDPOINT", `${JSON.stringify(rows4)}`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                    response.json(rows4)
                })
            }
            else if (rows.length == 0) {
                debuggero("error", "getmessages", `${request.body.userPublicAddress}`, "ENDPOINT", `User secret not found. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
                let payloadError1 = {
                    code: 403,
                    message: "Access denided. User Key & User Secret did not mach."
                }
        
                response.json(payloadError1)
            }
        })
    }
    else {
        debuggero("error", "getmessages", `${request.body.userPublicAddress}`, "ENDPOINT", `API KEY did not mach. Access denided.`, `${JSON.stringify(request.useragent.source)}`, `${request.ip}`)
        let payloadError3 = {
            code: 403,
            message: "Access denided. API KEY did not mach."
        }

        response.json(payloadError3)
    }
})

wizardapp.listen(3956, function () {
    debuggero("info", "", `system`, "APP_INIT", `WIZARD HAS STARTED SUCCESSFULLY. :)`, "", "")
})