const query_findmouse = "SELECT Mouse_id AS ID FROM CageEarHistory  WHERE (CageNumber, EarTag)=(?, ?)";
const query_Ceased:string = "UPDATE MouseGeneralInfo SET DOD = ?, Reason_for_Death = ? WHERE Mouse_id = ?";
const query_updateEndTime:string = "UPDATE CageEarHistory SET EndTime = ? WHERE Mouse_id = ? AND EndTime IS NULL AND CageNumber = ? AND EarTag = ?";
const query_updateStatus:string = "UPDATE MouseProjectList SET Status = 'Finished' WHERE Mouse_id = ?";
const emptyMsg:object = {"columns": [], "rows": []};
var mouseID:number;
const updateCeasedEndPoint= function(req, res, connection):void
{
  connection.connect();
  var reason:string = req.query.reason;
  var date:object = new Date(req.query.date); 
  var cage:string = req.query.cage;
  var eartag:string =  req.query.eartag;
  connection.query(query_findmouse, [cage, eartag], (err, rows, fields) => query_findmouse_Callback(err, rows));
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
    connection.query(query_Ceased, [date, reason, mouseID], (err, rows, fields) => query_Ceased_Callback(err));
  };
  const query_Ceased_Callback = function (err):void
  {
    if(err)
    {
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.query(query_updateEndTime, [date, mouseID, cage, eartag], (err, rows, fields) => query_updateEndtime_Callback(err));
  };
  const query_updateEndtime_Callback = function (err):void
  {
    if(err)
    {
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.query(query_updateStatus, [mouseID], (err, rows, fields) => query_updateStatus_callback(err));
  };
  const query_updateStatus_callback = function (err):void
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
export {updateCeasedEndPoint};
