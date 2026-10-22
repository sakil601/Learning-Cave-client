"use client";
import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Empty, Notice, Status } from "@/components/admin/AdminUI";

const blank = { name:"", slug:"", parent:"", description:"", image:"", active:true, sortOrder:0 };

export default function CategoriesPage(){
  const [items,setItems]=useState([]); const [form,setForm]=useState(blank); const [editing,setEditing]=useState(null); const [msg,setMsg]=useState(""); const [error,setError]=useState("");
  const load=async()=>{try{setItems((await admin.categories(true)).data||[])}catch(e){setError(e.message)}};
  useEffect(()=>{load()},[]);
  const submit=async(e)=>{e.preventDefault();setError("");setMsg("");try{const body={...form,parent:form.parent||null,sortOrder:Number(form.sortOrder)||0}; if(!body.slug) delete body.slug; if(editing) await admin.updateCategory(editing,body); else await admin.createCategory(body); setMsg(editing?"Category updated.":"Category created.");setForm(blank);setEditing(null);await load()}catch(e){setError(e.message)}};
  const edit=(x)=>{setEditing(x._id);setForm({name:x.name||"",slug:x.slug||"",parent:x.parent?._id||x.parent||"",description:x.description||"",image:x.image||"",active:x.active!==false,sortOrder:x.sortOrder||0})};
  const remove=async(id)=>{if(!confirm("Delete this category?"))return;try{await admin.deleteCategory(id);await load()}catch(e){setError(e.message)}};
  return <><AdminHeader title="Categories" description="Backed by /admin/categories. Main categories and optional parent-child relationships are dynamic." />
  <Notice tone="error">{error}</Notice><Notice tone="success">{msg}</Notice>
  <div className="admin-split"><div>{items.length?<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Parent</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(x=><tr key={x._id}><td><strong>{x.name}</strong><div className="admin-code">/{x.slug}</div></td><td>{x.parent?.name||"Root"}</td><td>{x.sortOrder||0}</td><td><Status value={x.active?"active":"suspended"}/></td><td><div className="admin-actions"><button className="admin-mini-btn" onClick={()=>edit(x)}>Edit</button><button className="admin-mini-btn danger" onClick={()=>remove(x._id)}>Delete</button></div></td></tr>)}</tbody></table></div>:<Empty/>}</div>
  <div className="admin-panel admin-sticky" style={{marginTop:0}}><h2>{editing?"Edit category":"New category"}</h2><form className="admin-form" onSubmit={submit}>
  <div className="admin-field wide"><label>Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
  <div className="admin-field wide"><label>Slug (optional)</label><input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/></div>
  <div className="admin-field wide"><label>Parent</label><select value={form.parent} onChange={e=>setForm({...form,parent:e.target.value})}><option value="">Root category</option>{items.filter(x=>x._id!==editing).map(x=><option key={x._id} value={x._id}>{x.name}</option>)}</select></div>
  <div className="admin-field wide"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
  <div className="admin-field wide"><label>Image URL</label><input value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></div>
  <div className="admin-field"><label>Sort order</label><input type="number" min="0" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:e.target.value})}/></div>
  <label className="admin-check"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/>Active</label>
  <div className="wide admin-actions"><button className="btn primary" type="submit">{editing?"Save Changes":"Create Category"}</button>{editing&&<button type="button" className="btn" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}</div>
  </form></div></div></>;
}
