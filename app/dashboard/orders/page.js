"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

function money(v){return `৳${Number(v||0).toLocaleString("en-BD")}`}
function badge(v){return <span className={`order-badge status-${v||"unknown"}`}>{String(v||"unknown").replaceAll("_"," ")}</span>}

export default function OrdersPage(){
 const [rows,setRows]=useState([]),[pagination,setPagination]=useState({page:1,totalPages:1,total:0}),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(page=1){setLoading(true);setError("");try{const r=await apiFetch(`/orders/me?page=${page}&limit=20`);setRows(r.data||[]);setPagination(r.pagination||{})}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load(1)},[]);
 return <section className="dashboard-section"><div className="dashboard-block-head"><div><span className="ey">ORDERS</span><h1>Order History</h1><p>Track your purchases and payment status.</p></div></div>{error&&<div className="learn-message">{error}</div>}<div className="order-list">{rows.map(o=><article className="order-card" key={o._id}><div className="order-card-head"><div><strong>{o.orderNumber}</strong><small>{new Date(o.createdAt).toLocaleString()}</small></div><div className="order-statuses">{badge(o.status)}{badge(o.paymentStatus)}</div></div><div className="order-card-items">{(o.items||[]).map(i=><div key={i._id}><span>{i.product?.title||i.title}</span><strong>{money(i.lineTotal)}</strong></div>)}</div><div className="order-card-foot"><div><small>Payment</small><span>{o.payment?.method||"Not submitted"} · {o.payment?.status||"—"}</span></div><strong>{money(o.total)}</strong><Link className="btn ghost" href={`/dashboard/orders/${o._id}`}>View details</Link></div></article>)}{loading&&<div className="product-list-empty">Loading orders…</div>}{!loading&&!rows.length&&<div className="product-list-empty">No orders yet.</div>}</div><div className="order-pagination"><button className="btn ghost" disabled={pagination.page<=1} onClick={()=>load(pagination.page-1)}>Previous</button><span>Page {pagination.page||1} of {pagination.totalPages||1}</span><button className="btn ghost" disabled={pagination.page>=pagination.totalPages} onClick={()=>load(pagination.page+1)}>Next</button></div></section>;
}
