export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // 1. Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // 2. Calculate shipping price (Free over $100, else $10)
  state.shippingPrice = addDecimals(
    Number(state.itemsPrice) > 100 ? 0 : 10
  );

  // 3. Calculate tax price (15% tax)
  state.taxPrice = addDecimals(
    Number(0.15 * Number(state.itemsPrice))
  );

  // 4. Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // 5. Save updated cart state to local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};