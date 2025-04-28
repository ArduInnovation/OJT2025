eto edited -- > naka postgres nadin https://drive.google.com/file/d/1xfzNrjvak4uPxq7x2rXnEY0D-dggzeFS/view?usp=sharing

step 0 install this,

https://drive.google.com/file/d/1Zbc3xxaBLxuf6FW8KHlliVdX73lUUqQo/view?usp=sharing
https://drive.google.com/file/d/1OkLAVw00BaHhoR8j35eGGpN7at7q6rEa/view?usp=sharing
follow tutorial for sure here is the video tutorial, sqllite --> postgress https://youtu.be/ZgRkGfoy2nE?si=i5n9jsLYdTJt_LvA

step 1 - pip install psycopg2 
        - make sure python ver is 3.11

step 2 - python manage.py dumpdata > datadump.json
(exports the data from your PostgreSQL database to a JSON file) -- make sure it is utf-8 the encoding

step 3 - python manage.py migrate --run-syncdb 
(creates the necessary tables and data structures in the new PostgreSQL database)

step 4 - python manage.py loaddata datadump.json 
(imports the data from the JSON file into the new PostgreSQL database)

here is the video tutorial, sqllite --> postgress https://youtu.be/ZgRkGfoy2nE?si=i5n9jsLYdTJt_LvA
