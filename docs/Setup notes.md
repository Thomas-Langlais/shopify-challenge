# How I setup the database

To preface, if I had more time, I would have made a bash script that would have done the installing on its own.

This setup will only work for unix based systems, im sorry if you are using windows - you are on your own on this one.

first

```
sudo apt-get update
sudo apt-get install postgresql
```

Then create the user as followed

```
sudo -u postgres createuser --interactive

Output
Enter name of role to add: thomas
Shall the new role be a superuser? (y/n) y
```

Then create the database

```
sudo -u postgres createdb thomas
```

Then create a user on your box
```
sudo adduser thomas
```

Then run the setup scripts
```
psql -a -f scripts/setup.sql
psql -a -f scripts/schemas.sql
```

If you want to run my tests then install newman
```
npm install newman
```

and run these commands in seperate terminals
```
npm start
newman run tests/test-suite.json
```