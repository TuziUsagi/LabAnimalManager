const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const host = '';
const port = '';
const createDBconn = function(host, port)
{
  return mysql.createConnection({host: host, port: port, user: '', password: '', database: ''});
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

import {projectSummaryEndPoint} from './controllers/projectSummary';
app.use("/api/redash/projectsummary", (req, res, next) => {projectSummaryEndPoint(req, res, createDBconn(host, port))});

import {cycleLengthEndPoint} from'./controllers/cycleLength';
app.use("/api/redash/cyclelength", (req, res, next) => cycleLengthEndPoint(res, createDBconn(host, port)));

import {estrousCycleEndPoint} from './controllers/projectEstrousCycle';
app.use("/api/redash/estrouscycle", (req, res, next) => estrousCycleEndPoint(req, res, createDBconn(host, port)));

import {initiateDayByProjectEndPoint} from './controllers/initiateDayByProject';
app.use("/api/redash/initiatedaybyproject", (req, res, next) => initiateDayByProjectEndPoint(req, res, createDBconn(host, port)));

import {miceForAddByProjectEndPoint} from './controllers/miceForAddByProject';
app.use("/api/redash/miceforaddbyproject", (req, res, next) => miceForAddByProjectEndPoint(req, res, createDBconn(host, port)));

import {listProjectMouseEndPoint} from './controllers/listProjectMouse';
app.use("/api/redash/listprojectmouse", (req, res, next) => listProjectMouseEndPoint(req, res, createDBconn(host, port)));

import {assignExperimentEndPoint} from './controllers/assignExperiment';
app.use("/api/redash/assignexperiment", (req, res, next) => assignExperimentEndPoint(req, res, createDBconn(host, port)));

import {listProjectAliveMiceEndPoint} from './controllers/listProjectAliveMice';
app.use("/api/redash/listallprojectalivemice", (req, res, next) => listProjectAliveMiceEndPoint(req, res, createDBconn(host, port)));

import {listProjectCeasedMiceEndPoint} from './controllers/listProjectCeasedMice';
app.use("/api/redash/listallprojectceasedmice", (req, res, next) => listProjectCeasedMiceEndPoint(req, res, createDBconn(host, port)));

import {listAliveMiceEndPoint} from './controllers/listAliveMice';
app.use("/api/redash/listalivemice", (req, res, next) => listAliveMiceEndPoint(req, res, createDBconn(host, port)));

import {listCeasedMiceEndPoint} from './controllers/listCeasedMice';
app.use("/api/redash/listceasedmice", (req, res, next) => listCeasedMiceEndPoint(req, res, createDBconn(host, port)));

import {insertMouseGeneralInfoEndPoint} from './controllers/insertMouseGeneralInfo';
app.use("/api/redash/insertmousegeneralinfo", (req, res, next) => insertMouseGeneralInfoEndPoint(req, res, createDBconn(host, port)));

import {changeMouseTagEndPoint} from './controllers/changeMouseTag';
app.use("/api/redash/changemousetag", (req, res, next) => changeMouseTagEndPoint(req, res, createDBconn(host, port)));

import {updateTreatmentEndPoint} from './controllers/updateTreatment';
app.use("/api/redash/updatetreament", (req, res, next) => updateTreatmentEndPoint(req, res, createDBconn(host, port)));

import {updateCeasedEndPoint} from './controllers/updateCeased';
app.use("/api/redash/updateceased", (req, res, next) => updateCeasedEndPoint(req, res, createDBconn(host, port)));

app.use("**", (req, res, next) => res.status(500).send('err'));
//module.exports.app = app;
//module.exports.dbconn = connection;
export {app};
