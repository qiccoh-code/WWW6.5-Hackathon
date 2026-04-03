import React, { useState, useEffect } from 'react';
import CheckInPage from './CheckInPage_updated';

const HabitDashboard = () => {
  // 状态管理
  const [habits, setHabits] = useState(() => {
    // 从本地存储加载习惯数据
    const saved = localStorage.getItem('islelandHabits');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: '晨间冥想', 
        icon: '🧘', 
        target: 30, 
        current: 12,
        streak: 7,
        color: '#64748b'
      }
    ];
  });
  const [selectedHabit, setSelectedHabit] = useState(null);

  // 保存习惯数据到本地存储
  useEffect(() => {
    localStorage.setItem('islelandHabits', JSON.stringify(habits));
  }, [habits]);

  // 预设爱好图标
  const habitIcons = [
    '🧘', '🏃', '📚', '💪', '🎨', '🎵', 
    '💤', '🥗', '💧', '🚭', '🧠', '💼',
    '🌱', '🧘‍♀️', '🏋️', '🚴', '🎮', '✍️'
  ];

  // 预设颜色
  const habitColors = [
    { name: '深海蓝', value: '#64748b' },
    { name: '森林绿', value: '#22c55e' },
    { name: '阳光橙', value: '#f97316' },
    { name: '天空紫', value: '#8b5cf6' },
    { name: '珊瑚红', value: '#ef4444' },
    { name: '海洋青', value: '#06b6d4' }
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '🎯',
    target: 30,
    color: '#64748b'
  });

  // 快速打卡 - 纯点击计数
  const handleQuickCheckIn = async (habitId) => {
    setHabits(prevHabits =>
      prevHabits.map(h =>
        h.id === habitId
          ? {
              ...h,
              current: h.current + 1,
              streak: h.streak + 1,
              lastCheckIn: new Date().toISOString()
            }
          : h
      )
    );
  };

  // 添加新爱好
  const handleAddHabit = () => {
    if (!newHabit.name.trim()) {
      alert('请输入爱好名称');
      return;
    }

    const habit = {
      id: Date.now(),
      name: newHabit.name,
      icon: newHabit.icon,
      target: newHabit.target,
      current: 0,
      streak: 0,
      color: newHabit.color,
      lastCheckIn: null
    };

    setHabits(prevHabits => [...prevHabits, habit]);
    setNewHabit({ name: '', icon: '🎯', target: 30, color: '#64748b' });
    setShowAddModal(false);
  };

  // 删除爱好
  const handleDeleteHabit = (habitId) => {
    if (window.confirm('确定要删除这个爱好吗？相关记录也会被删除。')) {
      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    }
  };

  // 点击卡片进入详情页
  const handleCardClick = (habit) => {
    setSelectedHabit(habit);
  };

  // 返回主页
  const handleBackToDashboard = () => {
    setSelectedHabit(null);
  };

  // 如果选中了爱好，显示详情页
  if (selectedHabit) {
    return (
      <div className="habit-dashboard-wrapper">
        <CheckInPage 
          habit={selectedHabit}
          onBack={handleBackToDashboard}
          onUpdate={(updatedHabit) => {
            setHabits(prevHabits =>
              prevHabits.map(h =>
                h.id === updatedHabit.id ? updatedHabit : h
              )
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="habit-dashboard">
      {/* 头部 */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Isleland</h1>
        <p className="dashboard-subtitle">你的习惯岛屿</p>
        <div className="header-actions">
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-value">{habits.length}</span>
              <span className="stat-label">爱好</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{habits.reduce((sum, h) => sum + h.current, 0)}</span>
              <span className="stat-label">总打卡</span>
            </div>
          </div>
          <button 
            className="add-habit-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span className="add-icon">+</span>
            添加爱好
          </button>
        </div>
      </div>

      {/* 爱好卡片列表 */}
      <div className="habits-grid">
        {habits.map(habit => (
          <div
            key={habit.id}
            className="habit-card"
            style={{ '--habit-color': habit.color }}
            onClick={() => handleCardClick(habit)}
          >
            {/* 卡片头部 */}
            <div className="card-header">
              <div className="card-icon-wrapper">
                <span className="card-icon">{habit.icon}</span>
              </div>
              <div className="card-info">
                <h3 className="card-title">{habit.name}</h3>
                <p className="card-streak">🔥 连续 {habit.streak} 天</p>
              </div>
              <div 
                className="card-menu-btn"
                onClick={(e) => {
                  e.终止Propagation();
                  handleDeleteHabit(habit.id);
                }}
              >
                ×
              </div>
            </div>

            {/* 进度条 */}
            <div className="card-progress">
              <div className="progress-info">
                <span className="progress-text">本月进度</span>
                <span className="progress-count">{habit.current}/{habit.target}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(habit.current / habit.target) * 100}%`,
                    backgroundColor: habit.color
                  }}
                />
              </div>
            </div>

            {/* 快速打卡按钮 */}
            <button
              className="quick-checkin-btn"
              style={{ backgroundColor: habit.color }}
              onClick={(e) => {
                e.终止Propagation();
                handleQuickCheckIn(habit.id);
              }}
            >
              <span className="checkin-icon">✨</span>
              <span>立即打卡</span>
            </button>

            {/* 展开提示 */}
            <div className="expand-hint">
              <span>点击查看详情</span>
              <span className="expand-arrow">→</span>
            </div>
          </div>
        ))}

        {/* 空状态 */}
        {habits.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌟</div>
            <h3 className="empty-title">还没有添加爱好</h3>
            <p className="empty-desc">点击右上角"添加爱好"按钮，开始你的习惯养成之旅！</p>
          </div>
        )}
      </div>

      {/* 添加爱好弹窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div 
            className="add-modal"
            onClick={(e) => e.终止Propagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">添加新爱好</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* 爱好名称 */}
              <div className="form-group">
                <label className="form-label">爱好名称</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="例如：晨间冥想、每日阅读..."
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>

              {/* 选择图标 */}
              <div className="form-group">
                <label className="form-label">选择图标</label>
                <div className="icon-grid">
                  {habitIcons.map(icon => (
                    <div
                      key={icon}
                      className={`icon-option ${newHabit.icon === icon ? 'selected' : ''}`}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* 选择颜色 */}
              <div className="form-group">
                <label className="form-label">选择颜色</label>
                <div className="color-grid">
                  {habitColors.map(color => (
                    <div
                      key={color.value}
                      className={`color-option ${newHabit.color === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewHabit({ ...newHabit, color: color.value })}
                    >
                      {newHabit.color === color.value && <span className="checkmark">✓</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 目标次数 */}
              <div className="form-group">
                <label className="form-label">本月目标次数</label>
                <div className="target-input-wrapper">
                  <button 
                    className="target-btn"
                    onClick={() => setNewHabit({ ...newHabit, target: Math.max(1, newHabit.target - 1) })}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="target-input"
                    value={newHabit.target}
                    onChange={(e) => setNewHabit({ ...newHabit, target: parseInt(e.target.value) || 1 })}
                  />
                  <button 
                    className="target-btn"
                    onClick={() => setNewHabit({ ...newHabit, target: newHabit.target + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
              <button 
                className="confirm-btn"
                onClick={handleAddHabit}
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .habit-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 50%, #2a2a5e 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* 动态星空背景 */
        .habit-dashboard::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.7) 1px, transparent 1px),
            radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 200px 200px, 300px 300px, 250px 250px, 180px 180px;
          animation: star-twinkle 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes star-twinkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }

        /* 头部 */
        .dashboard-header {
          max-width: 1200px;
          margin: 0 auto 30px;
          padding: 20px 0;
          position: relative;
          z-index: 1;
        }

        .dashboard-title {
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 5px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .dashboard-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 20px 0;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stats-summary {
          display: flex;
          gap: 30px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-habit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(100, 116, 139, 0.3);
        }

        .add-habit-btn:hover {
          box-shadow: 0 6px 30px rgba(100, 116, 139, 0.4);
          transform: translateY(-2px);
        }

        .add-icon {
          font-size: 20px;
          font-weight: 700;
        }

        /* 爱好卡片网格 */
        .habits-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .habit-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .habit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--habit-color, #64748b);
        }

        .habit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: var(--habit-color, rgba(100, 116, 139, 0.3));
        }

        /* 卡片头部 */
        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .card-icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          border: 2px solid var(--habit-color, rgba(100, 116, 139, 0.3));
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .card-info {
          flex: 1;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .card-streak {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .card-menu-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-menu-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        /* 卡片进度 */
        .card-progress {
          margin-bottom: 20px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-count {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* 快速打卡按钮 */
        .quick-checkin-btn {
          width: 100%;
          padding: 14px 20px;
          background: var(--habit-color, #64748b);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          margin-bottom: 12px;
        }

        .quick-checkin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
          filter: brightness(1.1);
        }

        .quick-checkin-btn:active {
          transform: translateY(0);
        }

        .checkin-icon {
          font-size: 18px;
        }

        /* 展开提示 */
        .expand-hint {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .habit-card:hover .expand-hint {
          color: var(--habit-color, rgba(255, 255, 255, 0.8));
        }

        .expand-arrow {
          transition: transform 0.3s ease;
        }

        .habit-card:hover .expand-arrow {
          transform: translateX(4px);
        }

        /* 空状态 */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          border: 2px dashed rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px 0;
        }

        .empty-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* 弹窗 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: modal-appear 0.3s ease-out;
        }

        @keyframes modal-appear {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .add-modal {
          background: linear-gradient(135deg, #1a1a3e 0%, #2a2a5e 100%);
          border-radius: 24px;
          padding: 32px;
          width: 90%;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: modal-slide-up 0.4s ease-out;
        }

        @keyframes modal-slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .form-input {
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 16px;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          border-color: rgba(100, 180, 255, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }

        .icon-option {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-option:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .icon-option.selected {
          background: rgba(100, 180, 255, 0.2);
          border-color: rgba(100, 180, 255, 0.5);
          box-shadow: 0 0 20px rgba(100, 180, 255, 0.3);
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .color-option {
          height: 48px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
        }

        .color-option:hover {
          transform: scale(1.05);
        }

        .color-option.selected {
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .checkmark {
          font-size: 20px;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .target-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .target-btn {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .target-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .target-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          text-align: center;
          outline: none;
        }

        .target-input:focus {
          border-color: rgba(100, 180, 255, 0.5);
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .cancel-btn {
          flex: 1;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .confirm-btn {
          flex: 2;
          padding: 14px 20px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(100, 116, 139, 0.3);
        }

        .confirm-btn:hover {
          box-shadow: 0 6px 30px rgba(100, 116, 139, 0.4);
          transform: translateY(-2px);
        }

        /* 响应式适配 */
        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 28px;
          }

          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .stats-summary {
            justify-content: center;
          }

          .habits-grid {
            grid-template-columns: 1fr;
          }

          .add-modal {
            padding: 24px;
          }

          .modal-header {
            margin-bottom: 20px;
          }

          .modal-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitDashboard;