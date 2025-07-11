// Utility Function
export function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty, // 100*2 =200
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10; // 200>100 ?0:10
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2); //200*0.15= 300.0

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}
