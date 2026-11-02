"use client";

import { FormEvent, useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Save, ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string; title_en: string; title_ar: string; description_en: string; description_ar: string;
  category: string; image_url: string; demo_url: string; github_url: string; published: boolean;
};

const blank = { title_en: "", title_ar: "", description_en: "", description_ar: "", category: "Website", image_url: "", demo_url: "", github_url: "", published: true };

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<any>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => setSession(current));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) loadProjects(); }, [session]);

  async function loadProjects() {
    if (!supabase) return;
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    else setProjects((data as Project[]) || []);
  }

  async function login(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    if (!supabase) { setMessage("Add your Supabase URL and anon key to .env.local first."); setBusy(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    setBusy(false);
  }

  async function save(e: FormEvent) {
    e.preventDefault(); if (!supabase) return; setBusy(true); setMessage("");
    const payload = { ...form };
    const result = editing
      ? await supabase.from("projects").update(payload).eq("id", editing)
      : await supabase.from("projects").insert(payload);
    if (result.error) setMessage(result.error.message);
    else { setMessage(editing ? "Project updated." : "Project added."); setForm(blank); setEditing(null); await loadProjects(); }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!supabase || !window.confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) setMessage(error.message); else { setMessage("Project deleted."); await loadProjects(); }
  }

  function edit(p: Project) { setEditing(p.id); setForm({ ...p }); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function logout() { if (supabase) await supabase.auth.signOut(); }

  if (!session) return <main className="admin-page"><div className="admin-login"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to website</Link><div className="admin-logo"><span className="brand-mark">Y</span><span>YUOSSEF<span className="blue">.</span><small>LAB ADMIN</small></span></div><div className="eyebrow">PRIVATE WORKSPACE</div><h1>Welcome back.</h1><p>Sign in to manage your projects.</p><form onSubmit={login} className="admin-form"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Your password"/></label><button className="button-primary full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button></form>{message && <p className="notice">{message}</p>}<p className="admin-hint">Admin accounts are created in Supabase Authentication. Then add the account to the admins table using the SQL instructions in README.</p></div></main>;

  return <main className="admin-page"><div className="dashboard">
    <header className="dash-header"><Link href="/" className="brand"><span className="brand-mark">Y</span><span>YUOSSEF<span className="blue">.</span><small>LAB ADMIN</small></span></Link><div className="dash-user"><span>{session.user.email}</span><button className="icon-button" onClick={logout}><LogOut size={17}/> Sign out</button></div></header>
    <div className="dash-title"><div><div className="eyebrow"><LayoutDashboard size={14}/> CONTROL CENTER</div><h1>Projects dashboard</h1><p>Add, edit and publish your work.</p></div><span className="project-count">{projects.length} PROJECTS</span></div>
    <div className="dash-columns">
      <section className="editor-panel"><h2>{editing ? "Edit project" : "Add a project"}</h2><form className="admin-form" onSubmit={save}>
        <div className="form-two"><label>Title (English)<input value={form.title_en} onChange={e=>setForm({...form,title_en:e.target.value})} required/></label><label>العنوان (عربي)<input value={form.title_ar} onChange={e=>setForm({...form,title_ar:e.target.value})} required/></label></div>
        <div className="form-two"><label>Description (English)<textarea value={form.description_en} onChange={e=>setForm({...form,description_en:e.target.value})} required rows={3}/></label><label>الوصف (عربي)<textarea value={form.description_ar} onChange={e=>setForm({...form,description_ar:e.target.value})} required rows={3}/></label></div>
        <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Website</option><option>Web App</option><option>Mobile App</option><option>Game</option><option>Experiment</option></select></label>
        <label>Image URL<input type="url" value={form.image_url || ""} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="https://..."/></label>
        <div className="form-two"><label>Live demo URL<input type="url" value={form.demo_url || ""} onChange={e=>setForm({...form,demo_url:e.target.value})} placeholder="https://..."/></label><label>GitHub URL<input type="url" value={form.github_url || ""} onChange={e=>setForm({...form,github_url:e.target.value})} placeholder="https://github.com/..."/></label></div>
        <label className="check-label"><input type="checkbox" checked={!!form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published — visible on the website</label>
        <div className="form-actions"><button className="button-primary" disabled={busy}>{editing ? <Save size={16}/> : <Plus size={16}/>} {busy ? "Saving..." : editing ? "Save changes" : "Add project"}</button>{editing && <button type="button" className="button-quiet" onClick={()=>{setEditing(null);setForm(blank);}}>Cancel</button>}</div>
      </form>{message && <p className="notice">{message}</p>}</section>
      <section className="project-list-panel"><h2>Your projects <span>{projects.length}</span></h2>{projects.length === 0 ? <div className="empty-state compact">No projects yet. Add your first one.</div> : projects.map(p=><article className="admin-project" key={p.id}><div className="admin-project-thumb">{p.image_url ? <img src={p.image_url} alt=""/> : <span>Y.</span>}</div><div className="admin-project-info"><strong>{p.title_en}</strong><small>{p.category} · {p.published ? "Published" : "Draft"}</small></div><button className="icon-button" onClick={()=>edit(p)} aria-label="Edit project"><Save size={16}/></button><button className="icon-button danger" onClick={()=>remove(p.id)} aria-label="Delete project"><Trash2 size={16}/></button></article>)}</section>
    </div>
  </div></main>;
}
