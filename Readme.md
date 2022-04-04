# documentation for Jquery menue project

## work flow doc

- user can drage or click on item & it will     transfere to order section
- user can delete from order section or increase quantity as desired
- a total due is calculated based on quantity,price,tax and delviry

- user can icrease quantity by click + button or just type the amount

- quantity can be decreased also
- orders list are sortable

### bonous work

- if total due exceeded 300 a discount of 30% will be applied

## technical doc

### script divisions

- render functions lines (8 ~ 37 )
  - ajax call to load items objects

  - laoding function to remove the sppiner & load response

- dragging functions lines (50 ~ 72 )
  - which make orders section droppable and item section draggable
  - after dropping it calls a function to handle total due calculation

- calclation functions lines (76 ~ 98 )
  - calculate Quantity * price
  - calculate Tax (add 14%)
  - apply Discount if the total coast >300
  - update Totals
    - add to prev totals , apply delivery expenses a, tax and discounts if any.

- event listener lines(107 ~ 207 )

- adding/replace structure functions lines(209 ~ )

  - add Element To The View as response to ajax call

  - add item To Orders section which in turn calls
    - replace Add sign With Remove sign  to enable user to delete from orders

    - add Qty Marks to enable user to increase/decrease quantity
