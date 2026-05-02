'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Comment, Guestbook } from '@/lib/types';

const colors = ['#fde047', '#f9a8d4', '#7dd3fc', '#bef264'];

export default function Board() {
  const [items, setItems] = useState<Guestbook[]>([]);
  const [selected, setSelected] = useState<Guestbook | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('guestbook').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data ?? []));
    const channel = supabase.channel('guestbook-insert').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
      const next = payload.new as Guestbook;
      setItems((prev) => prev.some((item) => item.id === next.id) ? prev : [next, ...prev]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!selected) return;
    supabase.from('comments').select('*').eq('guestbook_id', selected.id).order('created_at').then(({ data }) => setComments(data ?? []));
    const channel = supabase.channel(`comments-${selected.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `guestbook_id=eq.${selected.id}` }, (payload) => {
      const next = payload.new as Comment;
      setComments((prev) => prev.some((comment) => comment.id === next.id) ? prev : [...prev, next]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selected]);

  const postComment = async () => {
    if (!selected || !content.trim()) return;
    const { error } = await supabase.from('comments').insert({
      guestbook_id: selected.id,
      author: author.trim() || '익명',
      content: content.trim()
    });
    if (error) setError(`댓글 작성 실패: ${error.message}`);
    else { setAuthor(''); setContent(''); setError(''); }
  };

  const styled = useMemo(() => items.map((it, i) => ({ ...it, rotate: (i % 2 === 0 ? -1 : 1) * ((i % 4) + 1), color: colors[i % colors.length] })), [items]);

  return <main className="boardPage"><h1>실시간 포스트잇 보드</h1><a href="/" className="btn">작성하러 가기</a>
    <section className="boardGrid">{styled.map((item) => <article key={item.id} className="sticky" style={{ background: item.color, transform: `rotate(${item.rotate}deg)` }} onClick={() => setSelected(item)}>
      <img src={item.image_url} alt={item.content} />
      <h3>{item.author}</h3><p>{item.content}</p><small>{new Date(item.created_at).toLocaleString()}</small>
    </article>)}</section>

    {selected && <div className="modalBg" onClick={() => setSelected(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
      <img src={selected.image_url} alt={selected.content} className="detailImg" />
      <h2>{selected.author}</h2><p>{selected.content}</p>
      <div className="comments">{comments.map((comment) => <div key={comment.id}><b>{comment.author}</b> {comment.content}</div>)}</div>
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="이름" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="댓글" />
      <button onClick={postComment}>댓글 등록</button>
      {error && <p className="error">{error}</p>}
    </div></div>}
  </main>;
}
