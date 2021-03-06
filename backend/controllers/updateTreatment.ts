const query_findmouse = "SELECT Mouse_id AS ID FROM CageEarHistory  WHERE (CageNumber, EarTag)=(?, ?)";
const query_updateEndtime:string = "UPDATE CageEarHistory SET Endtime = ?  WHERE (CageNumber, EarTag) = (?, ?)";
const query_updateTreatment:string = "UPDATE  MouseGeneralInfo SET Treatment=?, Date_of_Treatment=?  WHERE Mouse_id = ?";
const query_addCageEar:string = "INSERT INTO CageEarHistory (Mouse_id, StartTime, CageNumber, EarTag) VALUES (?, ?, ?, ?)";
const emptyMsg:object = {"columns": [], "rows": []};
var mouseID:number;
const updateTreatmentEndPoint= function(req, res, connection):void
{
  connection.connect();
  var treatment:string = req.query.treatment;
  var date:object = new Date(req.query.date); 
  var oldcage:string = req.query.oldcage;
  var newcage:string = req.query.newcage;
  var oldtag:string =  req.query.oldtag;
  var newtag:string = req.query.newtag;
  connection.query(query_findmouse, [oldcage, oldtag], (err, rows, fields) => query_findmouse_Callback(err, rows));
  const query_findmouse_Callback = function (err, rows):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    if(rows.length == 1)
    {
      mouseID = rows[0]['ID'];
      connection.beginTransaction((err) => trans_Callback(err));
    }
    else
    {
      connection.end();
      res.status(400).json('Insert failed');
    }
  };
  const trans_Callback = function(err):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    connection.query(query_updateTreatment, [treatment, date, mouseID], (err, rows, fields) => query_updateTreatment_Callback(err));
  };
  const query_updateTreatment_Callback = function (err):void
  {
    if(err)
    {
      console.log('updateTreatmentERR');
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.query(query_updateEndtime, [date, oldcage, oldtag], (err, rows, fields) => query_updateEndtime_Callback(err));
  };
  const query_updateEndtime_Callback = function (err):void
  {
    if(err)
    {
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.query(query_addCageEar, [mouseID, date, newcage, newtag], (err, rows, fields) => query_addCageEar_callback(err));
  };
  const query_addCageEar_callback = function (err):void
  {
    if(err)
    {
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.commit((err) => commit_Callback(err));
  };
  const commit_Callback = function(err):void
  {
    if(err)
    {
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.end();
    res.status(200).json(emptyMsg);
    return;
  };
  const rollback_callback = function():void
  {
    connection.end();
  };
};
export {updateTreatmentEndPoint};
