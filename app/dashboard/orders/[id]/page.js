"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

const money=v=>`৳${Number(v||0).toLocaleString("en-BD")}`;
export default function OrderDetailPage(){
 const {id}=useParams();const [order,setOrder]=useState(null),[error,setError]=useState("");
 useEffect(()=>{apiFetch(`/orders/me/${id}`).then(r=>setOrder(r.data)).catch(e=>setError(e.message))},[id]);
 if(error)return <section className="dashboard-section"><div className="product-list-empty">{error}</div></section>;
 if(!order)return <section className="dashboard-section"><div className="product-list-empty">Loading order…</div></section>;
 return <section className="dashboard-section"><Link className="learn-back" href="/dashboard/orders">← Order History</Link><div className="dashboard-block-head"><div><span className="ey">ORDER DETAILS</span><h1>{order.orderNumber}</h1><p>{new Date(order.createdAt).toLocaleString()}</p></div></div><div className="order-detail-grid"><div className="order-detail-main"><div className="profile-card"><h2>Items</h2>{(order.items||[]).map(i=><div className="order-detail-item" key={i._id}><div><strong>{i.product?.title||i.title}</strong><small>{i.productType?.replaceAll("_"," ")}{i.batch?.name?` · ${i.batch.name}`:""}</small></div><strong>{money(i.lineTotal)}</strong></div>)}</div><div className="profile-card"><h2>Billing</h2><p>{order.billing?.name}<br/>{order.billing?.email}<br/>{order.billing?.phone}</p></div></div><aside className="profile-card order-summary-card"><h2>Summary</h2><div><span>Order status</span><strong>{order.status}</strong></div><div><span>Payment status</span><strong>{order.paymentStatus}</strong></div><div><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div><div className="total"><span>Total</span><strong>{money(order.total)}</strong></div><hr/><div><span>Method</span><strong>{order.payment?.method||"—"}</strong></div><div><span>Payment</span><strong>{order.payment?.status||"—"}</strong></div><div><span>Transaction</span><strong>{order.payment?.transactionId||order.payment?.gatewayReference||"—"}</strong></div></aside></div></section>;
}
