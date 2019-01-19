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

## Shopping carts and adding products...
As I was thinking about how I will setup products endpoint while integrating the shopping cart at the same time. I ran into an issue on when/where do I decrement the inventory count?

~~I was conflicted between 2 ways...~~

~~As a customer adds items to their cart, decrement the items inventory cart...~~

~~or~~

~~When they pay and the transaction goes through, then decreament the inventory counter...~~

~~I decided to go with the second choice because the first choice will cause problems because what if they don't pay and the product just stays in the shopping cart and the inventory count would not be acurate.~~

Nevermind, continued to read the google document...

## Another note on shopping carts...

I made the decision to check whether the quantity wanted is less than the quantity that exists in the `complete` API function rather than at `add` function because it makes more sense to give the customer the choice on how much they want...