interface returnCol
{
  'name': string,
  'type': string,
  'friendly_name': string
}
interface returnRow
{
  'Category': string,
  'saline_right': number,
  'saline_left':number,
  'KA_right':number,
  'KA_left':number
};
const schema:returnCol[] = 
[
  {
    "name": "Category",
    "type": "string",
    "friendly_name": "Category"
  },
  {
    "name": "saline_right",
    "type": "string",
    "friendly_name": "saline_right"
  },
  {
    "name": "saline_left",
    "type": "integer",
    "friendly_name": "saline_left"
  },
  {
    "name": "KA_right",
    "type": "integer",
    "friendly_name": "KA_right"
  },
  {
    "name": "KA_left",
    "type": "integer",
    "friendly_name": "KA_left"
  }
];

const projectSummaryEndPoint = function (req, res, connection):void
{
  connection.connect();
  var project:string = req.query.project;
  var exptime:string = req.query.exptime; 
  const query:string = "SELECT * FROM (SELECT * FROM MouseProjectList WHERE Project = ? AND Discard = 'False'AND Exp_time = ?) AS mouse JOIN (SELECT Mouse_id, Treatment FROM MouseGeneralInfo WHERE (Treatment = 'KA_right' OR Treatment = 'KA_left' OR Treatment ='saline_right' OR Treatment ='saline_left')) AS treatment ON  mouse.Mouse_id = treatment.Mouse_id";
  connection.query(query, [project, exptime], (err, rows, fields) => query_callback(err, rows, res));
  const query_callback = function(err, rows, res):void
  {
    if(err)
    {
      connection.end();
      res.status(400).json(err);
      return;
    }
    var returnRows:returnRow[] = [];
    var saline_right:number = 0;
    var saline_right_fin:number = 0;
    var saline_left:number = 0;
    var saline_left_fin:number = 0;
    var KA_right:number = 0;
    var KA_right_fin:number = 0;
    var KA_left:number = 0;
    var KA_left_fin:number = 0;
    for (var rowCount in rows)
    {
      var record:object = rows[rowCount];
      if(record['Treatment'] == 'saline_right')
      {
        saline_right = saline_right + 1;
        if(record['Status'] == 'Finished')
        {
          saline_right_fin = saline_right_fin + 1
        }
      }
      else if(record['Treatment'] == 'saline_left')
      {
        saline_left = saline_left + 1;
        if(record['Status'] == 'Finished')
        {
          saline_left_fin = saline_left_fin + 1
        }
      }
      else if(record['Treatment'] == 'KA_right')
      {
        KA_right = KA_right + 1;
        if(record['Status'] == 'Finished')
        {
          KA_right_fin = KA_right_fin + 1
        }
      }
      else if(record['Treatment'] == 'KA_left')
      {
        KA_left = KA_left + 1;
        if(record['Status'] == 'Finished')
        {
          KA_left_fin = KA_left_fin + 1
        }
      }
      else{}
    }
    const dataEntry1:returnRow = 
    {
        'Category': "Finished",
        'saline_right': saline_right_fin,
        'saline_left':saline_left_fin,
        'KA_right':KA_right_fin,
        'KA_left': KA_left_fin
    };
    returnRows.push(dataEntry1);
    const dataEntry2:returnRow =
    {
        'Category': "Unfinished",
        'saline_right': saline_right - saline_right_fin,
        'saline_left':saline_left - saline_left_fin,
        'KA_right':KA_right - KA_right_fin,
        'KA_left': KA_left - KA_left_fin
    };
    returnRows.push(dataEntry2);
    const dataEntry3:returnRow =
    {
        'Category': "Additional",
        'saline_right': 15 - saline_right,
        'saline_left':15 - saline_left_fin,
        'KA_right':15 - KA_right_fin,
        'KA_left': 15 - KA_left_fin
    };
    returnRows.push(dataEntry3);
    connection.end();
    res.status(200).json({"columns": schema, "rows": returnRows});
  };
};
export{projectSummaryEndPoint};
