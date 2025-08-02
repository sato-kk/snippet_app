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
  const [selectedLang, setSelectedLang] = useState<'python' | 'go'>('python');

  const pythonPlaceholder = `def hello_world():
  print("Hello, Python!")`;

  const goPlaceholder = `package main

import "fmt"

func main() {
  fmt.Println("Hello, Go!")
}`;

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
      alert('Need Title and Code。');
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
      alert('Need Title and Code');
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
      <h1>Code Snippet Manager</h1>
      <div className="main-content">
        {/* 新規スニペット作成フォーム */}
        <div className="snippet-form-container">
          <h2>Add New Snippet</h2>
          <form onSubmit={handleAddSnippet} className="snippet-form">
            <div className="form-field">
              <label htmlFor="new-title">Title:</label>
              <input
                id="new-title"
                type="text"
                name="title"
                value={newSnippet.title}
                onChange={handleNewSnippetChange}
                required
              />
            </div>
            <div className="lang-tabs">
              <button
                type="button"
                className={selectedLang === 'python' ? 'active' : ''}
                onClick={() => setSelectedLang('python')}
              >
                Python
              </button>
              <button
                type="button"
                className={selectedLang === 'go' ? 'active' : ''}
                onClick={() => setSelectedLang('go')}
              >
                Go
              </button>
            </div>
            <div className="form-field">
              <label htmlFor="new-code">Code:</label>
              <textarea
                id="new-code"
                name="code"
                value={newSnippet.code}
                onChange={handleNewSnippetChange}
                placeholder={selectedLang === 'python' ? pythonPlaceholder : goPlaceholder}
                required
                rows={10}
              />
            </div>
            <div className="form-field">
              <label htmlFor="new-description">Description:</label>
              <textarea
                id="new-description"
                name="description"
                value={newSnippet.description}
                onChange={handleNewSnippetChange}
                rows={3}
              />
            </div>
            <button type="submit">Add</button>
          </form>
        </div>

        {/* スニペット一覧 (右サイド) */}
        <div className="snippet-list-container">
          <h2>Snippets</h2>
          {snippets.length === 0 ? (
            <p>No Snippets</p>
          ) : (
            <ul>
              {snippets.map((snippet) => (
                <li key={snippet.id} className="snippet-item">
                  <h3>{snippet.title}</h3>
                  <pre><code>{snippet.code}</code></pre>
                  {snippet.description && <p>{snippet.description}</p>}
                  <div className="snippet-actions">
                    <button onClick={() => handleEditStart(snippet)}>Edit</button>
                    <button onClick={() => handleDeleteSnippet(snippet.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* スニペット編集フォーム */}
      {editingSnippet && (
        <div className="snippet-form-container edit-form-container">
          <h2>Edit Snippet</h2>
          <form onSubmit={handleUpdateSnippet} className="snippet-form">
            <div className="form-field">
              <label htmlFor="edit-title">Title:</label>
              <input
                id="edit-title"
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="edit-code">Code:</label>
              <textarea
                id="edit-code"
                name="code"
                value={editForm.code}
                onChange={handleEditFormChange}
                required
                rows={10}
              />
            </div>
            <div className="form-field">
              <label htmlFor="edit-description">Description:</label>
              <textarea
                id="edit-description"
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                rows={3}
              />
            </div>
            <button type="submit">Update</button>
            <button type="button" onClick={handleEditCancel}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
