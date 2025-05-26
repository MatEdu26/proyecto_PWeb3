const { Database } = require('@sqlitecloud/drivers');

const db = new Database("sqlitecloud://cbrfdfmxnz.g4.sqlite.cloud:8860/Productos?apikey=XbHTwHeUvCdt6RdW0e2xUDo5rY4PKGofeDeYWB2QTFs");

module.exports = db;
