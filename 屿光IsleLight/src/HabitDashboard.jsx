import React, { useState, useEffect } from 'react';
import { Plus, X, Zap, ArrowLeft, MessageSquare, Calendar, Trash2, Palette } from 'lucide-react';

const HabitDashboard = () => {
  // --- 1. 状态管理 ---
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('IsleLightHabits');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: '晨间冥想', 
        icon: '🧘', 
        target: 30, 
        current: 12,
        streak: 7,
        color: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
        records: [
          { id: 101, time: '3月24日 08:30', thought: '今天感觉内心很平静。' }
        ]
      }
    ];
  });

  const [selectedHabit, setSelectedHabit] = useState(null); // 用于控制详情页展示
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '🧘',
    target: 0, // 0 表示不设限
    color: ['#8B5CF6', '#A78BFA', '#C4B5FD']
  });

  // 保存到本地
  useEffect(() => {
    localStorage.setItem('IsleLightHabits', JSON.stringify(habits));
  }, [habits]);

  // --- 2. 预设数据 ---
  const habitIcons = [
    { emoji: '🧘', name: '冥想' }, { emoji: '🏃', name: '跑步' }, { emoji: '📚', name: '阅读' },
    { emoji: '💪', name: '健身' }, { emoji: '🎨', name: '艺术' }, { emoji: '🎵', name: '音乐' },
    { emoji: '💤', name: '睡眠' }, { emoji: '🥗', name: '饮食' }, { emoji: '💧', name: '喝水' },
    { emoji: '🧠', name: '学习' }, { emoji: '🌱', name: '种植' }, { emoji: '✍️', name: '写作' },
    { emoji: '🎮', name: '游戏' }, { emoji: '🚴', name: '骑行' }, { emoji: '🌊', name: '冥想' },
  ];

  const habitColors = [
    { id: 'purple', name: '幻紫', colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'] },
    { id: 'blue', name: '星海', colors: ['#3B82F6', '#60A5FA', '#93C5FD'] },
    { id: 'emerald', name: '翡翠', colors: ['#10B981', '#34D399', '#6EE7B7'] },
    { id: 'rose', name: '玫瑰', colors: ['#F43F5E', '#FB7185', '#FDA4AF'] },
    { id: 'amber', name: '琥珀', colors: ['#D97706', '#F59E0B', '#FBBF24'] },
    { id: 'cyan', name: '青空', colors: ['#06B6D4', '#22D3EE', '#67E8F9'] },
    { id: 'sunset', name: '落日', colors: ['#F59E0B', '#EF4444', '#B91C1C'] },
    { id: 'indigo', name: '靛蓝', colors: ['#6366F1', '#4338CA', '#312E81'] },
  ];

  // --- 3. 核心交互逻辑 ---
  
  // 快速打卡
  const handleQuickCheckIn = (e, habitId) => {
    e.stopPropagation();
    const now = new Date();
    const timeString = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newRecord = { id: Date.now(), time: timeString, thought: '' };
        return { 
          ...h, 
          current: h.current + 1, 
          streak: h.streak + 1,
          records: [newRecord, ...(h.records || [])]
        };
      }
      return h;
    }));
  };

  // 添加习惯
  const handleAddHabit = () => {
    if (!newHabit.name.trim()) return alert('请输入名称');
    const habit = {
      ...newHabit,
      id: Date.now(),
      current: 0,
      streak: 0,
      records: []
    };
    setHabits([...habits, habit]);
    setNewHabit({ name: '', icon: '🧘', target: 0, color: ['#8B5CF6', '#A78BFA', '#C4B5FD'] });
    setShowAddModal(false);
  };

  // 更新想法
  const updateThought = (habitId, recordId, text) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          records: h.records.map(r => r.id === recordId ? { ...r, thought: text } : r)
        };
      }
      return h;
    }));
  };

  // 删除习惯
  const handleDeleteHabit = (e, habitId) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这座习惯岛屿吗？')) {
      setHabits(habits.filter(h => h.id !== habitId));
    }
  };

  // --- 4. 子组件：详情页 ---
  const DetailPage = ({ habit, onBack }) => {
    const [editingId, setEditingId] = useState(null);
    const [tempThought, setTempThought] = useState('');

    return (
      <div className="detail-overlay" onClick={onBack}>
        <div className="detail-card" onClick={e => e.stopPropagation()}>
          <header className="detail-header">
            <button className="back-circle" onClick={onBack}><ArrowLeft size={20} /></button>
            <div className="detail-main-info">
              <span className="detail-icon-large">{habit.icon}</span>
              <h2>{habit.name}</h2>
              <div className="detail-stats">
                <span>🔥 连续 {habit.streak} 天</span>
                <span>✨ 累计 {habit.current} 次</span>
              </div>
            </div>
          </header>

          <div className="records-container">
            <h3 className="section-title"><Calendar size={16} /> 航海日志 (打卡记录)</h3>
            {habit.records && habit.records.length > 0 ? (
              habit.records.map(record => (
                <div key={record.id} className="record-item">
                  <div className="record-top">
                    <span className="record-time">{record.time}</span>
                    <button 
                      className="edit-thought-btn" 
                      onClick={() => { setEditingId(record.id); setTempThought(record.thought); }}
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                  {editingId === record.id ? (
                    <div className="thought-editor">
                      <textarea 
                        autoFocus
                        value={tempThought}
                        onChange={e => setTempThought(e.target.value)}
                        placeholder="写下此刻的想法..."
                      />
                      <div className="editor-actions">
                        <button onClick={() => setEditingId(null)}>取消</button>
                        <button className="save-btn" onClick={() => {
                          updateThought(habit.id, record.id, tempThought);
                          setEditingId(null);
                        }}>保存</button>
                      </div>
                    </div>
                  ) : (
                    <p className="record-thought">
                      {record.thought || <span className="empty-hint">还没有记录想法，点击右侧气泡添加...</span>}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-records">空空如也，快去打卡吧</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- 5. 主页面 JSX ---
  return (
    <div className="IsleLight-app">
      {/* 动态背景 */}
      <div className="cosmic-bg">
        <div className="glow-sphere s1"></div>
        <div className="glow-sphere s2"></div>
      </div>

      <div className="dashboard-wrapper">
        <header className="app-header">
          <div className="brand-box">
            <h1>IsleLight</h1>
            <p>构建你的梦幻习惯群岛</p>
          </div>
          <button className="main-add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={20} /> <span>新岛屿</span>
          </button>
        </header>

        <div className="habits-grid">
          {habits.map(habit => (
            <div 
              key={habit.id} 
              className="habit-card"
              style={{ '--accent-color': habit.color[0] }}
              onClick={() => setSelectedHabit(habit)}
            >
              <div className="card-glass-content">
                <button className="card-delete-btn" onClick={(e) => handleDeleteHabit(e, habit.id)}><X size={14} /></button>
                
                <div className="card-top">
                  <div className="icon-sphere" style={{ background: `linear-gradient(135deg, ${habit.color[0]}, ${habit.color[1]})` }}>
                    {habit.icon}
                  </div>
                  <div className="name-box">
                    <h3>{habit.name}</h3>
                    <div className="streak-tag"><Zap size={10} fill="currentColor"/> {habit.streak}天连胜</div>
                  </div>
                </div>

                {habit.target > 0 && (
                  <div className="progress-area">
                    <div className="progress-label">
                      <span>探索进度</span>
                      <span>{habit.current}/{habit.target}</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${Math.min(100, (habit.current / habit.target) * 100)}%`,
                          background: `linear-gradient(90deg, ${habit.color[0]}, ${habit.color[2]})`
                        }} 
                      />
                    </div>
                  </div>
                )}

                <button 
                  className="quick-check-btn"
                  style={{ background: `linear-gradient(135deg, ${habit.color[0]}, ${habit.color[1]})` }}
                  onClick={(e) => handleQuickCheckIn(e, habit.id)}
                >
                  激活能量
                </button>
              </div>
            </div>
          ))}

          {habits.length === 0 && (
            <div className="empty-islands" onClick={() => setShowAddModal(true)}>
              <div className="empty-plus">+</div>
              <p>海面上还没有岛屿，点击创建</p>
            </div>
          )}
        </div>
      </div>

      {/* 详情页展示 */}
      {selectedHabit && (
        <DetailPage 
          habit={habits.find(h => h.id === selectedHabit.id)} 
          onBack={() => setSelectedHabit(null)} 
        />
      )}

      {/* 新增岛屿弹窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="dream-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>新建岛屿</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            
            <div className="modal-scroll">
              <div className="input-group">
                <label>岛屿名称</label>
                <input 
                  autoFocus
                  placeholder="例如：清晨冥想..." 
                  value={newHabit.name}
                  onChange={e => setNewHabit({...newHabit, name: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label>守护星 (图标)</label>
                <div className="icon-select-grid">
                  {habitIcons.map(item => (
                    <button 
                      key={item.emoji}
                      className={newHabit.icon === item.emoji ? 'active' : ''}
                      onClick={() => setNewHabit({...newHabit, icon: item.emoji})}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>岛屿色彩</label>
                <div className="color-select-grid">
                  {habitColors.map(c => (
                    <button 
                      key={c.id}
                      className={newHabit.color[0] === c.colors[0] ? 'active' : ''}
                      style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[2]})` }}
                      onClick={() => setNewHabit({...newHabit, color: c.colors})}
                    />
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>本月目标次数 (选填，填0则不显示进度条)</label>
                <div className="target-counter">
                  <button onClick={() => setNewHabit({...newHabit, target: Math.max(0, newHabit.target - 1)})}>-</button>
                  <input readOnly value={newHabit.target === 0 ? "不设目标" : newHabit.target} />
                  <button onClick={() => setNewHabit({...newHabit, target: newHabit.target + 1})}>+</button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel" onClick={() => setShowAddModal(false)}>取消</button>
              <button className="confirm" onClick={handleAddHabit}>开启岛屿</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* 全局美化样式 */
        .IsleLight-app {
          min-height: 100vh;
          background: #0a0a1a;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .cosmic-bg {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(circle at center, #1a1a3e 0%, #0a0a1a 100%);
        }

        .glow-sphere {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.2;
        }
        .s1 { width: 400px; height: 400px; background: #6366f1; top: -100px; left: -100px; }
        .s2 { width: 300px; height: 300px; background: #ec4899; bottom: -50px; right: -50px; }

        .dashboard-wrapper {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 40px 20px;
        }

        .app-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;
        }
        .brand-box h1 { font-size: 2.5rem; margin: 0; background: linear-gradient(to right, #fff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .brand-box p { color: rgba(255,255,255,0.5); margin-top: 5px; }

        .main-add-btn {
          background: white; color: #0a0a1a; border: none; padding: 12px 24px; border-radius: 16px;
          font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s;
        }

        /* 习惯卡片 */
        .habits-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;
        }

        .habit-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(15px);
          border-radius: 28px; border: 1px solid rgba(255,255,255,0.1);
          padding: 24px; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative; overflow: hidden;
        }
        .habit-card:hover { transform: translateY(-8px); border-color: var(--accent-color); background: rgba(255,255,255,0.06); }

        .card-delete-btn {
          position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.05);
          border: none; color: #ff4d4d; width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s;
        }
        .habit-card:hover .card-delete-btn { opacity: 1; }

        .card-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .icon-sphere {
          width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center;
          justify-content: center; font-size: 24px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        .name-box h3 { margin: 0; font-size: 1.1rem; }
        .streak-tag { font-size: 11px; color: #FFD700; background: rgba(255,215,0,0.1); padding: 2px 8px; border-radius: 20px; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px; }

        .progress-area { margin-bottom: 20px; }
        .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .progress-bar-bg { height: 6px; background: rgba(0,0,0,0.2); border-radius: 10px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 10px; transition: 0.6s ease-out; }

        .quick-check-btn {
          width: 100%; padding: 12px; border: none; border-radius: 14px; color: white;
          font-weight: 700; cursor: pointer; transition: 0.3s;
        }
        .quick-check-btn:active { transform: scale(0.96); }

        /* 详情页 */
        .detail-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
          z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .detail-card {
          background: #151530; width: 100%; max-width: 600px; height: 85vh; border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; overflow: hidden;
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .detail-header { padding: 30px; display: flex; flex-direction: column; align-items: center; position: relative; }
        .back-circle { position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.05); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
        .detail-icon-large { font-size: 64px; margin-bottom: 10px; }
        .detail-stats { display: flex; gap: 20px; color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 10px; }

        .records-container { flex: 1; overflow-y: auto; padding: 0 30px 30px; }
        .section-title { font-size: 1rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .record-item { background: rgba(255,255,255,0.03); padding: 16px; border-radius: 18px; margin-bottom: 12px; }
        .record-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .record-time { font-size: 12px; color: rgba(255,255,255,0.3); }
        .edit-thought-btn { background: none; border: none; color: #6366f1; cursor: pointer; opacity: 0.6; }
        .record-thought { margin: 0; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.9); }
        .empty-hint { color: rgba(255,255,255,0.2); font-style: italic; }

        .thought-editor textarea {
          width: 100%; background: #0a0a1a; border: 1px solid #6366f1; border-radius: 10px;
          color: white; padding: 10px; min-height: 60px; margin-bottom: 8px;
        }
        .editor-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .editor-actions button { background: none; border: none; color: white; cursor: pointer; font-size: 12px; }
        .save-btn { background: #6366f1 !important; padding: 4px 12px; border-radius: 6px; }

        /* 弹窗样式 */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .dream-modal { background: #1a1a3e; width: 90%; max-width: 450px; border-radius: 28px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); }
        .modal-header { display: flex; justify-content: space-between; margin-bottom: 25px; }
        .modal-scroll { max-height: 60vh; overflow-y: auto; padding-right: 5px; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
        .input-group input { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 12px; color: white; }
        
        .icon-select-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .icon-select-grid button { background: rgba(255,255,255,0.05); border: 1px solid transparent; border-radius: 10px; padding: 8px; font-size: 20px; cursor: pointer; }
        .icon-select-grid button.active { border-color: #6366f1; background: rgba(99,102,241,0.2); }

        .color-select-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .color-select-grid button { height: 35px; border-radius: 10px; border: 2px solid transparent; cursor: pointer; }
        .color-select-grid button.active { border-color: white; transform: scale(1.1); }

        .target-counter { display: flex; align-items: center; gap: 15px; }
        .target-counter button { width: 35px; height: 35px; border-radius: 50%; border: none; background: #6366f1; color: white; cursor: pointer; }
        .target-counter input { text-align: center; pointer-events: none; }

        .modal-footer { display: flex; gap: 12px; margin-top: 25px; }
        .modal-footer button { flex: 1; padding: 12px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; }
        .cancel { background: rgba(255,255,255,0.05); color: white; }
        .confirm { background: white; color: #0a0a1a; }
      `}</style>
    </div>
  );
};

export default HabitDashboard;