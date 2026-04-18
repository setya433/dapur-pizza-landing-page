import axios from "axios";

const API_URL = "http://localhost:1337/api";

export async function createOrder(data: any) {
  const res = await axios.post(`${API_URL}/orders`, {
    data,
  });

  console.log("ORDER CREATED:", res.data);

  return res.data;
}

export async function updateOrderStatus(id: number, status: string) {
  const res = await axios.put(`http://localhost:1337/api/orders/${id}`, {
    data: {
      status,
    },
  });

  return res.data;
}

export async function fetchOrders() {
  const res = await axios.get(
    "http://localhost:1337/api/orders?sort=createdAt:desc"
  );

    console.log("ORDER GET:", res.data);


  return res.data.data;
}