const firstQuery:string = "SELECT Mouse_id AS ID FROM CageEarHistory  WHERE (CageNumber, EarTag)=(?, ?)";
const secondQuery:string = "INSERT INTO MouseProjectList (Mouse_id, Exp_time, Project) VALUES(?, ?, ?)";
const assignExperimentEndPoint = function (req, res, connection):void
{
  var project:string = req.query.project;
  var cage:string = req.query.cage;
  var exptime:string = req.query.exptime;
  var eartag:string = req.query.eartag;
  connection.connect();
  connection.query(firstQuery, [cage, eartag], (err, rows,fields) => firstQuery_callback(err, rows, connection));
  const firstQuery_callback = function (err, rows, connection):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    if(rows.length == 1)
    {
      var mouseID:number = rows[0]['ID'];
    }
    else
    {
	  connection.end();
      res.status(400).send('Mouse ID not found');
      return;
    }
    connection.query(secondQuery, [mouseID, exptime, project], (err, rows,fields) => secondQuery_callback(err));
  };
  const secondQuery_callback = function(err):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    connection.end();
    res.status(200).json({"columns": [], "rows": []});
  };
};
export{assignExperimentEndPoint};
