import React, { useState } from 'react';
import { Screen, User, Block } from './types';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ListScreen } from './screens/ListScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { MissionDetailScreen } from './screens/MissionDetailScreen';
import { SubcategoriesScreen } from './screens/SubcategoriesScreen';
import { TreatmentScreen } from './screens/TreatmentScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ReservedScreen } from './screens/ReservedScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen'; // New Import
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar'; 
import { ScannerModal } from './components/Modals';

// Initial Data moved here for shared state
const initialBlocksData: Block[] = [
  { 
    id: 1, 
    parentRef: 'S/REF', 
    location: 'Rua 04 • Nível 2 • Apto 10', 
    status: 'late', 
    date: 'Ontem',
    subcategory: 'Biela', 
    items: [
      { 
        name: 'BRONZINA DE BIELA', ref: 'BB121 000', brand: 'METAL LEVE', balance: 3,
        lastCount: { user: 'Carlos Silva', date: '20/10', qty: 3 }
      },
      { 
        name: 'BRONZINA DE BIELA', ref: '87998604', brand: 'KS', balance: 2,
        lastCount: { user: 'Mariana Santos', date: '15/10', qty: 2 }
      },
      { 
        name: 'BRONZINA DE BIELA', ref: '10482-A', brand: 'SINTERMETAL', balance: 5,
        lastCount: null 
      }, 
    ]
  },
  { 
    id: 2, 
    parentRef: 'REF: 1029', 
    location: 'Rua 12 • Bloco B', 
    status: 'pending', 
    date: 'Hoje',
    subcategory: 'Pistões',
    items: [
      { 
        name: 'PISTÃO C/ ANÉIS 0,50', ref: 'P9120 050', brand: 'MAHLE', balance: 12,
        lastCount: { user: 'João Pedro', date: 'Hoje', qty: 12 }
      },
    ]
  },
  { 
    id: 3, 
    parentRef: 'S/REF', 
    location: 'Corredor C • Nível 1', 
    status: 'pending', 
    date: 'Hoje',
    subcategory: 'Juntas do Motor',
    items: [
      { 
        name: 'JUNTA CABEÇOTE', ref: '829102', brand: 'SABÓ', balance: 15,
        lastCount: { user: 'Carlos Silva', date: '22/10', qty: 15 }
      },
      { 
        name: 'JUNTA TAPA VÁLVULA', ref: '110293', brand: 'TARANTO', balance: 8,
        lastCount: { user: 'Carlos Silva', date: '22/10', qty: 8 }
      },
    ]
  },
  { 
    id: 4, 
    parentRef: 'REF: 5502', 
    location: 'Rua 01 • Nível 1', 
    status: 'pending', 
    date: 'Amanhã',
    subcategory: 'Filtro de Óleo',
    items: [
      { 
        name: 'FILTRO DE ÓLEO', ref: 'PSL 55', brand: 'TECFIL', balance: 100,
        lastCount: { user: 'Mariana Santos', date: '10/10', qty: 98 }
      },
      { 
        name: 'FILTRO DE ÓLEO', ref: 'LB 55', brand: 'VOX', balance: 50,
        lastCount: { user: 'Mariana Santos', date: '10/10', qty: 50 }
      },
      { 
        name: 'FILTRO DE ÓLEO', ref: 'WO 200', brand: 'WEGA', balance: 20,
        lastCount: { user: 'Mariana Santos', date: '10/10', qty: 20 }
      },
    ]
  },
  { 
    id: 5, 
    parentRef: 'REF: 9912', 
    location: 'Mezanino • Box 4', 
    status: 'late',
    date: '24/10',
    subcategory: 'Bomba D\'água',
    items: [
      { 
        name: "BOMBA D'ÁGUA", ref: 'UB0625', brand: 'URBA', balance: 4,
        lastCount: { user: 'João Pedro', date: '01/09', qty: 4 }
      },
    ]
  }
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocksData);
  const [segmentFilter, setSegmentFilter] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<any | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const reservedCount = blocks.filter(b => b.status === 'progress').length;
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('subcategories');
  };

  const handleSegmentSelect = (segment: string) => {
    setSegmentFilter(segment);
    // Use 'filtered_list' instead of 'list' to keep bottom nav on Dashboard/Hub
    setCurrentScreen('filtered_list');
  };

  const handleReserveBlock = (id: number) => {
    setBlocks(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'progress' } : b
    ));
  };

  const handleStartBlock = (block: any) => {
    setActiveBlock(block);
    setCurrentScreen('mission_detail');
  };

  const handleScanComplete = (code: string) => {
    setShowScanner(false);
    
    let mockBlock;
    
    if (code.startsWith('PRD-')) {
       // Single Item Scan Context
       mockBlock = {
          id: 901,
          contextType: 'product_scan', // Flag for UI
          parentRef: 'BOMBA D\'ÁGUA', // The scanned item name becomes the title
          location: 'Item Avulso',
          status: 'progress',
          items: [
            { 
              name: 'BOMBA D\'ÁGUA', 
              ref: code, 
              brand: 'URBA', 
              balance: 10,
              lastCount: {
                user: 'Mariana Santos',
                date: '24/10',
                qty: 12
              }
            }
          ]
       };
    } else {
       // Location Scan Context
       mockBlock = {
          id: 903,
          contextType: 'location_scan', // Flag for UI
          parentRef: 'ESTANTE 04 - GALPÃO A', // The scanned location becomes the title
          location: 'Corredor Central',
          status: 'progress',
          items: [
            { 
              name: 'ITEM DA ESTANTE A', ref: 'ABC-123', brand: 'GENERICO', balance: 50,
              lastCount: { user: 'Carlos Silva', date: 'Ontem', qty: 50 }
            },
            { 
              name: 'ITEM DA ESTANTE B', ref: 'DEF-456', brand: 'GENERICO', balance: 20,
              lastCount: { user: 'Carlos Silva', date: 'Ontem', qty: 20 }
            }
          ]
       };
    }

    handleStartBlock(mockBlock);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <DashboardScreen 
            onNavigate={setCurrentScreen} 
            onCategorySelect={handleCategorySelect}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
      case 'list':
        // Standard "Meta Diária"
        return (
          <ListScreen 
            key="meta-list" 
            onNavigate={setCurrentScreen} 
            blocks={blocks}
            segmentFilter={null}
            onReserveBlock={handleReserveBlock}
            onClearFilter={() => {}}
            mode="daily_meta"
          />
        );
      case 'filtered_list':
        // Browsing specific Category/Segment from Hub
        return (
          <ListScreen 
            key="browse-list" 
            onNavigate={setCurrentScreen} 
            blocks={blocks}
            segmentFilter={segmentFilter}
            onReserveBlock={handleReserveBlock}
            onClearFilter={() => {
              setSegmentFilter(null);
              setCurrentScreen('dashboard'); 
            }}
            mode="browse"
          />
        );
      case 'reserved':
        return (
          <ReservedScreen 
            onNavigate={setCurrentScreen} 
            blocks={blocks}
            onStartBlock={handleStartBlock}
          />
        );
      case 'history':
        return <HistoryScreen />;
      case 'analytics':
        return <AnalyticsScreen onNavigate={setCurrentScreen} />;
      case 'mission_detail':
        return (
          <MissionDetailScreen 
            blockData={activeBlock} 
            onBack={() => setCurrentScreen('reserved')}
          />
        );
      case 'subcategories':
        return (
          <SubcategoriesScreen 
            category={selectedCategory || ''} 
            onBack={() => setCurrentScreen('dashboard')}
            onSelectSegment={handleSegmentSelect}
          />
        );
      case 'treatment':
        return (
           <TreatmentScreen onNavigate={setCurrentScreen} />
        );
      case 'settings':
        return (
           <SettingsScreen 
             onBack={() => setCurrentScreen('dashboard')} 
             currentUser={currentUser}
           />
        );
      default:
        return (
          <DashboardScreen 
            onNavigate={setCurrentScreen} 
            onCategorySelect={handleCategorySelect}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
    }
  };

  // Logic: Hide bottom nav on Login, Mission Detail, Settings, Treatment, Analytics (Desktop uses Sidebar)
  const showNav = currentScreen !== 'login' && 
                  currentScreen !== 'mission_detail' && 
                  currentScreen !== 'settings' && 
                  currentScreen !== 'treatment' &&
                  currentScreen !== 'analytics';
  
  const isLogin = currentScreen === 'login';

  if (isLogin) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Determine which tab is active. 
  // If we are in subcategories or filtered_list (browsing), we visually stay on 'dashboard' (Hub).
  const activeNavTab = (currentScreen === 'subcategories' || currentScreen === 'filtered_list') 
    ? 'dashboard' 
    : currentScreen;

  return (
    <div className="flex w-full min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      
      {/* Sidebar for Desktop (Hidden on Mobile) */}
      <Sidebar 
        currentScreen={activeNavTab}
        onNavigate={setCurrentScreen}
        currentUser={currentUser}
        onLogout={handleLogout}
        reservedCount={reservedCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative w-full">
           <div className="w-full min-h-full">
             {renderScreen()}
           </div>
        </div>

        {/* Bottom Nav for Mobile (Hidden on Desktop) */}
        {showNav && (
          <BottomNav 
            currentScreen={activeNavTab} 
            onNavigate={setCurrentScreen}
            onScanClick={() => setShowScanner(true)}
            isAdmin={currentUser?.isAdmin} 
            reservedCount={reservedCount}
          />
        )}
      </div>

      <ScannerModal 
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanComplete={handleScanComplete}
        title="Escanear Código"
        instruction="Aponte para o QR Code de um Produto, Prateleira ou Estante"
      />
    </div>
  );
};

export default App;
