const { mean, std, pow} = require('mathjs');

interface returnCol
{
  'name': string,
  'type': string,
  'friendly_name': string
}
interface returnRow
{
  'Group': string,
  'Cycle Length': number,
  'se':number,
  'Time':string
};
const schema:returnCol[] = 
[
  {
    "name": "Group",
    "type": "string",
    "friendly_name": "Group"
  },
  {
    "name": "Cycle Length",
    "type": "string",
    "friendly_name": "Cycle Length"
  },
  {
    "name": "se",
    "type": "float",
    "friendly_name": "se"
  },
  {
    "name": "Time",
    "type": "string",
    "friendly_name": "Time"
  }
];
const query:string = "SELECT length.Mouse_id, Treatment, Period, AveCycleLength FROM (SELECT * FROM cycleLength WHERE AveCycleLength IS NOT NULL AND AveCycleLength !=0) AS length JOIN (SELECT Mouse_id, Treatment FROM MouseGeneralInfo) AS treatment WHERE length.Mouse_id = treatment.Mouse_id;";
const cycleLengthEndPoint = function (res, connection):void
{
  connection.connect();
  connection.query(query, (err, rows, fields) => query_callback(err, rows));
  const query_callback = function (err, rows):void
  {
    if(err)
    {
	  connection.end();
      res.status(400).json(err);
      return;
    }
    var returnRows:returnRow[] = [];
    var stats:object = {};
    for(var rowCount in rows)
    {
      var row:number = rows[rowCount];
      var group:string = row['Treatment'] + ' month ' + row['Period'].toString();
      if(!(group in stats))
      {
        stats[group] = {'count': 1, 'Period': row['Period'].toString(), 'avgCycle': []};
        stats[group]['avgCycle'].push(row['AveCycleLength']);
      }
      else
      {
        stats[group]['count'] = stats[group]['count'] + 1;
        stats[group]['avgCycle'].push(row['AveCycleLength']);
      }
    }
    for(var singleGroup in stats)
    {
      var thisMean:number = mean(stats[singleGroup]['avgCycle']);
      var thisSTD:number= std(stats[singleGroup]['avgCycle']);
      var thisSE:number = thisSTD/pow(stats[singleGroup]['count'], 0.5);
      var Time:string = stats[singleGroup]['Period'];
      returnRows.push({'Group': singleGroup, 'Cycle Length': thisMean, 'se': thisSE, 'Time': Time})
    }
	connection.end();
    const posts = {"columns": schema, "rows": returnRows};
    res.status(200).json(posts);
  };
};
export {cycleLengthEndPoint};