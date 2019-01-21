# API spec

Route | Method
--- | ---
[api/products](#prod1) | `GET`
[api/products/:prod_id](#prod2) | `GET`
[api/shopping-cart/](#sc1) | `GET`
[api/shopping-cart/add](#sc2) | `PATCH`
[api/shopping-cart/remove](#sc3) | `PATCH`
[api/shopping-cart/:prod_id/quantity](#sc5) | `PUT`
[api/shopping-cart/complete](#sc4) | `POST`


## <a name="prod1"></a> GET api/products
This endpoint will fetch all the product data from the database and can filter out all non-available products

url params
name | type | description
--- | --- | ---
allAvailable | `boolean` | This param will filter all products that do not have any inventory left.

### Response

```json
{
    [
        {
            "product_id": "72326fd4-a0a2-4985-bf80-11e97ae1445b",
            "title": "bar",
            "price": 10.99,
            "inventory_count": 1
        },
        {...}
    ]
}
```

Response Codes | Reason
--- | ---
200 | Successfully fetched the list of products
500 | A general error handling server code

## <a name="prod2"></a> GET api/products/:prod_id
This endpoint will fetch the product data that has the Guid from the URI

uri params
name | type | description
--- | --- | ---
prod_id | `guid` | This param is the unique identifier for the product. 

### Response

```json
{
    "product_id": "72326fd4-a0a2-4985-bf80-11e97ae1445b",
    "title": "bar",
    "price": 10.99,
    "inventory_count": 1
}
```

Response Codes | Reason
--- | ---
200 | Successfully fetched the product with the prod_id
404 | Could not find the product with the prod_id given
500 | A general error handling server code

## <a name="sc1"></a> GET api/shopping-cart/
This endpoint will fetch the session based shopping cart and give the results of the search

### Response

```json
{
    "products": [
        {
            "product_id": "72326fd4-a0a2-4985-bf80-11e97ae1445b",
            "title": "An item",
            "price": 10.99,
            "quantity": 1
        },
        {...}
    ],
    "total": 10.99
}
```

Response Codes | Reason
--- | ---
200 | Successufly fetched the shopping cart
500 | A general error handling server code

## <a name="sc2"></a> PATCH api/shopping-cart/add
This endpoint exposes the session based shopping cart and add the products and the quantities that the user wishes to purchase.

### Request body

```json
[
    {
        "product_id": "72326fd4-a0a2-4985-bf80-11e97ae1445b",
        "quantity": 1
    },
    {...}
]
```

Response Codes | Reason
--- | ---
204 | Successufly added the items the shopping cart.
400 | The quantity that was given was less than 1
404 | There was an object that had a product id that does not exist
500 | A general error handling server code

## <a name="sc3"></a> PATCH api/shopping-cart/remove
This endpoint will fetch the session based shopping cart and remove the specified products

### Request body

```json
[
    "72326fd4-a0a2-4985-bf80-11e97ae1445b",
    "..."
]
```

Response Codes | Reason
--- | ---
200 | Successufly removed the items in the shopping cart.
404 | There was a product id that did not exist in the users shopping cart
500 | A general error handling server code

## <a name="sc5"></a> PUT api/shopping-cart/:prod_id/quantity
This endpoint will update a shopping cart product's quantity

### Request body

```json
{
    "amount": 1
}
```


Response Codes | Reason
--- | ---
204 | Successufly purchased the items the shopping cart.
400 | The quantity that was given was less than one
404 | The product with id :prod_id does not exist
500 | A general error handling server code

## <a name="sc4"></a> POST api/shopping-cart/complete
This endpoint will process the shopping card and validate whether the cart is valid and can be completed

Response Codes | Reason
--- | ---
204 | Successufly purchased the items the shopping cart.
400 | There were no items to process.
409 | There was a product that had a lower inventory count than the amount requested in the shopping cart.
500 | A general error handling server code