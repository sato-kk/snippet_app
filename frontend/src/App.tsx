import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './App.css';

// スニペットのデータ構造を定義
interface Snippet {
  id: number;
  title: string;
  code: string;
  description: string;
}

function App() {
  // スニペットのリストを管理するstate
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  // 新規スニペット作成フォームのstate
  const [newSnippet, setNewSnippet] = useState<Omit<Snippet, 'id'>>({
    title: '',
    code: '',
    description: '',
  });
  // 編集対象のスニペットとフォームのstate
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [editForm, setEditForm] = useState<Omit<Snippet, 'id'>>({
    title: '',
    code: '',
    description: '',
  });

  // 新規スニペットフォームの入力値を更新
  const handleNewSnippetChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSnippet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 新規スニペットを追加
  const handleAddSnippet = (e: FormEvent) => {
    e.preventDefault();
    if (!newSnippet.title || !newSnippet.code) {
      alert('タイトルとコードは必須です。');
      return;
    }
    const snippetToAdd: Snippet = {
      id: Date.now(), // 簡単なID生成
      ...newSnippet,
    };
    setSnippets((prev) => [...prev, snippetToAdd]);
    // フォームをリセット
    setNewSnippet({ title: '', code: '', description: '' });
  };

  // スニペットを削除
  const handleDeleteSnippet = (id: number) => {
    setSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
    // 編集中のスニペットが削除された場合、編集モードを解除
    if (editingSnippet && editingSnippet.id === id) {
      setEditingSnippet(null);
    }
  };

  // 編集モードを開始
  const handleEditStart = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setEditForm({
      title: snippet.title,
      code: snippet.code,
      description: snippet.description,
    });
  };

  // 編集フォームの入力値を更新
  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // スニペットを更新
  const handleUpdateSnippet = (e: FormEvent) => {
    e.preventDefault();
    if (!editingSnippet || !editForm.title || !editForm.code) {
      alert('タイトルとコードは必須です。');
      return;
    }
    setSnippets((prev) =>
      prev.map((snippet) =>
        snippet.id === editingSnippet.id ? { ...snippet, ...editForm } : snippet
      )
    );
    setEditingSnippet(null); // 編集モードを終了
  };

  // 編集モードをキャンセル
  const handleEditCancel = () => {
    setEditingSnippet(null);
  };

  return (
    <div className="App">
      <h1>コードスニペット管理</h1>

      {/* 新規スニペット作成フォーム */}
      <div className="snippet-form">
        <h2>新しいスニペットを追加</h2>
        <form onSubmit={handleAddSnippet}>
          <div>
            <label>タイトル:</label>
            <input
              type="text"
              name="title"
              value={newSnippet.title}
              onChange={handleNewSnippetChange}
              required
            />
          </div>
          <div>
            <label>コード:</label>
            <textarea
              name="code"
              value={newSnippet.code}
              onChange={handleNewSnippetChange}
              required
              rows={10}
            />
          </div>
          <div>
            <label>説明:</label>
            <textarea
              name="description"
              value={newSnippet.description}
              onChange={handleNewSnippetChange}
              rows={3}
            />
          </div>
          <button type="submit">追加</button>
        </form>
      </div>

      <hr />

      {/* スニペット一覧 */}
      <div className="snippet-list">
        <h2>スニペット一覧</h2>
        {snippets.length === 0 ? (
          <p>スニペットがありません。</p>
        ) : (
          <ul>
            {snippets.map((snippet) => (
              <li key={snippet.id}>
                <h3>{snippet.title}</h3>
                <pre><code>{snippet.code}</code></pre>
                {snippet.description && <p>{snippet.description}</p>}
                <button onClick={() => handleEditStart(snippet)}>編集</button>
                <button onClick={() => handleDeleteSnippet(snippet.id)}>削除</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* スニペット編集フォーム */}
      {editingSnippet && (
        <div className="snippet-form edit-form">
          <h2>スニペットを編集</h2>
          <form onSubmit={handleUpdateSnippet}>
            <div>
              <label>タイトル:</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label>コード:</label>
              <textarea
                name="code"
                value={editForm.code}
                onChange={handleEditFormChange}
                required
                rows={10}
              />
            </div>
            <div>
              <label>説明:</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                rows={3}
              />
            </div>
            <button type="submit">更新</button>
            <button type="button" onClick={handleEditCancel}>キャンセル</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
