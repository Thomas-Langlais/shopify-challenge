DROP TABLE IF EXISTS ShoppingCartItems;
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    product_id UUID DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL,
    price MONEY NOT NULL,
    inventory_count SMALLINT NOT NULL CHECK(inventory_count >= 0),
    PRIMARY KEY (product_id)
);

CREATE TABLE ShoppingCartItems (
    shopping_cart_id UUID PRIMARY KEY,
    quantity SMALLINT CHECK(quantity >= 0),
    product_id UUID NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);