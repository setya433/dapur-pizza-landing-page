import axios from "axios";

const API_URL = "https://striking-bell-1f63db83d6.strapiapp.com/api";

export async function createOrder(data: any) {
  const res = await axios.post(`${API_URL}/orders`, {
    data,
  });

  console.log("ORDER CREATED:", res.data);

  return res.data;
}

export async function updateOrderStatus(documentId: string, statusOrder: string) {
  console.log("Updating order status:", { documentId, statusOrder });


  
  const res = await axios.put(`https://striking-bell-1f63db83d6.strapiapp.com/api/orders/${documentId}`, {
    data: {
      statusOrder,
    },
  });

  return res.data;
}

export async function fetchOrders() {
  const res = await axios.get(
    "https://striking-bell-1f63db83d6.strapiapp.com/api/orders?sort=createdAt:desc"
  );

    console.log("ORDER GET:", res.data);


  return res.data.data;
}