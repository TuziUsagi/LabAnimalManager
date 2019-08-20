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
  'Treatment': string
  'Experiment Schedule': string,
  'Date of Injection': object,
  'Post Injection Day': number
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
  },
  {
    "name": "Treatment",
    "type": "string",
    "friendly_name": "Treatment"
  },
  {
    "name": "Experiment Schedule",
    "type": "string",
    "friendly_name": "Experiment Schedule"
  },
  {
    "name": "Date of Injection",
    "type": "date",
    "friendly_name": "Date of Injection"
  },
  {
    "name": "Post Injection Day",
    "type": "integer",
    "friendly_name": "Post Injection Day"
  }
];
const query:string = "SELECT* FROM (SELECT * FROM MouseProjectList WHERE Project = ? AND Discard = 'False' AND Status = 'Unfinished') AS mouse JOIN (SELECT * FROM MouseGeneralInfo WHERE (Treatment = 'KA_right' OR Treatment = 'KA_left' OR Treatment ='saline_right' OR Treatment ='saline_left') AND DOD IS NULL) AS treatment ON  mouse.Mouse_id = treatment.Mouse_id JOIN (SELECT * FROM CageEarHistory)as tag ON mouse.Mouse_id = tag.Mouse_id";
const listProjectAliveMiceEndPoint = function(req, res, connection):void
{
  connection.connect();
  var project:string = req.query.project;
  connection.query(query, [project], (err, rows, fields) => queryCallback(err, rows, res));
  const queryCallback = function (err, rows, res):void
  {
    var returnRows:returnRow[] = [];
    if(err)
    {
	  connection.end();
      res.status(400).json(err);
      return;
    }
    const now:any = new Date();
    for(var rowCount in rows)
    {
      var row:object = rows[rowCount];
      var singleEntry:returnRow = 
      {
        'Mouse_id': row['Mouse_id'],
        'CageNumber': row['CageNumber'],
        'EarTag': row['EarTag'],
        'Treatment': row['Treatment'],
        'Experiment Schedule': row['Exp_time'],
        'Date of Injection': row['Date_of_Treatment'],
        'Post Injection Day': Math.floor((now - row['Date_of_Treatment'])/1000/3600/24)
      };
      returnRows.push(singleEntry);
    }
	connection.end();
    res.status(200).json({"columns": schema, "rows": returnRows});
  };
};

//module.exports = listProjectAliveMiceEndPoint;
export {listProjectAliveMiceEndPoint};