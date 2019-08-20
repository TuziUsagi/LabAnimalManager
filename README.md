##	Introduction

LabAnimalManager is a relational database management system which is developed for planing the daily lab mouse experiment, showing project progress, and visualizing results for my Ph.D. research.  It was used for managing around 300 lab mice which were tested with different drugs, daily monitored, and experimented at multiple time points. The query results from database are presented with Redash, which allows all lab personnel to insert new data, modify existing data, and see the most updated results.

##	Demo server on Google Cloud:
1. URL: https://demo.tuxiong.space
2. Username:demoUser@demo.com 
3. password:demoUserPassword
## 	Required packages
1. Front end: Redash (https://redash.io/)
2. Midware: Express JS
3. Back end: Node JS 12

## 	Function Description

###		Dashboard 1: Mouse Inventory
![DASH11](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/demoSceenshots/Screenshot%20from%202019-01-24%2023-31-35.png)
This dashboard allows viewing all lab mice designated for experiment. It also allows editing mouse information, including the followings:

####			“List All Alive Mice”, “List All Ceased Mice”
Just as the title described.

####			“Add a New Mouse”:
insert proper mouse information with the by typing or selecting from the drop down list. 

####			“Update Treatment Information”:
selecting the type of drug, day of treatment. Each mouse was moved to a new cage after treatment.

####			“Change Mouse Cage and Tag”:
change mouse information when you accidentally put wrong information about it.

####			“Update Ceased:
mark death information for a mouse when he/she is sacrificed.

###		Dashboard 2: Project R03
![DASH21](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/demoSceenshots/Screenshot%20from%202019-01-24%2023-51-23.png)
![DASH22](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/demoSceenshots/Screenshot%20from%202019-01-24%2023-53-03.png)
This dashboard is design to view the information from one of our NIH funded project. The top pie charts shows the progress of the project. This dashboard also provide the following functions:

####			“R03 Mice for Estrous Cycle”:
this function remind me which mice need to be monitored today (the list of mice change frequently).

####			“Start a New Day for R03 Estrous Data”:
To insert our monitor data into the database, select a date to create a list in the database of mice which should have the monitoring data on that day.

####			“Upload estrous cycle and body weight”:
use this function to upload monitoring data into database. There are two modes available. The display mode will show which mice whose data are still empty. The Input mode will put the inserted data into database. The inserted data will go to the mouse shown in the first place of the list. The list will automatically update once new data are inserted.

####			“R03 Mice Ready for Experiment”: 
this function reminds me which mice need to be performed with designed experiment according to their group information.

####			“Assign Experiment Schedule for R03”: 
Put a mouse into the list of mouse for this project.

####			“List All Project Alive Mice”, “List All Project Ceased Mice”:
just as the title described.

###		Dashboard 3: Result Visualization
![Visualization](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/demoSceenshots/Screenshot%20from%202019-01-25%2000-12-17.png)
This dashboard display the our result from each treatment group (saline, KA) X each experiment time (1 month, 2 months, 3 months). Since our database contained unpublished data, I only put one graph with limited data for the purpose of demonstration.

 
##	Database Design:

###		Tables:
The database contains following tables:
![tables](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-16-38.png)

The following tables are using in the demonstration:

####			table MouseGeneralInfo:
This table contains all the basic information about a mouse, e.g. date of birth, date of death, sex, which drug treatment it received et cetera.
![MouseGeneralInfo](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-22-02.png)

####			table CageEarHistory:
During experiment, mice are identified with cage number and ear tag. A mouse may have multiple cage numbers and ear tags in her life since they are moved to new cage after drug treatment or surgery. This table track all the cage number and ear tag information with a given mouse. 
![CageEarHistory](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-23-49.png)

####			table CycleAndBW:
This table stores the daily monitoring data (estrous cycle, body weight)
![CycleAndBW](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-24-58.png)

####			table MouseProjectList: 
This table stores which mouse belongs to which research project. It also stores the experiment schedule, whether the experiment has been conducted for, and whether this mouse should be included in the final dataset.
![MouseProjectList](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-29-01.png)

####			table cycleLength:
This table stores the calculated average cycle length data for each mouse at different time point. The demonstration for results visualization is supported by this table.

![cycleLength](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-29-57.png)

##
the following tables are not presented in the demonstration due to the ethical consideration of mouse research

####			table LoosePatch: stores patch clamp recording data
![LoosePatch](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-28-23.png)

####			table EEGinfo: stores EEG recording information
![EEGinfo](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2022-02-39.png)

####			table EstrousCycle: Archived
![EstrousCycle](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/table_screenshots/Screenshot%20from%202019-01-25%2021-26-59.png)

###		ERD
![Visualization](https://raw.githubusercontent.com/TuziUsagi/LabAnimalManager/master/Database_design/ERDmousedb.png)

