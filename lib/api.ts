import axios from "axios";

const API_URL = "http://localhost:1337/api";

export async function fetchCategories() {
  const res = await axios.get(`${API_URL}/categories?sort=name:asc`);
  return res.data.data;
}

export async function fetchProducts(categorySlug?: string) {
  const url = categorySlug
    ? `${API_URL}/products?populate=*&filters[category][slug][$eq]=${categorySlug}`
    : `${API_URL}/products?populate=*`;

  const res = await axios.get(url);
  return res.data.data;
}


export async function fetchProductBySlug(slug: string) {
  const res = await axios.get(
    `${API_URL}/products?filters[slug][$eq]=${slug}&populate=*`
  );

  console.log("FETCH PRODUCT BY SLUG:", res.data);

  return res.data.data[0];
}