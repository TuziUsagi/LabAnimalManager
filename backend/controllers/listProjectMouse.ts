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
  'EarTag':string,
  'Date of Injection': Object,
  'Days past Injection': Number,
  'Comment': string
}
const schema:returnCol[] = 
[
  {
    "name": "Mouse_id",
    "type": "integer",
    "friendly_name": "Mouse_id"
  },
  {
    "name": "CageNumber",
    "type": "float",
    "friendly_name": "Cage Number"
  },
  {
    "name": "EarTag",
    "type": "string",
    "friendly_name": "EarTag"
  }
];
const query:string = "SELECT* FROM (SELECT * FROM MouseProjectList WHERE Project = ? AND Discard = 'False') AS mouse JOIN (SELECT * FROM MouseGeneralInfo WHERE (Treatment = 'KA_right' OR Treatment = 'KA_left' OR Treatment ='saline_right' OR Treatment ='saline_left') AND Additional_Treatment IS NULL) AS treatment ON  mouse.Mouse_id = treatment.Mouse_id JOIN (SELECT * FROM CageEarHistory WHERE EndTime IS NULL)as tag ON mouse.Mouse_id = tag.Mouse_id"
const listProjectMouseEndPoint = function (req, res, connection):void
{
  connection.connect();
  var project:string = req.query.project;
  connection.query(query, [project], (err, rows, fields) => query_callback(err, rows));
  const query_callback = function (err, rows):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    var returnRows:returnRow[] = [];
    var now:any = new Date();
    for(var rowCount in rows)
    {
      var row:object = rows[rowCount];
      var DoTinDays:number = (now - row['Date_of_Treatment'])/1000/3600/24;
      var exptime:string = row['Exp_time'];
      if(exptime == '1 month')
      {
        if(DoTinDays >= 34 && DoTinDays <= 42)
	      {
          var record:returnRow = 
          {
            'Mouse_id': row['Mouse_id'],              
            'CageNumber': row['CageNumber'],
            'EarTag': row['EarTag'],
            'Date of Injection': row['Date_of_Treatment'],
            'Days past Injection': Math.floor(DoTinDays),
            'Comment': 'Experiment on 1 month'
          };
          returnRows.push(record);
        }
        else if(DoTinDays > 42)
        {
          var record:returnRow = 
          {
            'Mouse_id': row['Mouse_id'],              
            'CageNumber': row['CageNumber'],
            'EarTag': row['EarTag'],
            'Date of Injection': row['Date_of_Treatment'],
            'Days past Injection': Math.floor(DoTinDays),
            'Comment': 'Experiment post due'
          };
          returnRows.push(record);                 
        }
      }
      if(exptime == '2 months')
      {
        if(DoTinDays >= 65 && DoTinDays <= 70)
        {
          var record:returnRow = 
          {
            'Mouse_id': row['Mouse_id'],              
            'CageNumber': row['CageNumber'],
            'EarTag': row['EarTag'],
            'Date of Injection': row['Date_of_Treatment'],
            'Days past Injection': Math.floor(DoTinDays),
            'Comment': 'Experiment on 2 month'
          };
          returnRows.push(record);
        }
        else if(DoTinDays > 70)
        {
          var record:returnRow = 
          {
            'Mouse_id': row['Mouse_id'],              
            'CageNumber': row['CageNumber'],
            'EarTag': row['EarTag'],
            'Date of Injection': row['Date_of_Treatment'],
            'Days past Injection': Math.floor(DoTinDays),
            'Comment': 'Experiment post due'
          };
          returnRows.push(record);                
        }
      }
      if(exptime == '6 months')
      {
        if(DoTinDays >= 170)
        {
          var record:returnRow = 
          {
            'Mouse_id': row['Mouse_id'],              
            'CageNumber': row['CageNumber'],
            'EarTag': row['EarTag'],
            'Date of Injection': row['Date_of_Treatment'],
            'Days past Injection': Math.floor(DoTinDays),
            'Comment': 'Experiment on 2 month'
          };
          returnRows.push(record);
        }
      }
    }
    connection.end();
    res.status(200).json({"columns": schema, "rows": returnRows});
  };
};
export{listProjectMouseEndPoint};
