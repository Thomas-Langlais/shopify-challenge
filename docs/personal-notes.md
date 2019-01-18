switches over to the postgres account

```
sudo -i -u postgres
```

should be able to psql in right away
```
psql
```

# Things I was thinking about...

## How to implement shopping carts
While I was thinking about how I could implement a shopping cart for this barebones marketplace API... I came up with the idea to implement sessions and use that data to hold a shopping cart id ref...
<br></br>
It seems silly but if I had more time I would have made users and a relationship between the user and their respective shopping cart.
<br></br>
For now the sessions will do...