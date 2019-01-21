DROP TABLE IF EXISTS ShoppingCartItems;
DROP TABLE IF EXISTS Products;

-- The products schema
CREATE TABLE Products (
    product_id UUID DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL,
    price MONEY NOT NULL,
    inventory_count SMALLINT NOT NULL CHECK(inventory_count >= 0),
    PRIMARY KEY (product_id)
);

-- The shopping cart schema
CREATE TABLE ShoppingCartItems (
    shopping_cart_id UUID PRIMARY KEY,
    quantity SMALLINT CHECK(quantity >= 0),
    product_id UUID NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- add some dummy products
INSERT INTO Products(title,price,inventory_count)
    VALUES
        ('Smirnoff Ice', 15.99, 6),
        ('Starbucks coffee', 5.99, 2),
        ('Rockstar energy drink', 3.99, 5),
        ('Sommersby Cider', 2.99, 6),
        ('Nintendo Switch', 399.99, 0),
        ('A Kitty', 170.29, 1),
        ('A Plaid Shirt', 30.99, 10),
        ('Wii U', 150.99, 0);