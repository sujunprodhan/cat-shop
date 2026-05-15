export const generateInvoiceHTML = (order) => {
  console.log(order);
  
  const {
    orderId,
    items,
    total,
    customerEmail, 
  } = order;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Invoice</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #00BC7D 0%, #009966 100%);
          color: #ffffff;
          padding: 40px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 10px 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .info-table {
          width: 100%;
          margin-bottom: 30px;
        }
        .info-title {
          font-size: 12px;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #111827;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background-color: #f9fafb;
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 16px;
          text-align: left;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 15px;
          color: #374151;
        }
        .items-table th.text-center, .items-table td.text-center {
          text-align: center;
        }
        .items-table th.text-right, .items-table td.text-right {
          text-align: right;
        }
        .item-name {
          font-weight: 500;
          color: #111827;
        }
        .total-wrapper {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          text-align: right;
          border: 1px solid #e2e8f0;
        }
        .total-label {
          font-size: 16px;
          color: #64748b;
          margin-right: 15px;
        }
        .total-amount {
          font-size: 28px;
          font-weight: 700;
          color: #4f46e5;
        }
        .footer {
          text-align: center;
          padding: 30px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 15px;
        }
        .heart {
          color: #ef4444;
        }
      </style>
    </head>
    <body>
      <div style="background-color: #f3f4f6; padding: 40px 20px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Order Invoice</h1>
            <p>Thank you for your purchase!</p>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Order Info -->
            <table class="info-table" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" valign="top">
                  <div class="info-title">Order ID</div>
                  <div class="info-value">#${orderId || "694473decf307f58bfd8cd51"}</div>
                </td>
                <td width="50%" valign="top" align="right">
                  <div class="info-title">Customer</div>
                  <div class="info-value">${customerEmail || 'prodhan931@gmail.com'}</div>
                </td>
              </tr>
            </table>

            <!-- Items Table -->
            <table class="items-table" cellpadding="0" cellspacing="0" border="0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="text-center" width="80">Qty</th>
                  <th class="text-right" width="120">Price</th>
                </tr>
              </thead>
              <tbody>
                ${items && items.length > 0 ? items.map(item => `
                  <tr>
                    <td>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="60" valign="middle">
                            <img src="${item.image || 'https://via.placeholder.com/48'}" alt="${item.title || item.name}" style="width: 48px; height: 48px; border-radius: 8px; display: block; object-fit: cover;" />
                          </td>
                          <td valign="middle">
                            <div class="item-name">${item.title || item.name}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="text-center">${item.quantity || 1}</td>
                    <td class="text-right">৳${item.price}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="60" valign="middle">
                            <img src="https://via.placeholder.com/48" alt="Learning Board" style="width: 48px; height: 48px; border-radius: 8px; display: block;" />
                          </td>
                          <td valign="middle">
                            <div class="item-name">Number and Counting Learning Board</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="text-center">1</td>
                    <td class="text-right">৳1125</td>
                  </tr>
                  <tr>
                    <td>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="60" valign="middle">
                            <img src="https://via.placeholder.com/48" alt="Cube Game" style="width: 48px; height: 48px; border-radius: 8px; display: block;" />
                          </td>
                          <td valign="middle">
                            <div class="item-name">Fun Logic Matching Cube Game</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="text-center">1</td>
                    <td class="text-right">৳989</td>
                  </tr>
                `}
              </tbody>
            </table>

            <!-- Total -->
            <div class="total-wrapper">
              <span class="total-label">Total Amount:</span>
              <span class="total-amount">৳${total || "2114"}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            Thank you for shopping with <strong style="color: #111827;">Hero Kidz</strong> <span class="heart">❤️</span><br>
            <span style="font-size: 13px; margin-top: 10px; display: inline-block; color: #9ca3af;">If you have any questions, please contact our support team.</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
