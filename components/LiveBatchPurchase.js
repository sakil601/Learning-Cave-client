"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";

function fmt(value){return value?new Date(value).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"—"}

export default function LiveBatchPurchase({ productId, batches = [] }) {
  const available = useMemo(()=>batches.filter(b=>!b.full),[batches]);
  const [batchId,setBatchId]=useState(available[0]?._id||"");
  const selected=available.find(b=>String(b._id)===String(batchId));

  return <div className="live-batch-buy">
    <label className="live-batch-label">Choose batch</label>
    {available.length ? <>
      <select className="live-batch-select" value={batchId} onChange={e=>setBatchId(e.target.value)}>
        {available.map(batch=><option key={batch._id} value={batch._id}>{batch.name} · {fmt(batch.startDate)} · {batch.seatsRemaining==null?"Open seats":`${batch.seatsRemaining} seats left`}</option>)}
      </select>
      {selected&&<div className="live-batch-meta"><span>{selected.status}</span><span>{fmt(selected.startDate)} → {fmt(selected.endDate)}</span><span>{selected.seatsRemaining==null?"No capacity limit":`${selected.seatsRemaining} of ${selected.capacity} seats left`}</span></div>}
      <AddToCartButton productId={productId} batchId={batchId} disabled={!batchId} label="Select Batch & Enroll" />
    </> : <div className="info-card"><p>No batch is currently open for enrollment.</p></div>}
  </div>;
}
