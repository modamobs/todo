import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Target, 
  TrendingUp 
} from 'lucide-react';

// 타입 정의
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
  completedPomodoros: number;
}

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  totalTime: number;
  currentTodoId: string | null;
}

// 컴포넌트들
const TodoItem: React.FC<{
  todo: Todo;
  isActive: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartTimer: (id: string) => void;
}> = ({ todo, isActive, onToggle, onDelete, onStartTimer }) => {
  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600/20 border-blue-500 shadow-lg' 
        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggle(todo.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              todo.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-400 hover:border-green-400'
            }`}
          >
            {todo.completed && <Check className="w-4 h-4 text-white" />}
          </button>
          <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
            {todo.text}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>{todo.completedPomodoros}/{todo.pomodoros}</span>
          </div>
          <button
            onClick={() => onStartTimer(todo.id)}
            disabled={todo.completed || isActive}
            className={`p-2 rounded-lg transition-colors ${
              todo.completed || isActive
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Timer: React.FC<{
  timer: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  currentTodo: Todo | null;
}> = ({ timer, onStart, onPause, onStop, currentTodo }) => {
  const progress = ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100;
  const minutes = Math.floor(timer.timeLeft / 60);
  const seconds = timer.timeLeft % 60;

  return (
    <div className="bg-gray-800 rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">포모도로 타이머</h2>
      {currentTodo && (
        <p className="text-gray-300 mb-6">현재 작업: {currentTodo.text}</p>
      )}
      
      {/* 원형 진행바 */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* 배경 원 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          {/* 진행 원 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="text-blue-500 transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {Math.round(progress)}% 완료
            </div>
          </div>
        </div>
      </div>

      {/* 타이머 컨트롤 버튼 */}
      <div className="flex justify-center space-x-4">
        {!timer.isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>시작</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Pause className="w-5 h-5" />
            <span>일시정지</span>
          </button>
        )}
        <button
          onClick={onStop}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Square className="w-5 h-5" />
          <span>정지</span>
        </button>
      </div>
    </div>
  );
};

const Statistics: React.FC<{
  todos: Todo[];
}> = ({ todos }) => {
  const totalPomodoros = todos.reduce((sum, todo) => sum + todo.completedPomodoros, 0);
  const totalTime = totalPomodoros * 25; // 25분 per pomodoro
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        통계
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{totalPomodoros}</div>
          <div className="text-sm text-gray-400">완료된 포모도로</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{totalTime}</div>
          <div className="text-sm text-gray-400">총 집중 시간 (분)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">{completedTodos}</div>
          <div className="text-sm text-gray-400">완료된 할 일</div>
        </div>
      </div>
    </div>
  );
};

// 메인 컴포넌트
const PomodoroTodo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    timeLeft: 25 * 60, // 25분
    totalTime: 25 * 60,
    currentTodoId: null,
  });

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<{ play: () => void } | null>(null);

  // localStorage에서 데이터 로드
  useEffect(() => {
    const savedTodos = localStorage.getItem('pomodoro-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // todos 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('pomodoro-todos', JSON.stringify(todos));
  }, [todos]);

  // 알림음 설정
  useEffect(() => {
    // 간단한 알림음 생성 (Web Audio API 사용)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const createBeep = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    audioRef.current = { play: createBeep };
  }, []);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 타이머 로직
  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            // 타이머 완료
            handleTimerComplete();
            return {
              ...prev,
              isRunning: false,
              timeLeft: 0,
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimerComplete = () => {
    // 알림음 재생
    if (audioRef.current) {
      audioRef.current.play();
    }

    // 브라우저 알림
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('포모도로 완료!', {
        body: '25분 집중 시간이 완료되었습니다. 휴식을 취하세요!',
        icon: '/vite.svg',
      });
    }

    // 완료된 포모도로 수 증가
    if (timer.currentTodoId) {
      setTodos(prev => prev.map(todo => 
        todo.id === timer.currentTodoId 
          ? { ...todo, completedPomodoros: todo.completedPomodoros + 1 }
          : todo
      ));
    }
  };

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        pomodoros: 1,
        completedPomodoros: 0,
      };
      setTodos(prev => [...prev, newTodo]);
      setNewTodoText('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    if (timer.currentTodoId === id) {
      stopTimer();
    }
  };

  const startTimer = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo && !todo.completed) {
      setTimer({
        isRunning: true,
        isPaused: false,
        timeLeft: 25 * 60,
        totalTime: 25 * 60,
        currentTodoId: todoId,
      });
    }
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const stopTimer = () => {
    setTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 25 * 60,
      totalTime: 25 * 60,
      currentTodoId: null,
    });
  };

  const currentTodo = todos.find(todo => todo.id === timer.currentTodoId) || null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <Clock className="w-10 h-10 mr-3 text-blue-400" />
            포모도로 투두
          </h1>
          <p className="text-gray-400">집중력 향상을 위한 할 일 관리 앱</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 타이머 섹션 */}
          <div>
            <Timer
              timer={timer}
              onStart={() => timer.currentTodoId && startTimer(timer.currentTodoId)}
              onPause={pauseTimer}
              onStop={stopTimer}
              currentTodo={currentTodo}
            />
          </div>

          {/* 통계 섹션 */}
          <div>
            <Statistics todos={todos} />
          </div>
        </div>

        {/* 할 일 추가 */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">새 할 일 추가</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="할 일을 입력하세요..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addTodo}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>추가</span>
            </button>
          </div>
        </div>

        {/* 할 일 목록 */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">할 일 목록</h2>
          {todos.length === 0 ? (
            <p className="text-gray-400 text-center py-8">아직 할 일이 없습니다. 위에서 새 할 일을 추가해보세요!</p>
          ) : (
            <div className="space-y-4">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isActive={timer.currentTodoId === todo.id}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onStartTimer={startTimer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTodo;
