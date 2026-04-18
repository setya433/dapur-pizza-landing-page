export function mapOrder(item: any) {
  const attr = item;

  return {
    id: item.id,
    orderCode: attr.orderCode,
    customerName: attr.customerName,
    phone: attr.phone,
    eventDate: attr.eventDate,
    address: attr.address,
    note: attr.note,
    items: attr.items,
    total: attr.total,
    statusOrder: attr.statusOrder,
    createdAt: attr.createdAt,
  };
}