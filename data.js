/* ============================================================
   ASPEM — data.js  |  Camada de dados (localStorage)
   ============================================================ */

// ── STATUS DEFINITIONS ──────────────────────────────────────
const STATUS = {
  pendente:  { label: 'Aguardando Aprovação', color: '#F59E0B', bg: '#FEF3C7', icon: '⏳' },
  aprovado:  { label: 'Aprovado',             color: '#3B82F6', bg: '#EFF6FF', icon: '✅' },
  cotacao:   { label: 'Em Cotação',           color: '#8B5CF6', bg: '#F5F3FF', icon: '🔍' },
  pedido:    { label: 'Pedido Efetuado',      color: '#06B6D4', bg: '#ECFEFF', icon: '📦' },
  entregue:  { label: 'Entregue',            color: '#10B981', bg: '#ECFDF5', icon: '🎯' },
  rejeitado: { label: 'Rejeitado',            color: '#EF4444', bg: '#FEF2F2', icon: '❌' },
};

const ROLES = {
  obra:        'Equipe de Obra',
  coordenador: 'Coordenador de Materiais',
  compras:     'Gestora de Compras',
  gestao:      'Gestão / Diretoria',
  admin:       'Administrador de Sistema',
};

const UNITS = ['br', 'un', 'm', 'm²', 'kg', 'cx', 'rolo', 'par', 'conj', 'pct', 'gl'];

// ── STORAGE KEYS ─────────────────────────────────────────────
const KEYS = {
  users:         'aspem_users_v2',
  materials:     'aspem_materials_v2',
  requisitions:  'aspem_requisitions',
  lastReqNum:    'aspem_last_req_num',
  permissions:   'aspem_permissions_v2',
  clientes:      'aspem_clientes_v1',
  oses:          'aspem_oses_v1',
  budgets:       'aspem_budgets_v2',
};

// ── DATA RESET / MIGRATION ────────────────────────────────────
const DATA_VERSION = 'v10';
if (localStorage.getItem('aspem_data_version') !== DATA_VERSION) {
  localStorage.clear();
  localStorage.setItem('aspem_data_version', DATA_VERSION);
}

// ── DATE HELPERS ─────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; }
function daysFwd(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; }
function fmtDate(s) { if (!s) return '—'; const [y,m,d] = s.split('-'); return `${d}/${m}/${y}`; }

// ── DEFAULT DATA ─────────────────────────────────────────────
const DEFAULT_USERS = [
  { id:1, name:'Jose Luiz',    username:'jose.luiz',    password:'123456', role:'obra',        clienteId:1, avatar:'JL' },
  { id:2, name:'Jose Roberto', username:'jose.roberto', password:'123456', role:'obra',        clienteId:2, avatar:'JR' },
  { id:3, name:'Marcos Cesar', username:'marcos.cesar', password:'123456', role:'coordenador', clienteId:null, avatar:'MC' },
  { id:4, name:'Debora',       username:'debora',       password:'123456', role:'compras',     clienteId:null, avatar:'DE' },
  { id:5, name:'Sergio',       username:'sergio',       password:'123456', role:'gestao',      clienteId:null, avatar:'SE' },
  { id:6, name:'Admin',        username:'admin',        password:'admin',  role:'admin',       clienteId:null, avatar:'AD' },
];


const DEFAULT_CLIENTES = [
  { id:1, name:'Energética Brasil S.A.', active:true },
  { id:2, name:'Indústrias Metalmax', active:true },
  { id:3, name:'TechData Soluções', active:true },
  { id:4, name:'Construtora Horizonte', active:true },
];

const DEFAULT_OSES = [
  { id:1, clienteId:1, osNumber:'2024-001', description:'Subestação Norte — instalação painel secundário', active:true },
  { id:2, clienteId:1, osNumber:'2024-002', description:'Subestação Norte — SPDA e aterramento', active:true },
  { id:3, clienteId:2, osNumber:'2024-003', description:'Planta Industrial Sul — infraestrutura elétrica', active:true },
  { id:4, clienteId:3, osNumber:'2024-004', description:'Data Center Leste — cabeamento estruturado', active:true },
  { id:5, clienteId:4, osNumber:'2024-005', description:'Torre Comercial — luminárias e acabamentos', active:true },
];

const DEFAULT_PERMISSIONS = {
  obra:        ['list', 'new-req', 'detail'],
  coordenador: ['list', 'detail'],
  compras:     ['list', 'detail'],
  gestao:      ['list', 'dashboard', 'detail', 'materials'],
  admin:       ['list', 'dashboard', 'detail', 'materials', 'admin-panel'],
};

const DEFAULT_MATERIALS = [
  {
    "category": "Acabamentos",
    "name": "Abraçadeira para poste - 240 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1
  },
  {
    "category": "Acabamentos",
    "name": "Abraçadeira para poste - 250 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 2
  },
  {
    "category": "Acabamentos",
    "name": "Abraçadeira para poste - 290 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 3
  },
  {
    "category": "Acabamentos",
    "name": "Abraçadeira para poste - 320 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 4
  },
  {
    "category": "Acabamentos",
    "name": "Abraçadeira para poste - 340 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 5
  },
  {
    "category": "Acabamentos",
    "name": "Armação secundária 1x1 pesada",
    "defaultUnit": "un",
    "active": true,
    "id": 6
  },
  {
    "category": "Acabamentos",
    "name": "Arruela de 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 7
  },
  {
    "category": "Acabamentos",
    "name": "Arruela de 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 8
  },
  {
    "category": "Acabamentos",
    "name": "Arruela lisa 1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 9
  },
  {
    "category": "Acabamentos",
    "name": "Arruela lisa em aço inox 1/4\" - TEL 5303",
    "defaultUnit": "un",
    "active": true,
    "id": 10
  },
  {
    "category": "Acabamentos",
    "name": "Arruela quadrada M18",
    "defaultUnit": "un",
    "active": true,
    "id": 11
  },
  {
    "category": "Acabamentos",
    "name": "Balancim para grampo \"C\"",
    "defaultUnit": "un",
    "active": true,
    "id": 12
  },
  {
    "category": "Acabamentos",
    "name": "Barra de cobre de 1.1/2\" x 3.1/16\"",
    "defaultUnit": "m",
    "active": true,
    "id": 13
  },
  {
    "category": "Acabamentos",
    "name": "Box curvo de 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 14
  },
  {
    "category": "Acabamentos",
    "name": "Box reto de 1\" com bucha e arruela",
    "defaultUnit": "un",
    "active": true,
    "id": 15
  },
  {
    "category": "Acabamentos",
    "name": "Bucha de 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 16
  },
  {
    "category": "Acabamentos",
    "name": "Bucha de 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 17
  },
  {
    "category": "Acabamentos",
    "name": "Cela para cruzeta",
    "defaultUnit": "un",
    "active": true,
    "id": 18
  },
  {
    "category": "Acabamentos",
    "name": "Chumbador Ø 1/4\" UR",
    "defaultUnit": "un",
    "active": true,
    "id": 19
  },
  {
    "category": "Acabamentos",
    "name": "Cruzeta de madeira de 90x90x2000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 20
  },
  {
    "category": "Acabamentos",
    "name": "Gancho curto para perfilado",
    "defaultUnit": "un",
    "active": true,
    "id": 21
  },
  {
    "category": "Acabamentos",
    "name": "Isolador tipo bujão 45 x 45 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 22
  },
  {
    "category": "Acabamentos",
    "name": "Isolador tipo disco de 6\"",
    "defaultUnit": "un",
    "active": true,
    "id": 23
  },
  {
    "category": "Acabamentos",
    "name": "Isolador tipo pino classe 25 kV",
    "defaultUnit": "un",
    "active": true,
    "id": 24
  },
  {
    "category": "Acabamentos",
    "name": "Isolador tipo roldana de 76x79 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 25
  },
  {
    "category": "Acabamentos",
    "name": "Luvas de raspa",
    "defaultUnit": "un",
    "active": true,
    "id": 26
  },
  {
    "category": "Acabamentos",
    "name": "Manilha sapatilha",
    "defaultUnit": "un",
    "active": true,
    "id": 27
  },
  {
    "category": "Acabamentos",
    "name": "Mão francesa tipo beco 990 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 28
  },
  {
    "category": "Acabamentos",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 29
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso autotarrachante em aço inox - Ø 4,2x32mm",
    "defaultUnit": "un",
    "active": true,
    "id": 30
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso autotarrachante em aço inox Ø 4,2 x 50mm - TEL 5385",
    "defaultUnit": "un",
    "active": true,
    "id": 31
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso cabeça chata em inox fenda simples - Ø 1/4\"x3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 32
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso cabeça de lentilha auto travante 1/4\" x  1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 33
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso duplo M16 x 500 mm com 4 porcas e arruelas",
    "defaultUnit": "un",
    "active": true,
    "id": 34
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso francês M16 x 150 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 35
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso francês M16 x 45 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 36
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso francês M16 x 75 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 37
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso sextavado em aço inox Ø 1/4\" x 1.1/4\" - TEL 5329",
    "defaultUnit": "un",
    "active": true,
    "id": 38
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso sextavado rosca soberpa em inox Ø M6 x 60mm com bucha de nylon Ø 6mm",
    "defaultUnit": "un",
    "active": true,
    "id": 39
  },
  {
    "category": "Acabamentos",
    "name": "Parafuso sextavado Ø 1/4\" x 5/8\"",
    "defaultUnit": "un",
    "active": true,
    "id": 40
  },
  {
    "category": "Acabamentos",
    "name": "Pino para isolador 25 kV",
    "defaultUnit": "un",
    "active": true,
    "id": 41
  },
  {
    "category": "Acabamentos",
    "name": "Placa \"Não manobrar com carga.\"",
    "defaultUnit": "un",
    "active": true,
    "id": 42
  },
  {
    "category": "Acabamentos",
    "name": "Placa \"Perigo de morte.\"",
    "defaultUnit": "un",
    "active": true,
    "id": 43
  },
  {
    "category": "Acabamentos",
    "name": "Porca olhal",
    "defaultUnit": "un",
    "active": true,
    "id": 44
  },
  {
    "category": "Acabamentos",
    "name": "Porca sextavada em inox - Ø 1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 45
  },
  {
    "category": "Acabamentos",
    "name": "Porca sextavada Ø 1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 46
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha para perfilado 19x19",
    "defaultUnit": "un",
    "active": true,
    "id": 47
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha para perfilado 38x38",
    "defaultUnit": "un",
    "active": true,
    "id": 48
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 49
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 50
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 51
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 52
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 53
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 54
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 55
  },
  {
    "category": "Acabamentos",
    "name": "Saída horizontal de eletrocalha/perfilado para eletroduto de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 56
  },
  {
    "category": "Acabamentos",
    "name": "Suporte de escada 340 mm com cinta",
    "defaultUnit": "un",
    "active": true,
    "id": 57
  },
  {
    "category": "Acabamentos",
    "name": "Suporte de para-raio",
    "defaultUnit": "un",
    "active": true,
    "id": 58
  },
  {
    "category": "Acabamentos",
    "name": "Suporte para chave seccionadora",
    "defaultUnit": "un",
    "active": true,
    "id": 59
  },
  {
    "category": "Acabamentos",
    "name": "Suporte para transformador tipo 3 - 285 mm",
    "defaultUnit": "un",
    "active": true,
    "id": 60
  },
  {
    "category": "Acabamentos",
    "name": "Tampa reforçada em ferro fundido com escotilha Ø 30cm - TEL 536",
    "defaultUnit": "un",
    "active": true,
    "id": 61
  },
  {
    "category": "Acabamentos",
    "name": "Terminal estanhado de 2 furos e 1 compressão - 185mm²",
    "defaultUnit": "un",
    "active": true,
    "id": 62
  },
  {
    "category": "Acabamentos",
    "name": "Terminal estanhado de 2 furos e 1 compressão - 240mm²",
    "defaultUnit": "un",
    "active": true,
    "id": 63
  },
  {
    "category": "Acabamentos",
    "name": "Tratamento químico",
    "defaultUnit": "un",
    "active": true,
    "id": 64
  },
  {
    "category": "Acabamentos",
    "name": "Vara de manobra de 3 m",
    "defaultUnit": "un",
    "active": true,
    "id": 65
  },
  {
    "category": "Acabamentos",
    "name": "NO-BREAK conforme projeto",
    "defaultUnit": "un",
    "active": true,
    "id": 66
  },
  {
    "category": "Acabamentos",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 67
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 68
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 112,5 kVA, 23.1 kV/220-127V",
    "defaultUnit": "un",
    "active": true,
    "id": 69
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 112,5 kVA, 23.1 kV/220-127V completo",
    "defaultUnit": "un",
    "active": true,
    "id": 70
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 150 kVA, 23.1 kV/220-127V",
    "defaultUnit": "un",
    "active": true,
    "id": 71
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 150 kVA, 23.1 kV/220-127V completo",
    "defaultUnit": "un",
    "active": true,
    "id": 72
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 225 kVA, 23.1 kV/220-127V",
    "defaultUnit": "un",
    "active": true,
    "id": 73
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 225 kVA, 23.1 kV/220-127V completo",
    "defaultUnit": "un",
    "active": true,
    "id": 74
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 300 kVA, 23.1 kV/220-127V",
    "defaultUnit": "un",
    "active": true,
    "id": 75
  },
  {
    "category": "Infraestrutura",
    "name": "Posto primário simplificado de 300 kVA, 23.1 kV/220-127V completo",
    "defaultUnit": "un",
    "active": true,
    "id": 76
  },
  {
    "category": "Infraestrutura",
    "name": "Chave load buster de 100A/25 kV - NBI: 150 kV",
    "defaultUnit": "un",
    "active": true,
    "id": 77
  },
  {
    "category": "Infraestrutura",
    "name": "Disjuntor tipo caixa moldada de 300A, 220V, Icu: 20kA, com ajuste de tolerância de 10%",
    "defaultUnit": "un",
    "active": true,
    "id": 78
  },
  {
    "category": "Infraestrutura",
    "name": "Disjuntor tipo caixa moldada de 400A, 220V, Icu: 20kA, com ajuste de tolerância de 10%",
    "defaultUnit": "un",
    "active": true,
    "id": 79
  },
  {
    "category": "Infraestrutura",
    "name": "Disjuntor tipo caixa moldada de 600A, 220V, Icu: 20kA, com ajuste de tolerância de 10%",
    "defaultUnit": "un",
    "active": true,
    "id": 80
  },
  {
    "category": "Infraestrutura",
    "name": "Disjuntor tipo caixa moldada de 800A, 220V, Icu: 20kA, com ajuste de tolerância de 10%",
    "defaultUnit": "un",
    "active": true,
    "id": 81
  },
  {
    "category": "Infraestrutura",
    "name": "Elo fusível 3H",
    "defaultUnit": "un",
    "active": true,
    "id": 82
  },
  {
    "category": "Infraestrutura",
    "name": "Elo fusível 5K",
    "defaultUnit": "un",
    "active": true,
    "id": 83
  },
  {
    "category": "Infraestrutura",
    "name": "Elo fusível 6K",
    "defaultUnit": "un",
    "active": true,
    "id": 84
  },
  {
    "category": "Infraestrutura",
    "name": "Elo fusível 8K",
    "defaultUnit": "un",
    "active": true,
    "id": 85
  },
  {
    "category": "Infraestrutura",
    "name": "Extintor CO2 6 kg",
    "defaultUnit": "un",
    "active": true,
    "id": 86
  },
  {
    "category": "Infraestrutura",
    "name": "Mufla de 4\" classe 25 kV",
    "defaultUnit": "un",
    "active": true,
    "id": 87
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 88
  },
  {
    "category": "Infraestrutura",
    "name": "Par de luvas de borracha classe 3",
    "defaultUnit": "un",
    "active": true,
    "id": 89
  },
  {
    "category": "Infraestrutura",
    "name": "Para-raio polimérico 21 kV - 10 kA",
    "defaultUnit": "un",
    "active": true,
    "id": 90
  },
  {
    "category": "Infraestrutura",
    "name": "Poste circular de 12 m tração 1000 daN",
    "defaultUnit": "un",
    "active": true,
    "id": 91
  },
  {
    "category": "Infraestrutura",
    "name": "Terminal estanhado de 2 furos e 1 compressão - 185mm²",
    "defaultUnit": "un",
    "active": true,
    "id": 92
  },
  {
    "category": "Infraestrutura",
    "name": "Transformador de serviço de 150 kVA, 23.1 kV/220-127V, massa com óleo\\<1200Kg-NTE-049-1",
    "defaultUnit": "un",
    "active": true,
    "id": 93
  },
  {
    "category": "Infraestrutura",
    "name": "Transformador de serviço de 225 kVA, 23.1 kV/220-127V, massa com óleo\\<1200Kg-NTE-049-1",
    "defaultUnit": "un",
    "active": true,
    "id": 94
  },
  {
    "category": "Infraestrutura",
    "name": "Transformador de serviço de 300 kVA, 23.1 kV/220-127V, massa com óleo\\<1200Kg-NTE-049-1",
    "defaultUnit": "un",
    "active": true,
    "id": 95
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo multipolar flexível, isolação PVC 1kV, 3x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 96
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 1,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 97
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 1,5mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 98
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 1,5mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 99
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 1,5mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 100
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 10mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 101
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 10mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 102
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 10mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 103
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 10mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 104
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 120mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 105
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 120mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 106
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 120mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 107
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 120mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 108
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 150mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 109
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 150mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 110
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 150mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 111
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 150mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 112
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 16mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 113
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 16mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 114
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 16mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 115
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 16mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 116
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 185mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 117
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 185mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 118
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 185mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 119
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 185mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 120
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 2,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 121
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 2,5mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 122
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 2,5mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 123
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 2,5mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 124
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 240mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 125
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 240mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 126
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 240mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 127
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 240mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 128
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 25mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 129
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 25mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 130
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 25mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 131
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 25mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 132
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 35mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 133
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 35mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 134
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 35mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 135
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 35mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 136
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 4mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 137
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 4mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 138
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 4mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 139
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 4mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 140
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 50mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 141
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 50mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 142
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 50mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 143
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 50mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 144
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 6mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 145
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 6mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 146
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 6mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 147
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 6mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 148
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 70mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 149
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 70mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 150
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 70mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 151
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 70mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 152
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 95mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 153
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 95mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 154
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 95mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 155
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação EPR 90° 0,6/1kV, seção 95mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 156
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 1,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 157
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 1,5mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 158
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 1,5mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 159
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 1,5mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 160
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 10mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 161
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 10mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 162
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 10mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 163
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 10mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 164
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 120mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 165
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 120mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 166
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 120mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 167
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 120mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 168
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 150mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 169
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 150mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 170
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 150mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 171
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 150mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 172
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 16mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 173
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 16mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 174
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 16mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 175
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 16mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 176
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 185mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 177
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 185mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 178
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 185mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 179
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 185mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 180
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 2,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 181
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 2,5mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 182
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 2,5mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 183
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 2,5mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 184
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 240mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 185
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 240mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 186
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 240mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 187
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 240mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 188
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 25mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 189
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 25mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 190
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 25mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 191
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 25mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 192
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 35mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 193
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 35mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 194
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 35mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 195
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 35mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 196
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 4mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 197
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 4mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 198
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 4mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 199
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 4mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 200
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 50mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 201
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 50mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 202
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 50mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 203
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 50mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 204
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 6mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 205
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 6mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 206
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 6mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 207
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 6mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 208
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 70mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 209
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 70mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 210
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 70mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 211
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 70mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 212
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 95mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 213
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 95mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 214
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 95mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 215
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo unipolar flexível, isolação PVC 70° 0,6/1kV, seção 95mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 216
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 1,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 217
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 1,5mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 218
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 1,5mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 219
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 1,5mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 220
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 10mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 221
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 10mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 222
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 10mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 223
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 10mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 224
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 120mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 225
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 120mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 226
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 120mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 227
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 120mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 228
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 150mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 229
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 150mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 230
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 150mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 231
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 150mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 232
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 16mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 233
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 16mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 234
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 16mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 235
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 16mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 236
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 185mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 237
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 185mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 238
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 185mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 239
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 185mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 240
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 2,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 241
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 2,5mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 242
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 2,5mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 243
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 2,5mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 244
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 240mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 245
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 240mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 246
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 240mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 247
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 240mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 248
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 25mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 249
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 25mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 250
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 25mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 251
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 25mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 252
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 35mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 253
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 35mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 254
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 35mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 255
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 35mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 256
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 4mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 257
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 4mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 258
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 4mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 259
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 50mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 260
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 50mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 261
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 50mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 262
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 50mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 263
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 6mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 264
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 6mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 265
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 6mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 266
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 6mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 267
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 70mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 268
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 70mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 269
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 70mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 270
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 70mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 271
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 95mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 272
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 95mm² - neutro - cor azul claro",
    "defaultUnit": "m",
    "active": true,
    "id": 273
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 95mm² - proteção (PE) - cor verde",
    "defaultUnit": "m",
    "active": true,
    "id": 274
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado flexível, isolação PVC 70° 450/750V, seção 95mm² - retorno - cor cinza ou amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 275
  },
  {
    "category": "Infraestrutura",
    "name": "Condutor isolado sólido, isolação PVC 70° 450/750V, seção 2,5mm² - fase - cor vermelho, preto ou branco",
    "defaultUnit": "m",
    "active": true,
    "id": 276
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 277
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 278
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor 127V blindada à prova do tempo",
    "defaultUnit": "un",
    "active": true,
    "id": 279
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor 127V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 280
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 281
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor 220V blindada à prova do tempo",
    "defaultUnit": "un",
    "active": true,
    "id": 282
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor 220V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 283
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor fechada para subestação, 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 284
  },
  {
    "category": "Luminárias",
    "name": "Arandela de parede de sobrepor fechada para subestação, 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 285
  },
  {
    "category": "Luminárias",
    "name": "LUMINÁRIA INDUSTRIAL LED TIPO HIGH BAY 150W",
    "defaultUnit": "un",
    "active": true,
    "id": 286
  },
  {
    "category": "Luminárias",
    "name": "LUMINÁRIA INDUSTRIAL LED TIPO HIGH BAY 75W",
    "defaultUnit": "un",
    "active": true,
    "id": 287
  },
  {
    "category": "Luminárias",
    "name": "LUMINÁRIA LED TIPO HIGH BAY 150W",
    "defaultUnit": "un",
    "active": true,
    "id": 288
  },
  {
    "category": "Luminárias",
    "name": "LUMINÁRIA LED TIPO HIGH BAY 75W",
    "defaultUnit": "un",
    "active": true,
    "id": 289
  },
  {
    "category": "Luminárias",
    "name": "LUMINÁRIA QUADRADA DE SOBREPOR, INSTALAÇÃO EM PERFILADO - 34W TC-6500",
    "defaultUnit": "un",
    "active": true,
    "id": 290
  },
  {
    "category": "Luminárias",
    "name": "Luminária de balizamento de piso, à prova do tempo, com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 291
  },
  {
    "category": "Luminárias",
    "name": "Luminária de balizamento no piso para lâmpada fluorescente compacta 1x30W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 292
  },
  {
    "category": "Luminárias",
    "name": "Luminária de balizamento no piso para lâmpada fluorescente compacta 1x30W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 293
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 294
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 2 soquetes E27",
    "defaultUnit": "un",
    "active": true,
    "id": 295
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 4 soquetes G13",
    "defaultUnit": "un",
    "active": true,
    "id": 296
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 4 soquetes G13 com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 297
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 4 soquetes G13 com proteção acrílica e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 298
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 4 soquetes G13 e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 299
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 8 soquetes G13",
    "defaultUnit": "un",
    "active": true,
    "id": 300
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 8 soquetes G13 com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 301
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 8 soquetes G13 com proteção acrílica e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 302
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro com 8 soquetes G13 e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 303
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 1x25W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 304
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 1x25W - 127V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 305
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 1x25W - 220V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 306
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 2x25W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 307
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 2x25W - 127V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 308
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 2x25W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 309
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente compacta 2x25W - 220V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 310
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 311
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 127V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 312
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 127V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 313
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 127V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 314
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 315
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 220V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 316
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 220V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 317
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x16W - 220V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 318
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 319
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 127V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 320
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 127V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 321
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 127V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 322
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 323
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 220V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 324
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 2x32W - 220V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 325
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 326
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 127V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 327
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 127V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 328
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 127V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 329
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 330
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 220V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 331
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 220V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 332
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada fluorescente tubular 4x16W - 220V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 333
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro para lâmpada led tubular 2x20W - 220V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 334
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir em forro tipo spot para lâmpada de LED de 10W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 335
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir para lâmpada fluorescente compacta 1x25W - 127V à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 336
  },
  {
    "category": "Luminárias",
    "name": "Luminária de embutir para lâmpada fluorescente compacta 1x25W - 220V à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 337
  },
  {
    "category": "Luminárias",
    "name": "Luminária de parede tipo balizador de embutir com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 338
  },
  {
    "category": "Luminárias",
    "name": "Luminária de parede tipo balizador de embutir para lâmpada fluorescente compacta integrada de 30W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 339
  },
  {
    "category": "Luminárias",
    "name": "Luminária de parede tipo balizador de embutir para lâmpada fluorescente compacta integrada de 30W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 340
  },
  {
    "category": "Luminárias",
    "name": "Luminária de parede tipo balizador de embutir, à prova do tempo, com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 341
  },
  {
    "category": "Luminárias",
    "name": "Luminária de parede tipo balizador de embutir, à prova do tempo, para lâmpada fluorescente compacta integrada de 30W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 342
  },
  {
    "category": "Luminárias",
    "name": "Luminária de parede tipo balizador de embutir, à prova do tempo, para lâmpada fluorescente compacta integrada de 30W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 343
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 344
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 1 soquete E27 e ventilador de teto",
    "defaultUnit": "un",
    "active": true,
    "id": 345
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 2 soquetes E27",
    "defaultUnit": "un",
    "active": true,
    "id": 346
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 4 bases G13",
    "defaultUnit": "un",
    "active": true,
    "id": 347
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 4 bases G13 com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 348
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 4 bases G13 com proteção acrílica e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 349
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 4 bases G13 e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 350
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 8 bases G13",
    "defaultUnit": "un",
    "active": true,
    "id": 351
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 8 bases G13 com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 352
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 8 bases G13 com proteção acrílica e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 353
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor com 8 bases G13 e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 354
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 355
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 127V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 356
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 127V com ventilador de teto",
    "defaultUnit": "un",
    "active": true,
    "id": 357
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 127V à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 358
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 359
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 220V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 360
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 220V com ventilador de teto",
    "defaultUnit": "un",
    "active": true,
    "id": 361
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 1x25W - 220V à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 362
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 2x25W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 363
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 2x25W - 127V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 364
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 2x25W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 365
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente compacta 2x25W - 220V com sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 366
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 367
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 127V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 368
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 127V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 369
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 127V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 370
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 371
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 220V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 372
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 220V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 373
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x16W - 220V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 374
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 375
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 127V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 376
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 127V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 377
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 127V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 378
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 220V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 379
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 220V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 380
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 2x32W - 220V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 381
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 382
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 127V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 383
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 127V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 384
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 127V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 385
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 386
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 220V com proteção acrílica",
    "defaultUnit": "un",
    "active": true,
    "id": 387
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 220V com proteção acrílica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 388
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada fluorescente tubular 4x16W - 220V para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 389
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor para lâmpada led tubular 2x20W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 390
  },
  {
    "category": "Luminárias",
    "name": "Luminária de sobrepor tipo spot para lâmpada de LED de 10W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 391
  },
  {
    "category": "Luminárias",
    "name": "Luminária decorativa de parede tipo globo leitoso, à prova do tempo, com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 392
  },
  {
    "category": "Luminárias",
    "name": "Luminária decorativa de parede tipo globo leitoso, à prova do tempo, para lâmpada fluorescente compacta integrada de 85W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 393
  },
  {
    "category": "Luminárias",
    "name": "Luminária decorativa de parede tipo globo leitoso, à prova do tempo, para lâmpada fluorescente compacta integrada de 85W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 394
  },
  {
    "category": "Luminárias",
    "name": "Luminária decorativa tipo globo leitoso, fixação em poste, à prova do tempo, com 1 soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 395
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada de vapor metálico com base E40",
    "defaultUnit": "un",
    "active": true,
    "id": 396
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada de vapor metálico, base E40, 250W - 220V - fixação em eletrocalha/perfilado",
    "defaultUnit": "un",
    "active": true,
    "id": 397
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada de vapor metálico, base E40, 250W - 220V - fixação em estrutura metálica",
    "defaultUnit": "un",
    "active": true,
    "id": 398
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada de vapor metálico, base E40, 400W - 220V - fixação em eletrocalha/perfilado",
    "defaultUnit": "un",
    "active": true,
    "id": 399
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada de vapor metálico, base E40, 400W - 220V - fixação em estrutura metálica",
    "defaultUnit": "un",
    "active": true,
    "id": 400
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada fluorescente tubular HO com 4 bases R17D",
    "defaultUnit": "un",
    "active": true,
    "id": 401
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada fluorescente tubular HO com 4 bases R17D e inversor tipo gasparzinho com baterias para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 402
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada fluorescente tubular HO, base R17D, 2x110W - 220V - fixação em estrutura metálica",
    "defaultUnit": "un",
    "active": true,
    "id": 403
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada fluorescente tubular HO, base R17D, 2x110W - 220V para iluminação de emergência - fixação em eletrocalha/perfilado",
    "defaultUnit": "un",
    "active": true,
    "id": 404
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpada fluorescente tubular HO, base R17D, 2x110W - 220V para iluminação de emergência - fixação em estrutura metálica",
    "defaultUnit": "un",
    "active": true,
    "id": 405
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpadaled 54W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 406
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial de sobrepor para lâmpadaled 54W - 220V - fixação em eletrocalha/perfilado",
    "defaultUnit": "un",
    "active": true,
    "id": 407
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial prismática de sobrepor para lâmpada de vapor metálico com base E40",
    "defaultUnit": "un",
    "active": true,
    "id": 408
  },
  {
    "category": "Luminárias",
    "name": "Luminária industrial prismática de sobrepor para lâmpada de vapor metálico, base E40, 400W - 220V - fixação em estrutura metálica",
    "defaultUnit": "un",
    "active": true,
    "id": 409
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo arandela de parede de sobrepor",
    "defaultUnit": "un",
    "active": true,
    "id": 410
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo arandela de parede de sobrepor blindada à prova do tempo",
    "defaultUnit": "un",
    "active": true,
    "id": 411
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo arandela de parede de sobrepor, 45°, fechada, com grade e globo de vidro de proteção",
    "defaultUnit": "un",
    "active": true,
    "id": 412
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo projetor de piso para lâmpada de vapor metálico 70W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 413
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo projetor subaquático para lâmpada fluorescente compacta integrada de 85W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 414
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo pétala retangular, com alojamento para equipamento auxiliar, fixação em poste, à prova do tempo, com base E40 para lâmpada de 150W",
    "defaultUnit": "un",
    "active": true,
    "id": 415
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo pétala retangular, com alojamento para equipamento auxiliar, fixação em poste, à prova do tempo, com base E40 para lâmpada de 250W",
    "defaultUnit": "un",
    "active": true,
    "id": 416
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo pétala retangular, fixação em poste, à prova do tempo, LED 100W",
    "defaultUnit": "un",
    "active": true,
    "id": 417
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo pétala retangular, fixação em poste, à prova do tempo, LED 150W",
    "defaultUnit": "un",
    "active": true,
    "id": 418
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo pétala retangular, fixação em poste, à prova do tempo, LED de 150W",
    "defaultUnit": "un",
    "active": true,
    "id": 419
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo pétala, com alojamento para equipamento auxiliar, fixação em poste, à prova do tempo,  lâmpada LED 100W",
    "defaultUnit": "un",
    "active": true,
    "id": 420
  },
  {
    "category": "Luminárias",
    "name": "Luminária tipo refletor subaquático para piscina",
    "defaultUnit": "un",
    "active": true,
    "id": 421
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de LED para piscina, 50W - 12V",
    "defaultUnit": "un",
    "active": true,
    "id": 422
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de LED tipo bola, soquete E27, 15W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 423
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de LED tipo dicróica, soquete GU5.3, 10W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 424
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de vapor metálico, base E40, 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 425
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de vapor metálico, base E40, 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 426
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de vapor metálico, base E40, 400W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 427
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada de vapor metálico, base E40, 70W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 428
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente compacta integrada, soquete E27, 25W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 429
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente compacta integrada, soquete E27, 25W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 430
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente compacta integrada, soquete E27, 30W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 431
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente compacta integrada, soquete E27, 30W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 432
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente compacta integrada, soquete E27, 85W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 433
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente compacta integrada, soquete E27, 85W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 434
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular HO T12, base R17D, 110W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 435
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, base G13, 16W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 436
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, base G13, 16W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 437
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, base G13, 32W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 438
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, base G13, 32W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 439
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, soquete G13, 16W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 440
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, soquete G13, 16W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 441
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, soquete G13, 32W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 442
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada fluorescente tubular T8, soquete G13, 32W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 443
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada led tubular T8, base G13, 20W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 444
  },
  {
    "category": "Luminárias",
    "name": "Lâmpada led tubular T8, soquete G13, 20W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 445
  },
  {
    "category": "Luminárias",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 446
  },
  {
    "category": "Luminárias",
    "name": "PAINEL LED EMBUTIR 22x22cm 18w",
    "defaultUnit": "un",
    "active": true,
    "id": 447
  },
  {
    "category": "Luminárias",
    "name": "PAINEL LED EMBUTIR COM ALETAS 60x60cm 44w TC-6500",
    "defaultUnit": "un",
    "active": true,
    "id": 448
  },
  {
    "category": "Luminárias",
    "name": "PAINEL LED EMBUTIR FECHADA COM ACRILICO LEITOSO 60x60cm 44w TC-6500",
    "defaultUnit": "un",
    "active": true,
    "id": 449
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com 2 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 450
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com 2 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 451
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com 3 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 452
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com 3 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 453
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com 4 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 454
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com 4 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 455
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com cruzeta e 3 projetores para lâmpada de vapor metálico de 400W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 456
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com luminária tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 457
  },
  {
    "category": "Luminárias",
    "name": "Poste de 10m com luminária tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 458
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com 2 luminárias tipo pétala LED 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 459
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com 2 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 460
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com 3 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 461
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com 3 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 462
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com 4 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 463
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com 4 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 464
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com luminária tipo pétala retangular para lâmpada LED 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 465
  },
  {
    "category": "Luminárias",
    "name": "Poste de 12m com luminária tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 466
  },
  {
    "category": "Luminárias",
    "name": "Poste de 3m com 2 luminárias tipo globo leitoso para lâmpada PL de 85W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 467
  },
  {
    "category": "Luminárias",
    "name": "Poste de 3m com 2 luminárias tipo globo leitoso para lâmpada PL de 85W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 468
  },
  {
    "category": "Luminárias",
    "name": "Poste de 3m com 4 luminárias tipo globo leitoso para lâmpada PL de 85W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 469
  },
  {
    "category": "Luminárias",
    "name": "Poste de 3m com 4 luminárias tipo globo leitoso para lâmpada PL de 85W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 470
  },
  {
    "category": "Luminárias",
    "name": "Poste de 3m com luminária tipo globo leitoso para lâmpada PL de 85W - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 471
  },
  {
    "category": "Luminárias",
    "name": "Poste de 3m com luminária tipo globo leitoso para lâmpada PL de 85W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 472
  },
  {
    "category": "Luminárias",
    "name": "Poste de 7m com 2 luminárias tipo pétala, lâmpada LED de 100W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 473
  },
  {
    "category": "Luminárias",
    "name": "Poste de 7m com luminária tipo pétala retangular para lâmpada LED de 100W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 474
  },
  {
    "category": "Luminárias",
    "name": "Poste de 8m com 2 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 475
  },
  {
    "category": "Luminárias",
    "name": "Poste de 8m com 3 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 476
  },
  {
    "category": "Luminárias",
    "name": "Poste de 8m com 3 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 477
  },
  {
    "category": "Luminárias",
    "name": "Poste de 8m com 4 luminárias tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 478
  },
  {
    "category": "Luminárias",
    "name": "Poste de 8m com 4 luminárias tipo pétala retangular para lâmpada de vapor metálico de 250W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 479
  },
  {
    "category": "Luminárias",
    "name": "Poste de 8m com luminária tipo pétala retangular para lâmpada de vapor metálico de 150W - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 480
  },
  {
    "category": "Luminárias",
    "name": "Poste em aço zincado de 3m, para fixação de luminária tipo globo leitoso",
    "defaultUnit": "un",
    "active": true,
    "id": 481
  },
  {
    "category": "Luminárias",
    "name": "Poste em aço zincado flangeado de 10m, com abertura para inspeção em h=3m, com suporte tipo cruzeta em aço zincado para 3 projetores",
    "defaultUnit": "un",
    "active": true,
    "id": 482
  },
  {
    "category": "Luminárias",
    "name": "Poste em aço zincado flangeado de 10m, com abertura para inspeção em h=3m, para fixação de luminária tipo globo leitoso",
    "defaultUnit": "un",
    "active": true,
    "id": 483
  },
  {
    "category": "Luminárias",
    "name": "Poste em aço zincado flangeado de 12m, com abertura para inspeção em h=3m, para fixação de luminária tipo globo leitoso",
    "defaultUnit": "un",
    "active": true,
    "id": 484
  },
  {
    "category": "Luminárias",
    "name": "Poste em aço zincado flangeado de 7m, com abertura para inspeção em h=3m, para fixação de luminária tipo globo leitoso",
    "defaultUnit": "un",
    "active": true,
    "id": 485
  },
  {
    "category": "Luminárias",
    "name": "Poste em aço zincado flangeado de 8m, com abertura para inspeção em h=3m, para fixação de luminária tipo globo leitoso",
    "defaultUnit": "un",
    "active": true,
    "id": 486
  },
  {
    "category": "Luminárias",
    "name": "Projetor de piso à prova do tempo com base E40",
    "defaultUnit": "un",
    "active": true,
    "id": 487
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, LED 100W",
    "defaultUnit": "un",
    "active": true,
    "id": 488
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, com base E40, para lâmpada de vapor metálico de 400W",
    "defaultUnit": "un",
    "active": true,
    "id": 489
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, para LED 100W - fixação em parede com condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 490
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, para lâmpada de vapor metálico de 400W - fixação em parede",
    "defaultUnit": "un",
    "active": true,
    "id": 491
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, para lâmpada de vapor metálico de 400W - fixação em poste de 10m",
    "defaultUnit": "un",
    "active": true,
    "id": 492
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, para lâmpada de vapor metálico de 400W - fixação em poste de 12m",
    "defaultUnit": "un",
    "active": true,
    "id": 493
  },
  {
    "category": "Luminárias",
    "name": "Projetor fechado, à prova do tempo, para lâmpada de vapor metálico de 400W - fixação em poste de 8m",
    "defaultUnit": "un",
    "active": true,
    "id": 494
  },
  {
    "category": "Luminárias",
    "name": "Projetor subaquático com soquete E27",
    "defaultUnit": "un",
    "active": true,
    "id": 495
  },
  {
    "category": "Luminárias",
    "name": "Projetor à prova do tempo com base E40 para lâmpada de vapor metálico de 400W, com alojamento para equipamento auxiliar",
    "defaultUnit": "un",
    "active": true,
    "id": 496
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para 2 lâmpadas fluorescente tubular HO de 110W",
    "defaultUnit": "un",
    "active": true,
    "id": 497
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para 2 lâmpadas tubulares de 16W",
    "defaultUnit": "un",
    "active": true,
    "id": 498
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para 2 lâmpadas tubulares de 32W",
    "defaultUnit": "un",
    "active": true,
    "id": 499
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para lâmpada de vapor metálico de 150W",
    "defaultUnit": "un",
    "active": true,
    "id": 500
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para lâmpada de vapor metálico de 250W",
    "defaultUnit": "un",
    "active": true,
    "id": 501
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para lâmpada de vapor metálico de 400W",
    "defaultUnit": "un",
    "active": true,
    "id": 502
  },
  {
    "category": "Luminárias",
    "name": "Reator eletrônico bivolt para lâmpada de vapor metálico de 70W",
    "defaultUnit": "un",
    "active": true,
    "id": 503
  },
  {
    "category": "Luminárias",
    "name": "Refletor subaquático para piscina, de embutir em parede para lâmpada de LED",
    "defaultUnit": "un",
    "active": true,
    "id": 504
  },
  {
    "category": "Luminárias",
    "name": "Sensor de presença",
    "defaultUnit": "un",
    "active": true,
    "id": 505
  },
  {
    "category": "Luminárias",
    "name": "Sensor de presença com fotocélula bivolt",
    "defaultUnit": "un",
    "active": true,
    "id": 506
  },
  {
    "category": "Luminárias",
    "name": "Sinalizador de garagem sequencial",
    "defaultUnit": "un",
    "active": true,
    "id": 507
  },
  {
    "category": "Luminárias",
    "name": "Sinalizador de garagem sequencial com 2 soquetes E27",
    "defaultUnit": "un",
    "active": true,
    "id": 508
  },
  {
    "category": "Luminárias",
    "name": "Soquete GU5.3",
    "defaultUnit": "un",
    "active": true,
    "id": 509
  },
  {
    "category": "Luminárias",
    "name": "Spot de embutir em forro",
    "defaultUnit": "un",
    "active": true,
    "id": 510
  },
  {
    "category": "Luminárias",
    "name": "Spot de sobrepor",
    "defaultUnit": "un",
    "active": true,
    "id": 511
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 512
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 513
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 514
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 515
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 516
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 517
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 518
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 519
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 520
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 521
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 522
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 523
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 524
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 525
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 526
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" horizontal 90° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 527
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 528
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 529
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 530
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 531
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 532
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 533
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 534
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 535
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 536
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 537
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 538
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 539
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 540
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 541
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 542
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida lateral tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 543
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 544
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 545
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 546
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 547
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 548
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 549
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 550
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 551
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 552
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 553
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 554
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 555
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 556
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 557
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 558
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de descida tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 559
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 560
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 561
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 562
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 563
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 564
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 565
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 566
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 567
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 568
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 569
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 570
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 571
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 572
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 573
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 574
  },
  {
    "category": "Infraestrutura",
    "name": "\"T\" vertical de subida tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 575
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de ligação no piso tipo B-12, Ø 16cm, h=11,6cm, com saída Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 576
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 2x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 577
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 3x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 578
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 4x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 579
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 6x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 580
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem de PVC de embutir 4x2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 581
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem de PVC de embutir 4x4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 582
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem de PVC de embutir, à prova do tempo, 4x2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 583
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem de PVC octagonal de embutir no teto tipo FM2 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 584
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para interfone/TV tipo R1 - 60x35x80cm",
    "defaultUnit": "un",
    "active": true,
    "id": 585
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para interfone/TV tipo R1 - 60x35x80cm (medidas internas) - padrão telefônica",
    "defaultUnit": "un",
    "active": true,
    "id": 586
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para interfone/TV tipo R2 - 107x52x80cm",
    "defaultUnit": "un",
    "active": true,
    "id": 587
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para interfone/TV tipo R2 - 107x52x80cm (medidas internas) - padrão telefônica",
    "defaultUnit": "un",
    "active": true,
    "id": 588
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para telefone tipo R1 - 60x35x80cm",
    "defaultUnit": "un",
    "active": true,
    "id": 589
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para telefone tipo R1 - 60x35x80cm (medidas internas) - padrão telefônica",
    "defaultUnit": "un",
    "active": true,
    "id": 590
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para telefone tipo R2 - 107x52x80cm",
    "defaultUnit": "un",
    "active": true,
    "id": 591
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem em alvenaria com chassis para telefone tipo R2 - 107x52x80cm (medidas internas) - padrão telefônica",
    "defaultUnit": "un",
    "active": true,
    "id": 592
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de embutir na parede de 20x20x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 593
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de embutir na parede de 40x40x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 594
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de embutir na parede de 60x60x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 595
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de embutir na parede de 80x80x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 596
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de sobrepor na parede de 20x20x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 597
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de sobrepor na parede de 40x40x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 598
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de sobrepor na parede de 60x60x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 599
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de sobrepor na parede de 80x80x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 600
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem metálica de sobrepor no teto tipo \"T\" de 60x90x15cm com dispositivo para lacre",
    "defaultUnit": "un",
    "active": true,
    "id": 601
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso aterrada em alvenaria tipo CP6 - 40x40x60cm",
    "defaultUnit": "un",
    "active": true,
    "id": 602
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso aterrada em alvenaria tipo CP6 - 40x40x60cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 603
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso aterrada em alvenaria tipo CP7 - 60x60x100cm",
    "defaultUnit": "un",
    "active": true,
    "id": 604
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso aterrada em alvenaria tipo CP7 - 60x60x100cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 605
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso aterrada em alvenaria tipo CP8 - 80x80x100cm",
    "defaultUnit": "un",
    "active": true,
    "id": 606
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso aterrada em alvenaria tipo CP8 - 80x80x100cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 607
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso em alvenaria tipo CP1 - 40x40x60cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 608
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso em alvenaria tipo CP2 - 50x50x100cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 609
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso em alvenaria tipo CP3 - 80x80x100cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 610
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso em alvenaria tipo CP4 - 80x80x100cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 611
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem no piso em alvenaria tipo CP5 - 100x100x100cm (medidas internas), com tampa de concreto para energia elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 612
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de embutir na parede de 20x20x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 613
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de embutir na parede de 40x40x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 614
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de embutir na parede de 60x60x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 615
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de embutir na parede de 80x80x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 616
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de sobrepor na parede de 20x20x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 617
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de sobrepor na parede de 40x40x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 618
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de sobrepor na parede de 60x60x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 619
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem termoplástica de sobrepor na parede de 80x80x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 620
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 2x70mm, h=76mm para canaleta de piso com 2 tomadas de energia e 1 tomada de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 621
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 2x70mm, h=76mm para canaleta de piso com 2 tomadas de energia e 2 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 622
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 2x70mm, h=76mm para canaleta de piso com 4 tomadas de energia e 4 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 623
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 2x70mm, h=76mm para canaleta de piso com 8 tomadas de energia e 8 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 624
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 3x70mm, h=76mm para canaleta de piso com 2 tomadas de energia e 2 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 625
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 3x70mm, h=76mm para canaleta de piso com 4 tomadas de energia e 4 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 626
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 3x70mm, h=76mm para canaleta de piso com 8 tomadas de energia e 8 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 627
  },
  {
    "category": "Infraestrutura",
    "name": "Canaleta DLP evolutiva de parede em PVC 150x50mm",
    "defaultUnit": "m",
    "active": true,
    "id": 628
  },
  {
    "category": "Infraestrutura",
    "name": "Canaleta de piso 25x140mm",
    "defaultUnit": "m",
    "active": true,
    "id": 629
  },
  {
    "category": "Infraestrutura",
    "name": "Canaleta de piso 25x70mm",
    "defaultUnit": "m",
    "active": true,
    "id": 630
  },
  {
    "category": "Infraestrutura",
    "name": "Cantoneira \"ZZ\" alta 38x19mm",
    "defaultUnit": "un",
    "active": true,
    "id": 631
  },
  {
    "category": "Infraestrutura",
    "name": "Cantoneira \"ZZ\" alta 38x38mm",
    "defaultUnit": "un",
    "active": true,
    "id": 632
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 1\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 633
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 1.1/2\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 634
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 1.1/4\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 635
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 2\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 636
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 2.1/2\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 637
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 3\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 638
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 3/4\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 639
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 4\" tipo \"X\"",
    "defaultUnit": "un",
    "active": true,
    "id": 640
  },
  {
    "category": "Infraestrutura",
    "name": "Cotovelo 90° para canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 641
  },
  {
    "category": "Infraestrutura",
    "name": "Cotovelo externo para canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 642
  },
  {
    "category": "Infraestrutura",
    "name": "Cotovelo interno para canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 643
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 644
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 645
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 646
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 647
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 648
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 649
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 650
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 651
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 652
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 653
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 654
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 655
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 656
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 657
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 658
  },
  {
    "category": "Infraestrutura",
    "name": "Cruzeta horizontal 90° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 659
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 660
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 661
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 662
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 663
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 664
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 665
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 666
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 45° de PVC rígido de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 667
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 668
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 669
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 670
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 671
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 672
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 673
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 674
  },
  {
    "category": "Infraestrutura",
    "name": "Curva 90° de PVC rígido de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 675
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 676
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 677
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 678
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 679
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 680
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 681
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 682
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 683
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 684
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 685
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 686
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 687
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 688
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 689
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 690
  },
  {
    "category": "Infraestrutura",
    "name": "Curva de inversão tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 691
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 692
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 693
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 694
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 695
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 696
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 697
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 698
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 699
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 700
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 701
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 702
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 703
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 704
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 705
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 706
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 45° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 707
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 708
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 709
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 710
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 711
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 712
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 713
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 714
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 715
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 716
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 717
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 718
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 719
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 720
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 721
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 722
  },
  {
    "category": "Infraestrutura",
    "name": "Curva horizontal 90° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 723
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 724
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 725
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 726
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 727
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 728
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 729
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 730
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço galvanizado Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 731
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 732
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 733
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 734
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 735
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 736
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 737
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 738
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 45° em aço zincado à fogo Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 739
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 740
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 741
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 742
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 743
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 744
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 745
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 746
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço galvanizado Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 747
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 748
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 749
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 750
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 751
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 2.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 752
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 753
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 754
  },
  {
    "category": "Infraestrutura",
    "name": "Curva média 90° em aço zincado à fogo Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 755
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 756
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 757
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 758
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 759
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 760
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 761
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 762
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 763
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 764
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 765
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 766
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 767
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 768
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 769
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 770
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 45° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 771
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 772
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 773
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 774
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 775
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 776
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 777
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 778
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 779
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 780
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 781
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 782
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 783
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 784
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 785
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 786
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical externa 90° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 787
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 788
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 789
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 790
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 791
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 792
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 793
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 794
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 795
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 796
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 797
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 798
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 799
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 800
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 801
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 802
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 45° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 803
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 804
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 805
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 806
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 807
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 808
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 809
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 810
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 811
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 812
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 813
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 814
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 815
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 816
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 817
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 818
  },
  {
    "category": "Infraestrutura",
    "name": "Curva vertical interna 90° tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 819
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 820
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 821
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 822
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 823
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 824
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 825
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 826
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 827
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 828
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 829
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 830
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 831
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 832
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 833
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 834
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à direita tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 835
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 836
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 837
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 838
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 839
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 840
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 841
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 842
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 843
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 844
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 845
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 846
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 847
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 848
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 400x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 849
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 500x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 850
  },
  {
    "category": "Infraestrutura",
    "name": "Desvio à esquerda tipo \"U\" para eletrocalha 600x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 851
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 100x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 852
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 100x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 853
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 100x50 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 854
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 100x50 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 855
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 150x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 856
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 150x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 857
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 200x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 858
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 200x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 859
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 300x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 860
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 300x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 861
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 400x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 862
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 400x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 863
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 500x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 864
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 500x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 865
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 600x100 - fixada em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 866
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha 600x100 - fixada em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 867
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 100x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 868
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 100x100x3000mm galvanizada a fogo, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 869
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 100x50x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 870
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 150x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 871
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 200x100x3000mm ANTICORROSÃO (MAGNELIS), peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 872
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 200x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 873
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 300x100x3000mm ANTICORROSÃO (MAGNELIS), peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 874
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 300x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 875
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 400x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 876
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 500x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 877
  },
  {
    "category": "Infraestrutura",
    "name": "Eletrocalha perfurada 600x100x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 878
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 1\"",
    "defaultUnit": "m",
    "active": true,
    "id": 879
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 1\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 880
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 1.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 881
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 1.1/2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 882
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 1.1/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 883
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 1.1/4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 884
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 885
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 886
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 2.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 887
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 2.1/2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 888
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 3\"",
    "defaultUnit": "m",
    "active": true,
    "id": 889
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 3\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 890
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 3/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 891
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 3/4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 892
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 893
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto PVC rígido de Ø 4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 894
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 1\"",
    "defaultUnit": "m",
    "active": true,
    "id": 895
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 1.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 896
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 1.1/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 897
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 898
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 2.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 899
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 3\"",
    "defaultUnit": "m",
    "active": true,
    "id": 900
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 3/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 901
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de PVC de Ø 4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 902
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 1\"",
    "defaultUnit": "m",
    "active": true,
    "id": 903
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 1.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 904
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 1.1/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 905
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 906
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 2.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 907
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 3\"",
    "defaultUnit": "m",
    "active": true,
    "id": 908
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 3/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 909
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto flexível corrugado de alta densidade tipo PEAD de Ø 4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 910
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 1\"",
    "defaultUnit": "m",
    "active": true,
    "id": 911
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 1.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 912
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 1.1/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 913
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 914
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 2.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 915
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 3\"",
    "defaultUnit": "m",
    "active": true,
    "id": 916
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 3/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 917
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado de Ø 4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 918
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço ANTICORROSÃO (MAGNELIS) de Ø 4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 919
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço ANTICORROSÃO (MAGNELIS) tipo médio de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 920
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 1.1/2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 921
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 1.1/4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 922
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 923
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 2.1/2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 924
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 3\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 925
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 926
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço gavanizado tipo médio de Ø 3/4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 927
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 928
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 1.1/2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 929
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 1.1/4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 930
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 931
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 2.1/2\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 932
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 3\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 933
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 3/4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 934
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço zincado à fogo tipo médio de Ø 4\", barra de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 935
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 1\"",
    "defaultUnit": "m",
    "active": true,
    "id": 936
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 1.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 937
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 1.1/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 938
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 939
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 2.1/2\"",
    "defaultUnit": "m",
    "active": true,
    "id": 940
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 3\"",
    "defaultUnit": "m",
    "active": true,
    "id": 941
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 3/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 942
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto zincado à fogo de Ø 4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 943
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" com 1 furo",
    "defaultUnit": "un",
    "active": true,
    "id": 944
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" com 2 furos",
    "defaultUnit": "un",
    "active": true,
    "id": 945
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" em alumínio para piso com tampa tipo unha",
    "defaultUnit": "un",
    "active": true,
    "id": 946
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" para 1 módulo",
    "defaultUnit": "un",
    "active": true,
    "id": 947
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" para 1 módulo para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 948
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" para 1 módulo à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 949
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" para 2 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 950
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" para 2 módulos para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 951
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x2\" para 3 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 952
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x4\" com 1 furo",
    "defaultUnit": "un",
    "active": true,
    "id": 953
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x4\" em alumínio para piso com tampa tipo unha dupla",
    "defaultUnit": "un",
    "active": true,
    "id": 954
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x4\" para 4 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 955
  },
  {
    "category": "Infraestrutura",
    "name": "Espelho de interruptor 4x4\" para 6 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 956
  },
  {
    "category": "Infraestrutura",
    "name": "Gancho curto para fixação de luminária em perfilado",
    "defaultUnit": "un",
    "active": true,
    "id": 957
  },
  {
    "category": "Infraestrutura",
    "name": "Grampo \"C\" Ø 3/8\"",
    "defaultUnit": "un",
    "active": true,
    "id": 958
  },
  {
    "category": "Infraestrutura",
    "name": "Grampo de sustentação para canaleta DLP evolutiva 150x50mm",
    "defaultUnit": "m",
    "active": true,
    "id": 959
  },
  {
    "category": "Infraestrutura",
    "name": "Junção interna \"L\" para perfilado 19x19",
    "defaultUnit": "un",
    "active": true,
    "id": 960
  },
  {
    "category": "Infraestrutura",
    "name": "Junção interna \"L\" para perfilado 38x38",
    "defaultUnit": "un",
    "active": true,
    "id": 961
  },
  {
    "category": "Infraestrutura",
    "name": "Junção interna \"T\" para perfilado 19x19",
    "defaultUnit": "un",
    "active": true,
    "id": 962
  },
  {
    "category": "Infraestrutura",
    "name": "Junção interna \"T\" para perfilado 38x38",
    "defaultUnit": "un",
    "active": true,
    "id": 963
  },
  {
    "category": "Infraestrutura",
    "name": "Junção interna \"X\" para perfilado 19x19",
    "defaultUnit": "un",
    "active": true,
    "id": 964
  },
  {
    "category": "Infraestrutura",
    "name": "Junção interna \"X\" para perfilado 38x38",
    "defaultUnit": "un",
    "active": true,
    "id": 965
  },
  {
    "category": "Infraestrutura",
    "name": "Junção para canaleta de piso 25x140mm",
    "defaultUnit": "un",
    "active": true,
    "id": 966
  },
  {
    "category": "Infraestrutura",
    "name": "Junção para canaleta de piso 25x70mm",
    "defaultUnit": "un",
    "active": true,
    "id": 967
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 100x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 968
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 100x100mm galvanizado a fogo",
    "defaultUnit": "un",
    "active": true,
    "id": 969
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 100x50mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 970
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 150x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 971
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 200x100mm ANTICORROSÃO (MAGNELIS)",
    "defaultUnit": "un",
    "active": true,
    "id": 972
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 200x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 973
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 300x100mm ANTICORROSÃO (MAGNELIS)",
    "defaultUnit": "un",
    "active": true,
    "id": 974
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 300x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 975
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 400x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 976
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 500x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 977
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para eletrocalha de 600x100mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 978
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para perfilado de 38x19mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 979
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para perfilado de 38x38mm em aço pré zincado chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 980
  },
  {
    "category": "Infraestrutura",
    "name": "Junção simples para perfilado de 38x38mm galvanizado a fogo",
    "defaultUnit": "un",
    "active": true,
    "id": 981
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 982
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 983
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 984
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 985
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 2.1/2\"\"",
    "defaultUnit": "un",
    "active": true,
    "id": 986
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 987
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 988
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de PVC rígido para eletroduto de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 989
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de canaleta DLP evolutiva 150x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 990
  },
  {
    "category": "Infraestrutura",
    "name": "Luva de tampa para canaleta DLP evolutiva 150x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 991
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço ANTICORROSÃO (MAGNELIS) para eletroduto de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 992
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 993
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 994
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 995
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 996
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 2.1/2\"\"",
    "defaultUnit": "un",
    "active": true,
    "id": 997
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 998
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 999
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1000
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 1\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1001
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 1.1/2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1002
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 1.1/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1003
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1004
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 2.1/2\"\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1005
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 3\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1006
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 3/4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1007
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço zincado à fogo para eletroduto de Ø 4\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1008
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 1009
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado 38x19 - fixado em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 1010
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado 38x19 - fixado em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 1011
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado 38x38 - fixado em estrutura metálica",
    "defaultUnit": "br",
    "active": true,
    "id": 1012
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado 38x38 - fixado em laje",
    "defaultUnit": "br",
    "active": true,
    "id": 1013
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado perfurado 38x19x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 1014
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado perfurado 38x38x3000mm em aço pré zincado chapa #16, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 1015
  },
  {
    "category": "Infraestrutura",
    "name": "Perfilado perfurado 38x38x3000mm galvanizado a fogo, peça de 3m",
    "defaultUnit": "br",
    "active": true,
    "id": 1016
  },
  {
    "category": "Infraestrutura",
    "name": "Placa para mecanismo Pial Plus 1 posto para canaleta DLP Evolutiva",
    "defaultUnit": "un",
    "active": true,
    "id": 1017
  },
  {
    "category": "Infraestrutura",
    "name": "Placa para mecanismo Pial Plus 2 postos para canaleta DLP Evolutiva",
    "defaultUnit": "un",
    "active": true,
    "id": 1018
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 200x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1019
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 300x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1020
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 300x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1021
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 400x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1022
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 400x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1023
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 400x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1024
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 500x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1025
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 500x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1026
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 500x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1027
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 500x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1028
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 600x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1029
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 600x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1030
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 600x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1031
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 600x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1032
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica de eletrocalha 600x100 para 500x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1033
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 200x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1034
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 300x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1035
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 300x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1036
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 400x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1037
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 400x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1038
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 400x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1039
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 500x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1040
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 500x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1041
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 500x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1042
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 500x100 para 400x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1043
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 600x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1044
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 600x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1045
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 600x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1046
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 600x100 para 400x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1047
  },
  {
    "category": "Infraestrutura",
    "name": "Redução concêntrica tipo \"U\" de eletrocalha 600x100 para 500x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1048
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 200x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1049
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 300x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1050
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 300x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1051
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 400x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1052
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 400x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1053
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 400x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1054
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 500x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1055
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 500x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1056
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 500x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1057
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 500x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1058
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 600x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1059
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 600x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1060
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 600x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1061
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 600x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1062
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita de eletrocalha 600x100 para 500x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1063
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 200x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1064
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 300x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1065
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 300x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1066
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 400x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1067
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 400x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1068
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 400x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1069
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 500x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1070
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 500x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1071
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 500x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1072
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 500x100 para 400x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1073
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 600x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1074
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 600x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1075
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 600x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1076
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 600x100 para 400x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1077
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à direita tipo \"U\" de eletrocalha 600x100 para 500x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1078
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 200x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1079
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 300x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1080
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 300x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1081
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 400x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1082
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 400x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1083
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 400x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1084
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 500x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1085
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 500x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1086
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 500x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1087
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 500x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1088
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 600x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1089
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 600x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1090
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 600x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1091
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 600x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1092
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda de eletrocalha 600x100 para 500x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1093
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 200x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1094
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 300x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1095
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 300x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1096
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 400x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1097
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 400x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1098
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 400x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1099
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 500x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1100
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 500x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1101
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 500x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1102
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 500x100 para 400x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1103
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 600x100 para 100x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1104
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 600x100 para 200x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1105
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 600x100 para 300x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1106
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 600x100 para 400x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1107
  },
  {
    "category": "Infraestrutura",
    "name": "Redução à esquerda tipo \"U\" de eletrocalha 600x100 para 500x100 em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1108
  },
  {
    "category": "Infraestrutura",
    "name": "Sapata interna para perfilado 19x19",
    "defaultUnit": "un",
    "active": true,
    "id": 1109
  },
  {
    "category": "Infraestrutura",
    "name": "Sapata interna para perfilado 38x38",
    "defaultUnit": "un",
    "active": true,
    "id": 1110
  },
  {
    "category": "Infraestrutura",
    "name": "Separador para canaleta DLP evolutiva 150x50mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1111
  },
  {
    "category": "Infraestrutura",
    "name": "Separador para cotovelo externo de canaleta DLP evolutiva 150x50mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1112
  },
  {
    "category": "Infraestrutura",
    "name": "Separador para cotovelo interno de canaleta DLP evolutiva 150x50mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1113
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte 4x2\" para 3 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 1114
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte 4x2\" para 3 módulos para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1115
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte 4x2\" para piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1116
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte 4x4\" para 3 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 1117
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte 4x4\" para 6 módulos",
    "defaultUnit": "un",
    "active": true,
    "id": 1118
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte 4x4\" para piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1119
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte de fixação para canaleta de piso 25x140mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1120
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte de fixação para canaleta de piso 25x280mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1121
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte de fixação para canaleta de piso 25x70mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1122
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte para eletrocalha tipo perfilado em aço pré zincado à fogo chapa #16, peça de 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 1123
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 100x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1124
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 100x100mm galvanizado a fogo",
    "defaultUnit": "un",
    "active": true,
    "id": 1125
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 100x50mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1126
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 150x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1127
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 200x100mm ANTICORROSÃO (MAGNELIS)",
    "defaultUnit": "un",
    "active": true,
    "id": 1128
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 200x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1129
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 300x100mm ANTICORROSÃO (MAGNELIS)",
    "defaultUnit": "un",
    "active": true,
    "id": 1130
  },
  {
    "category": "Infraestrutura",
    "name": "Suporte vertical para eletrocalha de 300x100mm em aço pré zincado à fogo chapa #16",
    "defaultUnit": "un",
    "active": true,
    "id": 1131
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa de ferro com a inscrição \"INTERFONE/TV\" para caixa de passagem de piso de 107x52x80cm (medidas internas)",
    "defaultUnit": "un",
    "active": true,
    "id": 1132
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa de ferro com a inscrição \"INTERFONE/TV\" para caixa de passagem de piso de 60x35x80cm (medidas internas)",
    "defaultUnit": "un",
    "active": true,
    "id": 1133
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa de ferro com a inscrição \"TELEFONE\" para caixa de passagem de piso de 107x52x80cm (medidas internas)",
    "defaultUnit": "un",
    "active": true,
    "id": 1134
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa de ferro com a inscrição \"TELEFONE\" para caixa de passagem de piso de 60x35x80cm (medidas internas)",
    "defaultUnit": "un",
    "active": true,
    "id": 1135
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1136
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1137
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1138
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1139
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1140
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1141
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1142
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" horizontal 90° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1143
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1144
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1145
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1146
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1147
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1148
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1149
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1150
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida lateral tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1151
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1152
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1153
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1154
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1155
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1156
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1157
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1158
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de descida tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1159
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1160
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1161
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1162
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1163
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1164
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1165
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1166
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para \"T\" vertical de subida tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1167
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1168
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1169
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1170
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1171
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1172
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1173
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1174
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para cruzeta horizontal 90° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1175
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1176
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1177
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1178
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1179
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1180
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1181
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1182
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva de inversão tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1183
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1184
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1185
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1186
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1187
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1188
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1189
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1190
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 45° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1191
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1192
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1193
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1194
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1195
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1196
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1197
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1198
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva horizontal 90° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1199
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1200
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1201
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1202
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1203
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1204
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1205
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1206
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 45° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1207
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1208
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1209
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1210
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1211
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1212
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1213
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1214
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical externa 90° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1215
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1216
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1217
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1218
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1219
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1220
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1221
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1222
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 45° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1223
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1224
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1225
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1226
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1227
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1228
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1229
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1230
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para curva vertical interna 90° tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1231
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1232
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1233
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1234
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1235
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1236
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1237
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1238
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à direita tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1239
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 100x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1240
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 100x50mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1241
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 150x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1242
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 200x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1243
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 300x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1244
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 400x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1245
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 500x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1246
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para desvio à esquerda tipo \"U\" para eletrocalha 600x100mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1247
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 100x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1248
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 100x50x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1249
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 150x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1250
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 200x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1251
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 300x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1252
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 400x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1253
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 500x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1254
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para eletrocalha 600x100x3000mm",
    "defaultUnit": "un",
    "active": true,
    "id": 1255
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 200x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1256
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 300x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1257
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 300x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1258
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 400x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1259
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 400x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1260
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 400x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1261
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 500x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1262
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 500x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1263
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 500x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1264
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 500x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1265
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 600x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1266
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 600x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1267
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 600x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1268
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 600x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1269
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução concêntrica tipo \"U\" de eletrocalha 600x100 para 500x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1270
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 200x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1271
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 300x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1272
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 300x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1273
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 400x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1274
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 400x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1275
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 400x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1276
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 500x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1277
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 500x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1278
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 500x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1279
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 500x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1280
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 600x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1281
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 600x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1282
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 600x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1283
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 600x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1284
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à direita tipo \"U\" de eletrocalha 600x100 para 500x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1285
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 200x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1286
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 300x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1287
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 300x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1288
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 400x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1289
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 400x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1290
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 400x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1291
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 500x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1292
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 500x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1293
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 500x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1294
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 500x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1295
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 600x100 para 100x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1296
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 600x100 para 200x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1297
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 600x100 para 300x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1298
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 600x100 para 400x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1299
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa lisa de encaixe para redução à esquerda tipo \"U\" de eletrocalha 600x100 para 500x100",
    "defaultUnit": "un",
    "active": true,
    "id": 1300
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa para caixa de passagem 2x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1301
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa para caixa de passagem 3x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1302
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa para caixa de passagem 4x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1303
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa para caixa de passagem 6x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1304
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa para caixa de tomadas 2x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1305
  },
  {
    "category": "Infraestrutura",
    "name": "Tampa para caixa de tomadas 3x70mm, h=76mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1306
  },
  {
    "category": "Infraestrutura",
    "name": "Vergalhão rosca total Ø 1/4\" x 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 1307
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 2x70mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1308
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 3x70mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1309
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 4x70mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1310
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de passagem 6x70mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1311
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 2x70mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1312
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas 3x70mm para canaleta de piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1313
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de tomadas conforme detalhe em projeto",
    "defaultUnit": "un",
    "active": true,
    "id": 1314
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa metálica de 1000 x 750 x 300 mm em chapa de aço 14 MSG (1,98mm espessura), laminada a frio para proteção dos TC's",
    "defaultUnit": "un",
    "active": true,
    "id": 1315
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa metálica de 1800 x 1500 x 380 mm em chapa de ferro 18 para medição",
    "defaultUnit": "un",
    "active": true,
    "id": 1316
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa metálica de 300 x 250 x 90 mm em chapa de aço 18 MSG (1,27mm espessura), laminada a frio para proteção dos bornes",
    "defaultUnit": "un",
    "active": true,
    "id": 1317
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa para acomodar as luvas",
    "defaultUnit": "un",
    "active": true,
    "id": 1318
  },
  {
    "category": "Infraestrutura",
    "name": "Entrada de energia coletiva conforme projeto (quadros de medidores da entrada coletiva, BEP, DPS, aterramento, etc.)",
    "defaultUnit": "un",
    "active": true,
    "id": 1319
  },
  {
    "category": "Infraestrutura",
    "name": "Entrada de energia conforme o projeto",
    "defaultUnit": "un",
    "active": true,
    "id": 1320
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 1321
  },
  {
    "category": "Infraestrutura",
    "name": "QDEE",
    "defaultUnit": "un",
    "active": true,
    "id": 1322
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-AR",
    "defaultUnit": "un",
    "active": true,
    "id": 1323
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-AR-AUDITÓRIO",
    "defaultUnit": "un",
    "active": true,
    "id": 1324
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC.",
    "defaultUnit": "un",
    "active": true,
    "id": 1325
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC. A",
    "defaultUnit": "un",
    "active": true,
    "id": 1326
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC. B",
    "defaultUnit": "un",
    "active": true,
    "id": 1327
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC. C",
    "defaultUnit": "un",
    "active": true,
    "id": 1328
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC. D",
    "defaultUnit": "un",
    "active": true,
    "id": 1329
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC. E",
    "defaultUnit": "un",
    "active": true,
    "id": 1330
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. INC. F",
    "defaultUnit": "un",
    "active": true,
    "id": 1331
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC.",
    "defaultUnit": "un",
    "active": true,
    "id": 1332
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC. A",
    "defaultUnit": "un",
    "active": true,
    "id": 1333
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC. B",
    "defaultUnit": "un",
    "active": true,
    "id": 1334
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC. C",
    "defaultUnit": "un",
    "active": true,
    "id": 1335
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC. D",
    "defaultUnit": "un",
    "active": true,
    "id": 1336
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC. E",
    "defaultUnit": "un",
    "active": true,
    "id": 1337
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-B. REC. F",
    "defaultUnit": "un",
    "active": true,
    "id": 1338
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-ESPELHO D'ÁGUA",
    "defaultUnit": "un",
    "active": true,
    "id": 1339
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PISCINA",
    "defaultUnit": "un",
    "active": true,
    "id": 1340
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PISCINA ADULTO",
    "defaultUnit": "un",
    "active": true,
    "id": 1341
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PISCINA INFANTIL",
    "defaultUnit": "un",
    "active": true,
    "id": 1342
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS.",
    "defaultUnit": "un",
    "active": true,
    "id": 1343
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS. A",
    "defaultUnit": "un",
    "active": true,
    "id": 1344
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS. B",
    "defaultUnit": "un",
    "active": true,
    "id": 1345
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS. C",
    "defaultUnit": "un",
    "active": true,
    "id": 1346
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS. D",
    "defaultUnit": "un",
    "active": true,
    "id": 1347
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS. E",
    "defaultUnit": "un",
    "active": true,
    "id": 1348
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-PRESS. F",
    "defaultUnit": "un",
    "active": true,
    "id": 1349
  },
  {
    "category": "Infraestrutura",
    "name": "QDF-SPRINKLER",
    "defaultUnit": "un",
    "active": true,
    "id": 1350
  },
  {
    "category": "Infraestrutura",
    "name": "QDG",
    "defaultUnit": "un",
    "active": true,
    "id": 1351
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM",
    "defaultUnit": "un",
    "active": true,
    "id": 1352
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM A",
    "defaultUnit": "un",
    "active": true,
    "id": 1353
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM B",
    "defaultUnit": "un",
    "active": true,
    "id": 1354
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM C",
    "defaultUnit": "un",
    "active": true,
    "id": 1355
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM D",
    "defaultUnit": "un",
    "active": true,
    "id": 1356
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM E",
    "defaultUnit": "un",
    "active": true,
    "id": 1357
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-ADM F",
    "defaultUnit": "un",
    "active": true,
    "id": 1358
  },
  {
    "category": "Infraestrutura",
    "name": "QDG-GER",
    "defaultUnit": "un",
    "active": true,
    "id": 1359
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-01",
    "defaultUnit": "un",
    "active": true,
    "id": 1360
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-02",
    "defaultUnit": "un",
    "active": true,
    "id": 1361
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-03",
    "defaultUnit": "un",
    "active": true,
    "id": 1362
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-04",
    "defaultUnit": "un",
    "active": true,
    "id": 1363
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-05",
    "defaultUnit": "un",
    "active": true,
    "id": 1364
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-06",
    "defaultUnit": "un",
    "active": true,
    "id": 1365
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM",
    "defaultUnit": "un",
    "active": true,
    "id": 1366
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM A",
    "defaultUnit": "un",
    "active": true,
    "id": 1367
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM B",
    "defaultUnit": "un",
    "active": true,
    "id": 1368
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM C",
    "defaultUnit": "un",
    "active": true,
    "id": 1369
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM D",
    "defaultUnit": "un",
    "active": true,
    "id": 1370
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM E",
    "defaultUnit": "un",
    "active": true,
    "id": 1371
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-ADM F",
    "defaultUnit": "un",
    "active": true,
    "id": 1372
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-AUDITÓRIO",
    "defaultUnit": "un",
    "active": true,
    "id": 1373
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-FESTAS",
    "defaultUnit": "un",
    "active": true,
    "id": 1374
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-INFERIOR",
    "defaultUnit": "un",
    "active": true,
    "id": 1375
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-JOGOS",
    "defaultUnit": "un",
    "active": true,
    "id": 1376
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-KIDS",
    "defaultUnit": "un",
    "active": true,
    "id": 1377
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-LAZER",
    "defaultUnit": "un",
    "active": true,
    "id": 1378
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-MULHER",
    "defaultUnit": "un",
    "active": true,
    "id": 1379
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-PORTARIA",
    "defaultUnit": "un",
    "active": true,
    "id": 1380
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-QUADRA",
    "defaultUnit": "un",
    "active": true,
    "id": 1381
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SOBRESSOLO",
    "defaultUnit": "un",
    "active": true,
    "id": 1382
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SOBRESSOLO 1",
    "defaultUnit": "un",
    "active": true,
    "id": 1383
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SOBRESSOLO 2",
    "defaultUnit": "un",
    "active": true,
    "id": 1384
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SOBRESSOLO 3",
    "defaultUnit": "un",
    "active": true,
    "id": 1385
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SOBRESSOLO 4",
    "defaultUnit": "un",
    "active": true,
    "id": 1386
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SUBSOLO",
    "defaultUnit": "un",
    "active": true,
    "id": 1387
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SUBSOLO 1",
    "defaultUnit": "un",
    "active": true,
    "id": 1388
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SUBSOLO 2",
    "defaultUnit": "un",
    "active": true,
    "id": 1389
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SUBSOLO 3",
    "defaultUnit": "un",
    "active": true,
    "id": 1390
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SUBSOLO 4",
    "defaultUnit": "un",
    "active": true,
    "id": 1391
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-SUPERIOR",
    "defaultUnit": "un",
    "active": true,
    "id": 1392
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TEEN",
    "defaultUnit": "un",
    "active": true,
    "id": 1393
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TIPO",
    "defaultUnit": "un",
    "active": true,
    "id": 1394
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TIPO 1",
    "defaultUnit": "un",
    "active": true,
    "id": 1395
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TIPO 2",
    "defaultUnit": "un",
    "active": true,
    "id": 1396
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TIPO 3",
    "defaultUnit": "un",
    "active": true,
    "id": 1397
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TIPO 4",
    "defaultUnit": "un",
    "active": true,
    "id": 1398
  },
  {
    "category": "Infraestrutura",
    "name": "QDLF-TÉRREO",
    "defaultUnit": "un",
    "active": true,
    "id": 1399
  },
  {
    "category": "Infraestrutura",
    "name": "QGBT",
    "defaultUnit": "un",
    "active": true,
    "id": 1400
  },
  {
    "category": "Acabamentos",
    "name": "Bomba para pressurização de 3/4 CV - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 1401
  },
  {
    "category": "Acabamentos",
    "name": "Botão de comando para áudio",
    "defaultUnit": "un",
    "active": true,
    "id": 1402
  },
  {
    "category": "Acabamentos",
    "name": "Campainha de embutir bivolt tipo cigarra",
    "defaultUnit": "un",
    "active": true,
    "id": 1403
  },
  {
    "category": "Acabamentos",
    "name": "Canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 1404
  },
  {
    "category": "Acabamentos",
    "name": "Canaleta de piso 25x140mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1405
  },
  {
    "category": "Acabamentos",
    "name": "Canaleta de piso 25x70mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1406
  },
  {
    "category": "Acabamentos",
    "name": "Canaleta de piso 2x25x140mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1407
  },
  {
    "category": "Acabamentos",
    "name": "Canaleta de piso 2x25x70mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1408
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 1 interruptor de simples e 1 tomada monofásica",
    "defaultUnit": "un",
    "active": true,
    "id": 1409
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 1 tomada de telefone 1 tomada de interfone",
    "defaultUnit": "un",
    "active": true,
    "id": 1410
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 1 tomada de telefone e 1 ponto de TV",
    "defaultUnit": "un",
    "active": true,
    "id": 1411
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 1 tomada monofásica e 1 tomada bifásica",
    "defaultUnit": "un",
    "active": true,
    "id": 1412
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 1 tomada monofásica e 1 tomada bifásica em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1413
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 interruptores simples e 1 tomada monofásica",
    "defaultUnit": "un",
    "active": true,
    "id": 1414
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 pontos de TV",
    "defaultUnit": "un",
    "active": true,
    "id": 1415
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 1416
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas de rede em canaleta DLP",
    "defaultUnit": "un",
    "active": true,
    "id": 1417
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas de telefone",
    "defaultUnit": "un",
    "active": true,
    "id": 1418
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas monofásicas",
    "defaultUnit": "un",
    "active": true,
    "id": 1419
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas monofásicas em canaleta DLP",
    "defaultUnit": "un",
    "active": true,
    "id": 1420
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas monofásicas em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1421
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de 2 tomadas monofásicas no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1422
  },
  {
    "category": "Acabamentos",
    "name": "Conjunto de botão de comando de áudio tipo dimmer, incluindo suporte e Espelho de interruptor 4x2\"",
    "defaultUnit": "un",
    "active": true,
    "id": 1423
  },
  {
    "category": "Acabamentos",
    "name": "Controle de parede para 1 ventilador",
    "defaultUnit": "un",
    "active": true,
    "id": 1424
  },
  {
    "category": "Acabamentos",
    "name": "Controle de parede para 2 ventiladores",
    "defaultUnit": "un",
    "active": true,
    "id": 1425
  },
  {
    "category": "Acabamentos",
    "name": "Controle de parede para 3 ventiladores",
    "defaultUnit": "un",
    "active": true,
    "id": 1426
  },
  {
    "category": "Acabamentos",
    "name": "Controle de parede para 4 ventiladores",
    "defaultUnit": "un",
    "active": true,
    "id": 1427
  },
  {
    "category": "Acabamentos",
    "name": "Controle de parede para 5 ventiladores",
    "defaultUnit": "un",
    "active": true,
    "id": 1428
  },
  {
    "category": "Acabamentos",
    "name": "Cotovelo 90° para canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 1429
  },
  {
    "category": "Acabamentos",
    "name": "Cotovelo externo 90° para canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 1430
  },
  {
    "category": "Acabamentos",
    "name": "Cotovelo interno 90° para canaleta DLP evolutiva 150x50",
    "defaultUnit": "m",
    "active": true,
    "id": 1431
  },
  {
    "category": "Acabamentos",
    "name": "Fechadura elétrica de portão",
    "defaultUnit": "un",
    "active": true,
    "id": 1432
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor bipolar de 1 tecla simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1433
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor bipolar de 2 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1434
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor bipolar de 5 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1435
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1436
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples e 1 tecla intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1437
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples e 1 tecla paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1438
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples e 2 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1439
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples e 3 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1440
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples e 4 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1441
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples e 5 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1442
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1443
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 1 tecla simples à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 1444
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1445
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1446
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas simples e 1 tecla intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1447
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas simples e 1 tecla paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1448
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas simples e 2 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1449
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas simples e 3 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1450
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 2 teclas simples e 4 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1451
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 3 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1452
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 3 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1453
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 3 teclas simples e 1 tecla intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1454
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 3 teclas simples e 1 tecla paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1455
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 3 teclas simples e 2 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1456
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 3 teclas simples e 3 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1457
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 4 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1458
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 4 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1459
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 4 teclas simples e 1 tecla intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1460
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 4 teclas simples e 1 tecla paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1461
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 4 teclas simples e 2 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1462
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 5 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1463
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 5 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1464
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 5 teclas simples e 1 tecla intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1465
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 5 teclas simples e 1 tecla paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1466
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 6 teclas paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1467
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor de 6 teclas simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1468
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1469
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1470
  },
  {
    "category": "Acabamentos",
    "name": "Interruptor paralelo em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1471
  },
  {
    "category": "Acabamentos",
    "name": "Motor elétrico monofásico para portão de 3/4 CV - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 1472
  },
  {
    "category": "Acabamentos",
    "name": "Motor para hidromassagem bifásico 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 1473
  },
  {
    "category": "Acabamentos",
    "name": "Máquina de sauna seca bifásica 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 1474
  },
  {
    "category": "Acabamentos",
    "name": "Máquina de sauna úmida bifásica 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 1475
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor bipolar simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1476
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor intermediário",
    "defaultUnit": "un",
    "active": true,
    "id": 1477
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor paralelo",
    "defaultUnit": "un",
    "active": true,
    "id": 1478
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor paralelo para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1479
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor simples",
    "defaultUnit": "un",
    "active": true,
    "id": 1480
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor simples para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1481
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de interruptor simples à prova de calor e umidade",
    "defaultUnit": "un",
    "active": true,
    "id": 1482
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de ponto de TV",
    "defaultUnit": "un",
    "active": true,
    "id": 1483
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tampa cega",
    "defaultUnit": "un",
    "active": true,
    "id": 1484
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada de rede RJ45",
    "defaultUnit": "un",
    "active": true,
    "id": 1485
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada de telefone RJ11",
    "defaultUnit": "un",
    "active": true,
    "id": 1486
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada para interfone",
    "defaultUnit": "un",
    "active": true,
    "id": 1487
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada para rede RJ45",
    "defaultUnit": "un",
    "active": true,
    "id": 1488
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada para telefone RJ11",
    "defaultUnit": "un",
    "active": true,
    "id": 1489
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada tomada para interfone",
    "defaultUnit": "un",
    "active": true,
    "id": 1490
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada universal branca de 3 pinos 2P+T, 16A, 250V",
    "defaultUnit": "un",
    "active": true,
    "id": 1491
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada universal branca de 3 pinos 2P+T, 16A, 250V para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1492
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada universal branca de 3 pinos 3P+T, 16A, 250V",
    "defaultUnit": "un",
    "active": true,
    "id": 1493
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada universal branca de 3 pinos 3P+T, 16A, 250V para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1494
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada universal vermelha de 3 pinos 2P+T, 20A, 250V",
    "defaultUnit": "un",
    "active": true,
    "id": 1495
  },
  {
    "category": "Acabamentos",
    "name": "Módulo de tomada universal vermelha de 3 pinos 2P+T, 20A, 250V para condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1496
  },
  {
    "category": "Acabamentos",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 1497
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força",
    "defaultUnit": "un",
    "active": true,
    "id": 1498
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para ar condicionado tipo casset no teto",
    "defaultUnit": "un",
    "active": true,
    "id": 1499
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para ar condicionado tipo split em parede - 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 1500
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para ar condicionado tipo split em parede - 220V",
    "defaultUnit": "un",
    "active": true,
    "id": 1501
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para chuveiro",
    "defaultUnit": "un",
    "active": true,
    "id": 1502
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para exaustor/coifa",
    "defaultUnit": "un",
    "active": true,
    "id": 1503
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para fibra óptica",
    "defaultUnit": "un",
    "active": true,
    "id": 1504
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para fotocélula",
    "defaultUnit": "un",
    "active": true,
    "id": 1505
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para hidromassagem",
    "defaultUnit": "un",
    "active": true,
    "id": 1506
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para luminoso",
    "defaultUnit": "un",
    "active": true,
    "id": 1507
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para motor de portão",
    "defaultUnit": "un",
    "active": true,
    "id": 1508
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para pressurizador",
    "defaultUnit": "un",
    "active": true,
    "id": 1509
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para projetor multimídia no teto",
    "defaultUnit": "un",
    "active": true,
    "id": 1510
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para sauna seca",
    "defaultUnit": "un",
    "active": true,
    "id": 1511
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para sauna úmida",
    "defaultUnit": "un",
    "active": true,
    "id": 1512
  },
  {
    "category": "Acabamentos",
    "name": "Ponto de força para torneira elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 1513
  },
  {
    "category": "Acabamentos",
    "name": "Ponto para caixa de som na parede",
    "defaultUnit": "un",
    "active": true,
    "id": 1514
  },
  {
    "category": "Acabamentos",
    "name": "Ponto para central de interfone na parede",
    "defaultUnit": "un",
    "active": true,
    "id": 1515
  },
  {
    "category": "Acabamentos",
    "name": "Ponto para central de som na parede",
    "defaultUnit": "un",
    "active": true,
    "id": 1516
  },
  {
    "category": "Acabamentos",
    "name": "Ponto para câmera de filmagem de segurança",
    "defaultUnit": "un",
    "active": true,
    "id": 1517
  },
  {
    "category": "Acabamentos",
    "name": "Ponto para fechadura elétrica",
    "defaultUnit": "un",
    "active": true,
    "id": 1518
  },
  {
    "category": "Acabamentos",
    "name": "Pulsador para campainha cigarra",
    "defaultUnit": "un",
    "active": true,
    "id": 1519
  },
  {
    "category": "Acabamentos",
    "name": "Pulsador para campainha cigarra 127V",
    "defaultUnit": "un",
    "active": true,
    "id": 1520
  },
  {
    "category": "Acabamentos",
    "name": "Relé fotocélula externo bivolt",
    "defaultUnit": "un",
    "active": true,
    "id": 1521
  },
  {
    "category": "Acabamentos",
    "name": "Sirene do sistema de detecção e alarme de incêndio",
    "defaultUnit": "un",
    "active": true,
    "id": 1522
  },
  {
    "category": "Acabamentos",
    "name": "Terminal aéreo de inserção em aço galvanizado - fixação horizontal",
    "defaultUnit": "un",
    "active": true,
    "id": 1523
  },
  {
    "category": "Acabamentos",
    "name": "Terminal aéreo de inserção em aço galvanizado - fixação horizontal em base",
    "defaultUnit": "un",
    "active": true,
    "id": 1524
  },
  {
    "category": "Acabamentos",
    "name": "Terminal aéreo de inserção em aço galvanizado - fixação vertical",
    "defaultUnit": "un",
    "active": true,
    "id": 1525
  },
  {
    "category": "Acabamentos",
    "name": "Terminal estanhado de 1 furo e 1 compressão - 35mm²",
    "defaultUnit": "un",
    "active": true,
    "id": 1526
  },
  {
    "category": "Acabamentos",
    "name": "Terminal estanhado de 1 furo e 1 compressão - 50mm²",
    "defaultUnit": "un",
    "active": true,
    "id": 1527
  },
  {
    "category": "Acabamentos",
    "name": "Tomada 2P+T, 16A, 250V em base/suporte para perfilado/eletrocalha",
    "defaultUnit": "un",
    "active": true,
    "id": 1528
  },
  {
    "category": "Acabamentos",
    "name": "Tomada bifásica",
    "defaultUnit": "un",
    "active": true,
    "id": 1529
  },
  {
    "category": "Acabamentos",
    "name": "Tomada bifásica em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1530
  },
  {
    "category": "Acabamentos",
    "name": "Tomada bifásica no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1531
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de TV",
    "defaultUnit": "un",
    "active": true,
    "id": 1532
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de TV no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1533
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de interfone",
    "defaultUnit": "un",
    "active": true,
    "id": 1534
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de interfone no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1535
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de rede",
    "defaultUnit": "un",
    "active": true,
    "id": 1536
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de rede em canaleta DLP",
    "defaultUnit": "un",
    "active": true,
    "id": 1537
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de rede no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1538
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de telefone",
    "defaultUnit": "un",
    "active": true,
    "id": 1539
  },
  {
    "category": "Acabamentos",
    "name": "Tomada de telefone no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1540
  },
  {
    "category": "Acabamentos",
    "name": "Tomada monofásica",
    "defaultUnit": "un",
    "active": true,
    "id": 1541
  },
  {
    "category": "Acabamentos",
    "name": "Tomada monofásica em canaleta DLP",
    "defaultUnit": "un",
    "active": true,
    "id": 1542
  },
  {
    "category": "Acabamentos",
    "name": "Tomada monofásica em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1543
  },
  {
    "category": "Acabamentos",
    "name": "Tomada monofásica no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1544
  },
  {
    "category": "Acabamentos",
    "name": "Tomada monofásica para iluminação de emergência",
    "defaultUnit": "un",
    "active": true,
    "id": 1545
  },
  {
    "category": "Acabamentos",
    "name": "Tomada monofásica para iluminação de emergência em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1546
  },
  {
    "category": "Acabamentos",
    "name": "Tomada trifásica",
    "defaultUnit": "un",
    "active": true,
    "id": 1547
  },
  {
    "category": "Acabamentos",
    "name": "Tomada trifásica em condulete",
    "defaultUnit": "un",
    "active": true,
    "id": 1548
  },
  {
    "category": "SPDA",
    "name": "Abraçadeira para aterramento de mastro para duas descidas e mastro de Ø 2\" - para cabos de 35-70mm² - TEL 806",
    "defaultUnit": "un",
    "active": true,
    "id": 1549
  },
  {
    "category": "SPDA",
    "name": "Abraçadeira tipo porta-bandeira reforçada Ø 2\" - TEL 090",
    "defaultUnit": "un",
    "active": true,
    "id": 1550
  },
  {
    "category": "SPDA",
    "name": "Apoio inferior com fixação lateral para abraçadeira tipo porta-bandeira Ø 2\" - TEL 091",
    "defaultUnit": "un",
    "active": true,
    "id": 1551
  },
  {
    "category": "SPDA",
    "name": "Aterrinsert",
    "defaultUnit": "un",
    "active": true,
    "id": 1552
  },
  {
    "category": "SPDA",
    "name": "BARRA CHATA DE ALUMÍNIO 7/8\" x 1/8\" x 3m",
    "defaultUnit": "un",
    "active": true,
    "id": 1553
  },
  {
    "category": "SPDA",
    "name": "Barra chata de alumínio - fixação Adericone",
    "defaultUnit": "m",
    "active": true,
    "id": 1554
  },
  {
    "category": "SPDA",
    "name": "Barra chata de alumínio - fixação direta",
    "defaultUnit": "m",
    "active": true,
    "id": 1555
  },
  {
    "category": "SPDA",
    "name": "Barra redonda de aço galvanizado - Re-bar",
    "defaultUnit": "m",
    "active": true,
    "id": 1556
  },
  {
    "category": "SPDA",
    "name": "Barra redonda de aço galvanizado - Re-bar - Ø 3/8\" x 3,4m (70mm²) - TEL-760",
    "defaultUnit": "un",
    "active": true,
    "id": 1557
  },
  {
    "category": "SPDA",
    "name": "Base para mastro de Ø 2\" em alumínio fundido - TEL 075",
    "defaultUnit": "un",
    "active": true,
    "id": 1558
  },
  {
    "category": "SPDA",
    "name": "Cabo de cobre nu 25mm² - 7 fios x Ø 2,06mm (NBR 6524)",
    "defaultUnit": "m",
    "active": true,
    "id": 1559
  },
  {
    "category": "SPDA",
    "name": "Cabo de cobre nu 35mm² - 7 fios x Ø 2,50mm (NBR 6524)",
    "defaultUnit": "m",
    "active": true,
    "id": 1560
  },
  {
    "category": "SPDA",
    "name": "Cabo de cobre nu 50mm² - 7 fios x Ø 3,00mm (NBR 6524)",
    "defaultUnit": "m",
    "active": true,
    "id": 1561
  },
  {
    "category": "SPDA",
    "name": "Cabo de cobre nu 95mm² - 7 fios x Ø 4,12mm (NBR 6524)",
    "defaultUnit": "m",
    "active": true,
    "id": 1562
  },
  {
    "category": "SPDA",
    "name": "Caixa de inspeção para aterramento em PVC",
    "defaultUnit": "un",
    "active": true,
    "id": 1563
  },
  {
    "category": "SPDA",
    "name": "Caixa de inspeção para aterramento em PVC com haste de aterramento",
    "defaultUnit": "un",
    "active": true,
    "id": 1564
  },
  {
    "category": "SPDA",
    "name": "Caixa de inspeção para aterramento em PVC Ø 30x30cm - TEL 552",
    "defaultUnit": "un",
    "active": true,
    "id": 1565
  },
  {
    "category": "SPDA",
    "name": "Captor Franklin - fixação lateral",
    "defaultUnit": "un",
    "active": true,
    "id": 1566
  },
  {
    "category": "SPDA",
    "name": "Captor Franklin - fixação sobre base",
    "defaultUnit": "un",
    "active": true,
    "id": 1567
  },
  {
    "category": "SPDA",
    "name": "Captor tipo Franklin de uma descida em latão cromado, rosca 3/4\" x 250mm - TEL 010",
    "defaultUnit": "un",
    "active": true,
    "id": 1568
  },
  {
    "category": "SPDA",
    "name": "Clips para emenda de Re-bar  Ø 8 - 10mm - TEL 5238",
    "defaultUnit": "un",
    "active": true,
    "id": 1569
  },
  {
    "category": "SPDA",
    "name": "Conector Aterrinsert com disco de latão, rosca fêmea M12 e distância do condutor regulável de 25mm a 40mm - TEL 656",
    "defaultUnit": "un",
    "active": true,
    "id": 1570
  },
  {
    "category": "SPDA",
    "name": "Conector de medição em latão com 4 parafusos - para cabos de cobre 16-50mm² - TEL 562",
    "defaultUnit": "un",
    "active": true,
    "id": 1571
  },
  {
    "category": "SPDA",
    "name": "Conector estanhado para Aterrinsert com pino M12 para cabos de 16 a 70mm² - TEL 630",
    "defaultUnit": "un",
    "active": true,
    "id": 1572
  },
  {
    "category": "SPDA",
    "name": "Conector minigar em latão estanhado para vergalhão de até Ø 10mm e cabos de até 50mm² - TEL 583",
    "defaultUnit": "un",
    "active": true,
    "id": 1573
  },
  {
    "category": "SPDA",
    "name": "Conector tipo \"U\" de latão estanhado - TEL 581",
    "defaultUnit": "un",
    "active": true,
    "id": 1574
  },
  {
    "category": "SPDA",
    "name": "Conjunto de estais com cordoalhas e esticadores, 2 metros cada estais x Ø 2\" - TEL 410",
    "defaultUnit": "un",
    "active": true,
    "id": 1575
  },
  {
    "category": "SPDA",
    "name": "Fita subterrânea para de sinalização de rede elétrica",
    "defaultUnit": "m",
    "active": true,
    "id": 1576
  },
  {
    "category": "SPDA",
    "name": "Fixador Adericone de 45mm de diâmero, com parafuso de inox 1/4\" e porca - TEL 755",
    "defaultUnit": "un",
    "active": true,
    "id": 1577
  },
  {
    "category": "SPDA",
    "name": "Fixador universal estanhado para cabos de até 70mm² - TEL 5024",
    "defaultUnit": "un",
    "active": true,
    "id": 1578
  },
  {
    "category": "SPDA",
    "name": "Haste de aterramento cobreada, alta camada, Ø 5/8\" x 2,40m - TEL 5814",
    "defaultUnit": "un",
    "active": true,
    "id": 1579
  },
  {
    "category": "SPDA",
    "name": "Mastro telescópico com redução para 3/4\", Ø 2\" x 4m - TEL 472",
    "defaultUnit": "un",
    "active": true,
    "id": 1580
  },
  {
    "category": "SPDA",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 1581
  },
  {
    "category": "SPDA",
    "name": "Presilha tipo \"C\" em latão",
    "defaultUnit": "un",
    "active": true,
    "id": 1582
  },
  {
    "category": "SPDA",
    "name": "Presilha tipo \"C\" em latão estanhado, furo Ø 5mm para cabos de até 70mm² - TEL 746",
    "defaultUnit": "un",
    "active": true,
    "id": 1583
  },
  {
    "category": "SPDA",
    "name": "Sinalizador noturno duplo para duas lâmpadas de 60W com relé fotoelétrico 127V - TEL 600",
    "defaultUnit": "un",
    "active": true,
    "id": 1584
  },
  {
    "category": "SPDA",
    "name": "Solda exotérmica",
    "defaultUnit": "un",
    "active": true,
    "id": 1585
  },
  {
    "category": "SPDA",
    "name": "Split-bolt em latão estanhado com furo vertical Ø 10mm para cabos de até 70mm² - TEL 5021",
    "defaultUnit": "un",
    "active": true,
    "id": 1586
  },
  {
    "category": "SPDA",
    "name": "Split-bolt em latão estanhado com furo vertical Ø 10mm para dabo de até 70mm² - TEL 5021",
    "defaultUnit": "un",
    "active": true,
    "id": 1587
  },
  {
    "category": "SPDA",
    "name": "Suporte para sinalizador em mastro de Ø 2\" - TEL 611",
    "defaultUnit": "un",
    "active": true,
    "id": 1588
  },
  {
    "category": "SPDA",
    "name": "Tampa reforçada em ferro fundido com escotilha Ø 30cm - TEL 536",
    "defaultUnit": "un",
    "active": true,
    "id": 1589
  },
  {
    "category": "SPDA",
    "name": "Tela em inox para equipotencialização - largura 242mm, espessura 1,5mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1590
  },
  {
    "category": "SPDA",
    "name": "Terminal aéreo de inserção em aço galvanizado de Ø 3/8\" x 600mm - TEL 5126",
    "defaultUnit": "un",
    "active": true,
    "id": 1591
  },
  {
    "category": "SPDA",
    "name": "Terminal aéreo de inserção em aço galvanizado de Ø 5/16\" x 600mm - TEL 056",
    "defaultUnit": "un",
    "active": true,
    "id": 1592
  },
  {
    "category": "SPDA",
    "name": "Terminal aéreo de inserção em aço galvanizado de Ø 5/16\" x 600mm - TEL 057",
    "defaultUnit": "un",
    "active": true,
    "id": 1593
  },
  {
    "category": "SPDA",
    "name": "Terminal estanhado de 1 furo e 1 compressão - 35mm² - TEL 5135",
    "defaultUnit": "un",
    "active": true,
    "id": 1594
  },
  {
    "category": "SPDA",
    "name": "Terminal estanhado de 1 furo e 1 compressão - 50mm² - TEL 5150",
    "defaultUnit": "un",
    "active": true,
    "id": 1595
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 100 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1596
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 120 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1597
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 128 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1598
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 160 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1599
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 180 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1600
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 192 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1601
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 200 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1602
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 240 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1603
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 300 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1604
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 32 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1605
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 360 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1606
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 400 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1607
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 60 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1608
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 64 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1609
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações externas CTP APL G até 400 pares - 96 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1610
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações internas CCI de até 6 pares - 1 par",
    "defaultUnit": "un",
    "active": true,
    "id": 1611
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações internas CCI de até 6 pares - 2 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1612
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações internas CCI de até 6 pares - 3 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1613
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações internas CCI de até 6 pares - 4 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1614
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações internas CCI de até 6 pares - 5 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1615
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo telefônico para instalações internas CCI de até 6 pares - 6 pares",
    "defaultUnit": "un",
    "active": true,
    "id": 1616
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para interfone/TV de embutir, padrão telefônica - 60x60x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 1617
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para interfone/TV de embutir, padrão telefônica - 80x80x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 1618
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para interfone/TV de sobrepor, padrão telefônica - 60x60x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 1619
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para interfone/TV de sobrepor, padrão telefônica - 80x80x12cm",
    "defaultUnit": "un",
    "active": true,
    "id": 1620
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de embutir, padrão telefônica - 120x120x12cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1621
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de embutir, padrão telefônica - 150x150x15cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1622
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de embutir, padrão telefônica - 200x200x20cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1623
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de embutir, padrão telefônica - 80x80x12cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1624
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de sobrepor, padrão telefônica - 120x120x12cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1625
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de sobrepor, padrão telefônica - 150x150x15cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1626
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de sobrepor, padrão telefônica - 200x200x20cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1627
  },
  {
    "category": "Infraestrutura",
    "name": "Caixa de distribuição geral metálica para telefone de sobrepor, padrão telefônica - 80x80x12cm - DG-TEL",
    "defaultUnit": "un",
    "active": true,
    "id": 1628
  },
  {
    "category": "Infraestrutura",
    "name": "Central de interfone",
    "defaultUnit": "un",
    "active": true,
    "id": 1629
  },
  {
    "category": "Infraestrutura",
    "name": "Fio telefônico para instalações internas FI - 2 condutores",
    "defaultUnit": "un",
    "active": true,
    "id": 1630
  },
  {
    "category": "Infraestrutura",
    "name": "Módulo de microfone com suporte e espelho",
    "defaultUnit": "un",
    "active": true,
    "id": 1631
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 1632
  },
  {
    "category": "Infraestrutura",
    "name": "Ponto para microfone no piso",
    "defaultUnit": "un",
    "active": true,
    "id": 1633
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-AUDITÓRIO - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1634
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-INFERIOR - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1635
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-INFO - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1636
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-SUPERIOR - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1637
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-TIPO - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1638
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-TIPO 1 - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1639
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-TIPO 2 - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1640
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-TIPO 3 - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1641
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-TIPO 4 - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1642
  },
  {
    "category": "Infraestrutura",
    "name": "QDT-TÉRREO - Quadro de distribuição de telecomunicações tipo vdi",
    "defaultUnit": "un",
    "active": true,
    "id": 1643
  },
  {
    "category": "Infraestrutura",
    "name": "RACK para telecomunicações",
    "defaultUnit": "un",
    "active": true,
    "id": 1644
  },
  {
    "category": "Infraestrutura",
    "name": "Bloco autonômo para iluminação de emergência com 30 LEDs bivolt",
    "defaultUnit": "un",
    "active": true,
    "id": 1645
  },
  {
    "category": "Infraestrutura",
    "name": "Botoeira para acionamento manual do sistema de de detecção e alarme de incêndio",
    "defaultUnit": "un",
    "active": true,
    "id": 1646
  },
  {
    "category": "Infraestrutura",
    "name": "Botoeira para acionamento manual do sistema de detecção e alarme de incêndio",
    "defaultUnit": "un",
    "active": true,
    "id": 1647
  },
  {
    "category": "Infraestrutura",
    "name": "Botoeira para comando da bomba de incêndio",
    "defaultUnit": "un",
    "active": true,
    "id": 1648
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo multipolar flexível, blindagem tipo shield, isolação PVC 1kV, 2x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1649
  },
  {
    "category": "Infraestrutura",
    "name": "Cabo multipolar flexível, blindagem tipo shield, isolação PVC 1kV, 3x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1650
  },
  {
    "category": "Infraestrutura",
    "name": "Central do sistema de detecção e alarme de incêndio com bateria integrada",
    "defaultUnit": "un",
    "active": true,
    "id": 1651
  },
  {
    "category": "Infraestrutura",
    "name": "Condulete 4x2\" em aço galvanizado sem rosca Ø 1\" tipo \"X\" na cor vermelha para sistema de incêndio",
    "defaultUnit": "un",
    "active": true,
    "id": 1652
  },
  {
    "category": "Infraestrutura",
    "name": "Detector de fumaça",
    "defaultUnit": "un",
    "active": true,
    "id": 1653
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto galvanizado vermelho para sistema de incêndio de Ø 1\"",
    "defaultUnit": "m",
    "active": true,
    "id": 1654
  },
  {
    "category": "Infraestrutura",
    "name": "Eletroduto rígido em aço galvanizado tipo médio de Ø 1\" na cor vermelha",
    "defaultUnit": "un",
    "active": true,
    "id": 1655
  },
  {
    "category": "Infraestrutura",
    "name": "Luva média em aço galvanizado para eletroduto de Ø 1\" na cor vermelha",
    "defaultUnit": "un",
    "active": true,
    "id": 1656
  },
  {
    "category": "Infraestrutura",
    "name": "Outro",
    "defaultUnit": "un",
    "active": true,
    "id": 1657
  },
  {
    "category": "Infraestrutura",
    "name": "Sirene do sistema de detecção e alarme de incêndio",
    "defaultUnit": "un",
    "active": true,
    "id": 1658
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1659
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1660
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1661
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1662
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1663
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1664
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1665
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 1,5mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1666
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1667
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1668
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1669
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1670
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1671
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1672
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1673
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 2,5mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1674
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1675
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1676
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1677
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1678
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1679
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1680
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1681
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 4,0mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1682
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1683
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1684
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1685
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1686
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1687
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1688
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1689
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 6,0mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1690
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1691
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1692
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1693
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1694
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1695
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1696
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1697
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 10mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1698
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1699
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1700
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1701
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1702
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1703
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1704
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1705
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 16mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1706
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1707
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1708
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1709
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1710
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1711
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1712
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1713
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 25mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1714
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1715
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1716
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1717
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1718
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1719
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1720
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1721
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 35mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1722
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1723
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1724
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1725
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1726
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1727
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1728
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1729
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 50mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1730
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1731
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1732
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1733
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1734
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1735
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1736
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1737
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 70mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1738
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1739
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1740
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1741
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1742
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1743
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1744
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1745
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 95mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1746
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1747
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1748
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1749
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1750
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1751
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1752
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1753
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 120mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1754
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1755
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1756
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1757
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1758
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1759
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1760
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1761
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 150mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1762
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1763
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1764
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1765
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1766
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1767
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1768
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1769
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 185mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1770
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1771
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Amarelo/Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1772
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1773
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1774
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1775
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Cinza",
    "defaultUnit": "m",
    "active": true,
    "id": 1776
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Marrom",
    "defaultUnit": "m",
    "active": true,
    "id": 1777
  },
  {
    "category": "Cabeamento",
    "name": "Cabo THHN unipolar 240mm² — Laranja",
    "defaultUnit": "m",
    "active": true,
    "id": 1778
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 2x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1779
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 2x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1780
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 3x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1781
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 3x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1782
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 3x4,0mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1783
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 4x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1784
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 4x4,0mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1785
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 4x6,0mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1786
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 5x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1787
  },
  {
    "category": "Cabeamento",
    "name": "Cabo PP 5x4,0mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1788
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 4x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1789
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 7x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1790
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 10x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1791
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 12x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1792
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 14x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1793
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 19x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1794
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 24x1,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1795
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 4x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1796
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de controle 7x2,5mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1797
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 1,5mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1798
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 1,5mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1799
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 1,5mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1800
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 1,5mm² — Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1801
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 1,5mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1802
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 1,5mm² — Amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 1803
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 2,5mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1804
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 2,5mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1805
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 2,5mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1806
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 2,5mm² — Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1807
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 2,5mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1808
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 2,5mm² — Amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 1809
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 4,0mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1810
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 4,0mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1811
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 4,0mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1812
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 4,0mm² — Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1813
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 4,0mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1814
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 4,0mm² — Amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 1815
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 6,0mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1816
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 6,0mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1817
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 6,0mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1818
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 6,0mm² — Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1819
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 6,0mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1820
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 6,0mm² — Amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 1821
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 10mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1822
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 10mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1823
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 10mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1824
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 10mm² — Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1825
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 10mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1826
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 10mm² — Amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 1827
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 16mm² — Azul",
    "defaultUnit": "m",
    "active": true,
    "id": 1828
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 16mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1829
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 16mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1830
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 16mm² — Verde",
    "defaultUnit": "m",
    "active": true,
    "id": 1831
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 16mm² — Branco",
    "defaultUnit": "m",
    "active": true,
    "id": 1832
  },
  {
    "category": "Cabeamento",
    "name": "Fio rígido isolado 16mm² — Amarelo",
    "defaultUnit": "m",
    "active": true,
    "id": 1833
  },
  {
    "category": "Cabeamento",
    "name": "Cabo UTP Cat5e",
    "defaultUnit": "m",
    "active": true,
    "id": 1834
  },
  {
    "category": "Cabeamento",
    "name": "Cabo UTP Cat6",
    "defaultUnit": "m",
    "active": true,
    "id": 1835
  },
  {
    "category": "Cabeamento",
    "name": "Cabo UTP Cat6A",
    "defaultUnit": "m",
    "active": true,
    "id": 1836
  },
  {
    "category": "Cabeamento",
    "name": "Cabo FTP Cat6",
    "defaultUnit": "m",
    "active": true,
    "id": 1837
  },
  {
    "category": "Cabeamento",
    "name": "Cabo SFTP Cat7",
    "defaultUnit": "m",
    "active": true,
    "id": 1838
  },
  {
    "category": "Cabeamento",
    "name": "Cabo Coaxial RG58",
    "defaultUnit": "m",
    "active": true,
    "id": 1839
  },
  {
    "category": "Cabeamento",
    "name": "Cabo Coaxial RG6",
    "defaultUnit": "m",
    "active": true,
    "id": 1840
  },
  {
    "category": "Cabeamento",
    "name": "Cabo Fibra óptica monomodo 2FO",
    "defaultUnit": "m",
    "active": true,
    "id": 1841
  },
  {
    "category": "Cabeamento",
    "name": "Cabo Fibra óptica monomodo 4FO",
    "defaultUnit": "m",
    "active": true,
    "id": 1842
  },
  {
    "category": "Cabeamento",
    "name": "Cabo Fibra óptica monomodo 8FO",
    "defaultUnit": "m",
    "active": true,
    "id": 1843
  },
  {
    "category": "Cabeamento",
    "name": "Cabo Fibra óptica multimodo 4FO",
    "defaultUnit": "m",
    "active": true,
    "id": 1844
  },
  {
    "category": "Cabeamento",
    "name": "Cabo para CFTV coaxial + alimentação",
    "defaultUnit": "m",
    "active": true,
    "id": 1845
  },
  {
    "category": "Cabeamento",
    "name": "Cabo para sistema de alarme 4x0,50mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1846
  },
  {
    "category": "Cabeamento",
    "name": "Cabo para PABX/telefonia CCI 2 pares",
    "defaultUnit": "m",
    "active": true,
    "id": 1847
  },
  {
    "category": "Cabeamento",
    "name": "Cabo para PABX/telefonia CCI 4 pares",
    "defaultUnit": "m",
    "active": true,
    "id": 1848
  },
  {
    "category": "Cabeamento",
    "name": "Cabo solar fotovoltaico 6mm² — Vermelho",
    "defaultUnit": "m",
    "active": true,
    "id": 1849
  },
  {
    "category": "Cabeamento",
    "name": "Cabo solar fotovoltaico 6mm² — Preto",
    "defaultUnit": "m",
    "active": true,
    "id": 1850
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de aço galvanizado menságeiro 1/4\"",
    "defaultUnit": "m",
    "active": true,
    "id": 1851
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de aterramento nu 50mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1852
  },
  {
    "category": "Cabeamento",
    "name": "Cabo de aterramento nu 70mm²",
    "defaultUnit": "m",
    "active": true,
    "id": 1853
  },
  {
    "category": "Cabeamento",
    "name": "Fita de cobre nua 30x3mm",
    "defaultUnit": "m",
    "active": true,
    "id": 1854
  }
];

function generateSeed() {
  return [
    {
      id:'REQ-001', userId:1,
      clienteId:1, clienteName:'Energética Brasil S.A.',
      osId:1, osNumber:'2024-001', osDescription:'Subestação Norte — instalação painel secundário',
      status:'entregue', createdAt:daysAgo(12), necessity:'Instalação do painel secundário — urgente para não parar a obra.',
      deadline:daysAgo(8), approvedAt:daysAgo(11), rejectNote:null, quotedAt:daysAgo(10),
      orderedAt:daysAgo(9), deliveredAt:daysAgo(7), estimatedDelivery:daysAgo(8),
      supplier:'Elétrica Total Ltda',
      items:[
        {id:1,category:'Infraestrutura',name:'Caixa de passagem de PVC de embutir 4x2"',qty:20,unit:'un',obs:''},
        {id:2,category:'Iluminação',name:'Arandela de parede de sobrepor 127V',qty:10,unit:'un',obs:''},
      ],
      comments:[
        {id:1,userId:5,text:'Aprovado. Material essencial para o cronograma.',createdAt:daysAgo(11)},
        {id:2,userId:6,text:'Cotação fechada com Elétrica Total. Melhor preço.',createdAt:daysAgo(10)},
        {id:3,userId:1,text:'Material recebido em boas condições. Obrigado!',createdAt:daysAgo(7)},
      ],
    },
    {
      id:'REQ-002', userId:2,
      clienteId:2, clienteName:'Indústrias Metalmax',
      osId:3, osNumber:'2024-003', osDescription:'Planta Industrial Sul — infraestrutura elétrica',
      status:'pendente', createdAt:todayStr(), necessity:'Materiais para infraestrutura da ala nova.',
      deadline:daysFwd(5), approvedAt:null, rejectNote:null, quotedAt:null,
      orderedAt:null, deliveredAt:null, estimatedDelivery:null,
      supplier:'',
      items:[
        {id:1,category:'Infraestrutura',name:'Eletroduto rígido de Ø 1"',qty:50,unit:'m',obs:''},
        {id:2,category:'Infraestrutura',name:'Curva 90° para eletroduto de Ø 1"',qty:10,unit:'un',obs:''},
      ],
      comments:[],
    },
  ];
}

// ── USERS ────────────────────────────────────────────────────
function getUsers() {
  const stored = localStorage.getItem(KEYS.users);
  if (!stored) { localStorage.setItem(KEYS.users, JSON.stringify(DEFAULT_USERS)); return DEFAULT_USERS; }
  return JSON.parse(stored);
}
function saveUsers(u) { localStorage.setItem(KEYS.users, JSON.stringify(u)); }
function getUserById(id) { return getUsers().find(u => u.id === id) || { name: 'Desconhecido', avatar: '?', role: 'obra' }; }
function addUser(data) {
  const users = getUsers();
  const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const avatar = data.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase().substring(0,2);
  const newUser = { id, ...data, avatar };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}
function updateUser(id, patch) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx < 0) return null;
  if (patch.name && !patch.avatar) patch.avatar = patch.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase().substring(0,2);
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return users[idx];
}
function deleteUser(id) {
  saveUsers(getUsers().filter(u => u.id !== id));
}


// ── CLIENTES ─────────────────────────────────────────────────
function getClientes() {
  const c = localStorage.getItem(KEYS.clientes);
  if (!c) { localStorage.setItem(KEYS.clientes, JSON.stringify(DEFAULT_CLIENTES)); return DEFAULT_CLIENTES; }
  return JSON.parse(c);
}
function saveClientes(arr) { localStorage.setItem(KEYS.clientes, JSON.stringify(arr)); }
function addCliente(name) {
  if (!name) return null;
  const arr = getClientes();
  const existing = arr.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;
  const id = arr.length > 0 ? Math.max(...arr.map(c => c.id)) + 1 : 1;
  const novo = { id, name, active: true };
  arr.push(novo); saveClientes(arr); return novo;
}
function updateCliente(id, data) {
  const arr = getClientes();
  const i = arr.findIndex(c => c.id === id);
  if (i > -1) { arr[i] = { ...arr[i], ...data }; saveClientes(arr); }
}
function deleteCliente(id) {
  saveClientes(getClientes().filter(c => c.id !== id));
  saveOSes(getOSes().filter(o => o.clienteId !== id));
}

// ── ORDENS DE SERVIÇO (OS) ────────────────────────────────────
function getOSes() {
  const s = localStorage.getItem(KEYS.oses);
  if (!s) { localStorage.setItem(KEYS.oses, JSON.stringify(DEFAULT_OSES)); return DEFAULT_OSES; }
  return JSON.parse(s);
}
function saveOSes(arr) { localStorage.setItem(KEYS.oses, JSON.stringify(arr)); }
function getOSesForCliente(clienteId) { return getOSes().filter(o => o.clienteId === clienteId); }
function getOSById(id) { return getOSes().find(o => o.id === id) || null; }
function addOS(data) {
  // data: { clienteId, osNumber, description }
  if (!data.osNumber || !data.clienteId) return null;
  const arr = getOSes();
  const id = arr.length > 0 ? Math.max(...arr.map(o => o.id)) + 1 : 1;
  const nova = { id, ...data, active: true };
  arr.push(nova); saveOSes(arr); return nova;
}
function updateOS(id, data) {
  const arr = getOSes();
  const i = arr.findIndex(o => o.id === id);
  if (i > -1) { arr[i] = { ...arr[i], ...data }; saveOSes(arr); }
}
function deleteOS(id) { saveOSes(getOSes().filter(o => o.id !== id)); }

// Alias de compatibilidade (usado no addRequisition ao criar nova OS)
function addObra(name) { return addCliente(name); }
function getObras() { return getClientes(); }

// ── BUDGETS ──────────────────────────────────────────────────
function getBudgets() {
  const b = localStorage.getItem(KEYS.budgets);
  return b ? JSON.parse(b) : {};
}
function saveBudgets(data) { localStorage.setItem(KEYS.budgets, JSON.stringify(data)); }
function getBudgetForOS(osId) {
  return getBudgets()[String(osId)] || [];
}
function saveBudgetForOS(osId, items) {
  const all = getBudgets();
  all[String(osId)] = items;
  saveBudgets(all);
}
function getConsumedQty(osId, materialName) {
  const norm = s => s.toLowerCase().trim();
  const reqs = getRequisitions().filter(r =>
    r.osId === osId &&
    ['aprovado', 'cotacao', 'pedido', 'entregue'].includes(r.status)
  );
  let total = 0;
  reqs.forEach(r => {
    r.items.forEach(it => {
      if (norm(it.name || '') === norm(materialName) && it.approved !== false) {
        total += it.qty || 0;
      }
    });
  });
  return total;
}

// ── MATERIALS ────────────────────────────────────────────────
function getMaterials() {
  const stored = localStorage.getItem(KEYS.materials);
  if (!stored) { localStorage.setItem(KEYS.materials, JSON.stringify(DEFAULT_MATERIALS)); return DEFAULT_MATERIALS; }
  return JSON.parse(stored);
}
function saveMaterials(m) { localStorage.setItem(KEYS.materials, JSON.stringify(m)); }
function getActiveMaterials() { return getMaterials().filter(m => m.active); }
function getMaterialCategories() { return [...new Set(getActiveMaterials().map(m => m.category))].sort(); }
function addMaterial(data) {
  const mats = getMaterials();
  const mat = { ...data, id: Date.now(), active: true };
  mats.push(mat); saveMaterials(mats); return mat;
}
function updateMaterial(id, patch) {
  const mats = getMaterials();
  const idx = mats.findIndex(m => m.id === id);
  if (idx < 0) return null;
  mats[idx] = { ...mats[idx], ...patch }; saveMaterials(mats); return mats[idx];
}
function deleteMaterial(id) { saveMaterials(getMaterials().filter(m => m.id !== id)); }

// ── REQUISITIONS ─────────────────────────────────────────────
function getNextReqId() {
  const n = parseInt(localStorage.getItem(KEYS.lastReqNum) || '0') + 1;
  localStorage.setItem(KEYS.lastReqNum, String(n));
  return `REQ-${String(n).padStart(3, '0')}`;
}
function getRequisitions() {
  const stored = localStorage.getItem(KEYS.requisitions);
  if (!stored) {
    const seed = generateSeed();
    localStorage.setItem(KEYS.requisitions, JSON.stringify(seed));
    localStorage.setItem(KEYS.lastReqNum, String(seed.length));
    return seed;
  }
  return JSON.parse(stored);
}
function saveRequisitions(r) { localStorage.setItem(KEYS.requisitions, JSON.stringify(r)); }
function getRequisitionById(id) { return getRequisitions().find(r => r.id === id); }
function addRequisition(data) {
  // Se veio clienteName mas sem clienteId, cria o cliente novo
  if (data.clienteName && !data.clienteId) {
    const c = addCliente(data.clienteName.trim());
    if (c) data.clienteId = c.id;
  }
  const reqs = getRequisitions();
  const req = {
    ...data, id: getNextReqId(), createdAt: todayStr(), status: 'pendente',
    approvedAt:null, rejectNote:null, quotedAt:null, orderedAt:null,
    deliveredAt:null, estimatedDelivery:null, supplier:null, comments:[],
  };
  reqs.push(req); saveRequisitions(reqs); return req;
}
function updateRequisition(id, patch) {
  const reqs = getRequisitions();
  const idx = reqs.findIndex(r => r.id === id);
  if (idx < 0) return null;
  reqs[idx] = { ...reqs[idx], ...patch };
  saveRequisitions(reqs); return reqs[idx];
}
function addComment(reqId, userId, text) {
  const reqs = getRequisitions();
  const idx = reqs.findIndex(r => r.id === reqId);
  if (idx < 0) return;
  reqs[idx].comments.push({ id: Date.now(), userId, text, createdAt: todayStr() });
  saveRequisitions(reqs);
}

// ── CSV EXPORT ────────────────────────────────────────────────
function exportCSV(reqs) {
  const hdr = ['Req_ID','Obra','OS','Solicitante','Aprovador','Recebedor','Status','Criado em','Prazo','Entrega Estimada','Fornecedor','Categoria','Material','Qtd','Un.','Bitola','Cor','Obs','Notas Auditoria'];
  const rows = [];
  reqs.forEach(r => {
    r.items.forEach(it => {
      rows.push([
        r.id, r.clienteName || '', r.osNumber || '', r.osDescription || '', getUserById(r.userId).name, r.approvedByName || '', r.deliveredByName || '', STATUS[r.status].label,
        fmtDate(r.createdAt), fmtDate(r.deadline), fmtDate(r.estimatedDelivery),
        r.supplier || '',
        it.category, it.name||'', it.qty, it.unit, it.bitola||'', it.color||'', it.obs||'', it.qtyChangeNote || ''
      ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(';'));
    });
  });
  const csv = [hdr.join(';'), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'aspem_requisicoes.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ── ALERT HELPER ─────────────────────────────────────────────
function getPendingAlertCount() {
  return getRequisitions().filter(r =>
    (r.status === 'aprovado' || r.status === 'cotacao') && !r.estimatedDelivery
  ).length;
}

// ── PERMISSIONS ──────────────────────────────
function getPermissions() {
  const stored = localStorage.getItem(KEYS.permissions);
  if (!stored) { localStorage.setItem(KEYS.permissions, JSON.stringify(DEFAULT_PERMISSIONS)); return DEFAULT_PERMISSIONS; }
  return JSON.parse(stored);
}
function savePermissions(p) { localStorage.setItem(KEYS.permissions, JSON.stringify(p)); }
function hasPermission(role, view) {
  const p = getPermissions();
  return p[role]?.includes(view);
}
