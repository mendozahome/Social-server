require('dotenv').config()

const username = process.env.NAMEH;
const password = process.env.PASSWORDH;
const database =  process.env.DATABASEH;
const host = process.env.HOSTH;
const node_env = process.env.NODE_ENVH;


const config = {
  dev:{
    db:{
      username,
      password,
      database,
      host
    }
  },
  test: {
    db:{
      username,
      password,
      database,
      host
  }
},
  prod:{
    db:{
      username,
      password,
      database,
      host
  }
}
}


module.exports = config[node_env];