export const generateInvoiceHTML = (order) => {
  console.log(order);
  
  const {
    orderId,
    items,
    total,
    customerEmail, // Fallback if no specific email provided
  } = order;

  // Design matches the specific image provided by the user
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #fff;
          margin: 0;
          padding: 40px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .top-right-email {
          text-align: right;
          color: red;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .title-block {
          background-color: #2b5797; /* Blue background */
          color: white;
          display: inline-block;
          padding: 5px 15px;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .order-id-block {
          background-color: #2b5797; /* Blue background */
          color: white;
          display: inline-block;
          padding: 3px 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .invoice-table th, .invoice-table td {
          border: 1px solid #000;
          padding: 10px;
        }
        .invoice-table th {
          text-align: left;
          font-weight: bold;
        }
        .text-center {
          text-align: center;
        }
        .text-right {
          text-align: right;
        }
        .total-block {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .footer-thanks {
          font-size: 14px;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Top Right Email -->
        <div class="top-right-email">
          ${customerEmail || 'prodhan931@gmail.com'}
        </div>

        <!-- Order Invoice Title -->
        <div>
          <div class="title-block">Order Invoice</div>
        </div>

        <!-- Order ID -->
        <div>
          <div class="order-id-block">Order ID: ${orderId || "694473decf307f58bfd8cd51"}</div>
        </div>

        <!-- Table -->
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th class="text-center" style="width: 100px;">Qty</th>
              <th class="text-right" style="width: 150px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items && items.length > 0 ? items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">৳${item.price}</td>
              </tr>
            `).join('') : `
              <tr>
                <td>Number and Counting Learning Board</td>
                <td class="text-center">1</td>
                <td class="text-right">৳1125</td>
              </tr>
              <tr>
                <td>Fun Logic Matching Cube Game</td>
                <td class="text-center">1</td>
                <td class="text-right">৳989</td>
              </tr>
            `}
          </tbody>
        </table>

        <!-- Total -->
        <div class="total-block">
          Total: ৳${total || "2114"}
        </div>

        <!-- Footer -->
        <div class="footer-thanks">
          Thank you for shopping with Hero Kidz ❤️
        </div>
      </div>
    </body>
    </html>
  `;
};
