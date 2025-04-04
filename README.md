## Start the app
1. Download/unzip open in vscode.
2. Open the terminal and enter 'npm i'
3. In the terminal and enter 'nodemon app' to start the app.
4. In chrome search up 'localhost:3000'.

## Sprint 2 (LATEST VERSION!)
### Edit an existing item
1. Login admin account, then click the item you wish to edit.
2. Click the edit button, an edit form will appear.
3. Fill out the form to modify item attibutes, then submit to save.
4. Non-admin is unauthorized to edit items.

### Delete an existing item
1. Login admin account, then click the item you wish to delete.
2. Click the delete button the item will delete.
3. Non-admin is unauthorized to delete items.

### Add items to cart
1. Login non-admin account, then go to menu.
2. Click button 'add to cart' below item image, or the click the 'add to cart' button on the item page.
3. Admin is unauthorized to add items to cart.

### Delete items from cart
1. Login non-admin account, then go to 'my cart'.
2. Click button 'delete from cart' below image, or click the 'delete from cart' button on the item page.
3. Admin is unauthorized to delete items from cart. 

## Sprint 1
### Create admin account (create an account with privileges)
1. Click the 'sign up' tab.
2. Fill out fields, enter 'silverSpoon' in admin field.
3. Click the 'list a new item' tab that appears, (sign up/login disappears, logout tab appears).
4. Enter the new item's description in the fields and submit.

### Create guest account (create an account with minimal privileges)
1. Click the 'sign up' tab.
2. Keep admin field empty (test with wrong and notice an error message flashes).
3. Notice 'my cart' tab appears (sign up/login disappears, logout tab appears).
