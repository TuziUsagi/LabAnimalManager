interface returnCol
{
  'name': string,
  'type': string,
  'friendly_name': string
}
interface returnRow
{
  'Mouse_id': string,
  'CageNumber': number,
  'EarTag': string,
  'DOB': object,
  'Sex': string,
  'Genotype': string,
  'Treatment': string,
  'Date_of_Treatment': object,
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
    "name": "DOB",
    "type": "date",
    "friendly_name": "DOB"
  },
  {
    "name": "Sex",
    "type": "string",
    "friendly_name": "Sex"
  },
  {
    "name": "Genotype",
    "type": "string",
    "friendly_name": "Geno_type"
  },
  {
    "name": "Treatment",
    "type": "string",
    "friendly_name": "Treatment"
  },
  {
    "name": "Date_of_Treatment",
    "type": "date",
    "friendly_name": "Date_of_Treatment"
  }
];

const query: string = "SELECT * FROM (SELECT * FROM MouseGeneralInfo) AS info JOIN (SELECT Mouse_id, CageNumber, EarTag FROM CageEarHistory WHERE EndTime IS NULL)as tag ON info.Mouse_id = tag.Mouse_id ORDER BY info.Mouse_id DESC";
const listAliveMiceEndPoint = function(req, res, connection):void
{
  connection.connect();
  var project = req.query.project;
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
    for(var rowCount in rows)
    {
      var row:object = rows[rowCount];
      var singleEntry:returnRow = 
      {
        'Mouse_id': row['Mouse_id'],
        'CageNumber': row['CageNumber'],
        'EarTag': row['EarTag'],
        'DOB': row['DOB'],
        'Sex': row['Sex'],
        'Genotype': row['genotype'],
        'Treatment': row['Treatment'],
        'Date_of_Treatment': row['Date_of_Treatment']
      };
      returnRows.push(singleEntry);
    }
    const posts:object = {"columns": schema, "rows": returnRows};
	connection.end();
    res.status(200).json(posts);
  };
}
export {listAliveMiceEndPoint};