const fisrt_query:string = "SELECT * FROM (SELECT * FROM MouseProjectList WHERE Project = ? AND Discard = 'False')AS mouse JOIN (SELECT Mouse_id, CageNumber, EarTag FROM CageEarHistory WHERE (? BETWEEN StartTime AND EndTime) OR (EndTime IS NULL))AS tags ON mouse.Mouse_id=tags.Mouse_id JOIN (SELECT Mouse_id, DOB, DOD, Treatment, Date_of_Treatment FROM MouseGeneralInfo WHERE Treatment IS NOT NULL)AS miceInfo ON mouse.Mouse_id = miceInfo.Mouse_id ORDER BY CageNumber, EarTag ASC";
const query_addNewMouse:string = "INSERT IGNORE INTO CycleAndBW (Mouse_id, CycleDate) VALUES (?, ?)";
const initiateDayByProjectEndPoint = function (req, res, connection):void
{
  connection.connect();
  var project:string = req.query.project;
  var thisdate:any = new Date(req.query.thisdate);
  thisdate.setHours(0);
  thisdate.setMinutes(0);
  thisdate.setSeconds(0);
  thisdate.setMilliseconds(0);  
  connection.query(fisrt_query, [project, thisdate], (err, rows, fields) => fisrt_query_callback(err, rows, fields));
  const fisrt_query_callback = function (err, rows, fields):void
  {
    if(err)
    {
	  connection.end();
      res.status(400).json(err);
      return;
    }
    for(var rowCount in rows)
    {
      var MouseID:number = rows[rowCount]['Mouse_id'];
      var DoT:any = rows[rowCount]['Date_of_Treatment'];
      var expTime:string = rows[rowCount]['Exp_time'];
      var dateDeltaInDays:number = (thisdate - DoT)/1000/3600/24;
      var cond1:boolean = (dateDeltaInDays >= 21 && dateDeltaInDays <= 37) || (dateDeltaInDays >= 42 && dateDeltaInDays <= 65 || (dateDeltaInDays >= 154 && dateDeltaInDays <= 180));
      var cond2:boolean = (dateDeltaInDays > 37) && expTime == '1 month';
      var cond3:boolean = (dateDeltaInDays > 65) && expTime == '2 months';
      var cond4:boolean = (dateDeltaInDays > 180) && expTime == '6 months';
      if(cond1 || cond2 || cond3 || cond4)
      {
        connection.query(query_addNewMouse, [MouseID, thisdate], (err, rows, fields) => query_addNewMouse_callback(err));
      }
    }
  };
  const query_addNewMouse_callback = function(err):void
  {
    if(err)
    {
	   connection.end();
       res.status(400).json(err);
       return;
    }
  };
  connection.end();
  res.status(200).json({"columns": [], "rows": []});
};
export{initiateDayByProjectEndPoint};
