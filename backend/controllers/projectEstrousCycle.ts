interface returnCol
{
  'name': string,
  'type': string,
  'friendly_name': string
}
interface returnRow
{
  'MouseID': number,
  'CageNumber': number,
  'EarTag':string
};
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
const query:string = "SELECT * FROM (SELECT * FROM MouseProjectList WHERE Project = ? AND Discard = 'False')AS mouse JOIN (SELECT Mouse_id, CageNumber, EarTag FROM CageEarHistory WHERE (? BETWEEN StartTime AND EndTime) OR (EndTime IS NULL))AS tags ON mouse.Mouse_id=tags.Mouse_id JOIN (SELECT Mouse_id, DOB, DOD, Treatment, Date_of_Treatment FROM MouseGeneralInfo WHERE Treatment IS NOT NULL)AS miceInfo ON mouse.Mouse_id = miceInfo.Mouse_id ORDER BY CageNumber, EarTag ASC";
const estrousCycleEndPoint = function (req, res, connection):void
{
  connection.connect();
  var project:string = req.query.project;
  var thisdate:any = new Date(req.query.thisdate);
  thisdate.setHours(0);
  thisdate.setMinutes(0);
  thisdate.setSeconds(0);
  thisdate.setMilliseconds(0);  
  connection.query(query, [project, thisdate], (err, rows, fields) => queryFunc(err, rows, fields));
  const queryFunc = function (err, rows, fields):void
  {
    if(err)
    {
       connection.end();
       res.status(400).json(err);
       return;
    }
    var returnRows:returnRow[] = [];
    for(var rowCount in rows)
    {
      var MouseID:number = rows[rowCount]['Mouse_id'];
      var CageNum:number = rows[rowCount]['CageNumber'];
      var EarTag:string = rows[rowCount]['EarTag'];
      var DoT:any = rows[rowCount]['Date_of_Treatment'];
      var expTime:string = rows[rowCount]['Exp_time'];
      var dateDeltaInDays:number = (thisdate - DoT)/1000/3600/24;
      var cond1:boolean = (dateDeltaInDays >= 21 && dateDeltaInDays <= 37) || (dateDeltaInDays >= 42 && dateDeltaInDays <= 65 || (dateDeltaInDays >= 154 && dateDeltaInDays <= 180));
      var cond2:boolean = (dateDeltaInDays > 37) && expTime == '1 month';
      var cond3:boolean = (dateDeltaInDays > 65) && expTime == '2 months';
      var cond4:boolean = (dateDeltaInDays > 180) && expTime == '6 months';
      if(cond1 || cond2 || cond3 || cond4)
      {
        var singleRecord:returnRow = {'MouseID': MouseID, 'CageNumber': CageNum, 'EarTag': EarTag};
        returnRows.push(singleRecord);
      }
    }
	connection.end();
    res.status(200).json({"columns": schema, "rows": returnRows});
  };
};
export{estrousCycleEndPoint};
