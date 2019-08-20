const query_check:string = "SELECT COUNT(*) AS NUM FROM CageEarHistory WHERE (CageNumber, EarTag)=(?,?)";
const query_mouseGeneralInfo:string = "INSERT INTO MouseGeneralInfo (DOB,Sex,genotype) VALUES (?, ?, ?)";
const query_cageAndEar:string = "INSERT INTO CageEarHistory (Mouse_id, CageNumber, EarTag, StartTime) VALUES ((SELECT MAX(Mouse_id) AS mouseID FROM MouseGeneralInfo), ?, ?, ?)";
const emptyMsg:object = {"columns": [], "rows": []};
const insertMouseGeneralInfoEndPoint = function(req, res, connection):void
{
  connection.connect();
  var cage:string = req.query.cage;
  var eartag:string = req.query.eartag;
  var dob:object = new Date(req.query.dob);
  var sex:string =  req.query.sex;
  var genome:string = req.query.genome;
  connection.query(query_check, [cage, eartag], (err, rows, fields) => query_check_Callback(err, rows));
  const query_check_Callback = function (err, rows):void
  {
    if(err)
    {
      res.status(400).json(err);
      return;
    }
    if(rows.length > 0)
    {
      if(rows[0]['NUM'] == 0)
      {
        connection.beginTransaction((err) => trans_Callback(err));
      }
      else
      {
        res.status(400).send('Duplicates!');
      }
    }
    else
    {
      res.status(400).send('Insert failed, unknown error.');
    }
  };
  const trans_Callback = function(err):void
  {
    if(err)
    {
      res.status(400).json(err);
      return;
    }
    connection.query(query_mouseGeneralInfo, [dob, sex, genome], (err, rows, fields) => query_mouseGeneralInf_Callback(err));
  };
  const query_mouseGeneralInf_Callback = function (err):void
  {
    if(err)
    {
      connection.rollback(rollback_callback);
      res.status(400).json(err);
      return;
    }
    connection.query(query_cageAndEar, [cage, eartag, dob], (err, rows, fields) =>query_cageAndEar_Callback(err));
  };
  const query_cageAndEar_Callback = function (err):void
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
export {insertMouseGeneralInfoEndPoint};