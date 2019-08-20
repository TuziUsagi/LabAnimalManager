interface returnCol
{
  'name': string,
  'type': string,
  'friendly_name': string
}
interface returnRow
{
  'Mouse_id': number,
  'CageNumber': number,
  'EarTag':string
}
const schema:returnCol[] = 
[
  {
    "name": "MouseID",
    "type": "integer",
    "friendly_name": "MouseID"
  },
  {
    "name": "CageNumber",
    "type": "float",
    "friendly_name": "Cage Number"
  },
  {
    "name": "EarTag",
    "type": "float",
    "friendly_name": "Ear Tag"
  }
];
const firstQuery:string = "SELECT ID.Mouse_id, tag.CageNumber, tag.EarTag FROM (SELECT Mouse_id, CycleStage FROM CycleAndBW WHERE CycleDate = ? AND CycleStage IS NULL) AS ID JOIN (SELECT Mouse_id, Project FROM MouseProjectList WHERE Project = ?) AS mice ON ID.Mouse_id = mice.Mouse_id JOIN (SELECT Mouse_id, CageNumber, EarTag FROM CageEarHistory WHERE EndTime >= ? OR EndTime IS NULL AND StartTime < ?) AS tag ON ID.Mouse_id = tag.Mouse_id ORDER BY CageNumber, EarTag ASC";
const secondQuery:string = "UPDATE CycleAndBW SET CycleStage = ?, BodyWeight = ?, ImageAvailability = ?  WHERE Mouse_id = ? AND CycleDate = ?";
const miceForAddByProjectEndPoint = function (req, res, connection):void
{
  connection.connect();
  var Mode:string = req.query.Mode;
  var thisdate:object = new Date(req.query.thisdate);
  var cycleStage:string = req.query.cycleStage;
  var bodyWeight:string = req.query.bodyWeight;
  var project:string = req.query.project;
  connection.query(firstQuery, [thisdate, project, thisdate, thisdate], (err, rows, fields) => firstQuery_callback(err, rows));
  const firstQuery_callback = function (err, rows):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    if(Mode == 'Display')
    {
      var returnRows:returnRow[] = [];
      for(var rowCount in rows)
      {
        var row:object = rows[rowCount];
        returnRows.push({'Mouse_id': row['Mouse_id'], 'CageNumber': row['CageNumber'], 'EarTag': row['EarTag']});
      }
      connection.end();
      res.status(200).json({"columns": schema, "rows": returnRows});
      return;
    }
    else if(Mode == 'Input' && rows.length > 0)
    {
      connection.query(secondQuery, [cycleStage, bodyWeight, 'FALSE', rows[0]['Mouse_ID'], thisdate], (err, rows, fields) => secondQuery_callback(err));
    }
    else
    {
      connection.end();
      res.status(500).json('Error!');
    }
  };
  const secondQuery_callback = function(err):void
  {
    if(err)
    {
       connection.end();
       res.status(400).json(err);
       return;
    }
    Mode = 'Display';
    connection.query(firstQuery, [thisdate, project, thisdate, thisdate], (err, rows, fields) => firstQuery_callback(err, rows));
    return;
  };
};

export {miceForAddByProjectEndPoint};
