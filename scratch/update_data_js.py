import openpyxl
import json

def clean_unit(u):
    if not u: return 'un'
    u = str(u).lower().strip()
    if any(x in u for x in ['p', 'pc', 'peça', 'un', 'und']): return 'un'
    if 'm' in u and '²' not in u: return 'm'
    if 'kg' in u: return 'kg'
    if 'cx' in u: return 'cx'
    if 'rol' in u: return 'rol'
    return 'un'

def build_data_js():
    file_path = "Lista de Materiais.xlsx"
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active
    
    materials = []
    seen = set()
    categories = set()
    
    for row in sheet.iter_rows(min_row=4, values_only=True):
        if len(row) < 6: continue
        name = str(row[2]).strip() if row[2] else ""
        category = str(row[4]).strip() if row[4] else "Geral"
        unit = clean_unit(row[5])
        if not name or name == "None": continue
        if category == "None": category = "Geral"
        key = (category, name)
        if key in seen: continue
        seen.add(key)
        categories.add(category)
        materials.append({"category": category, "name": name, "defaultUnit": unit, "active": True})
    
    for cat in sorted(categories):
        materials.append({"category": cat, "name": "Outro", "defaultUnit": "un", "active": True})
    
    materials.sort(key=lambda x: (x['category'], x['name']))
    for i, m in enumerate(materials, 1): m['id'] = i

    # Base data.js template
    js_template = """/* ============================================================
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
};

const UNITS = ['un', 'm', 'm²', 'kg', 'cx', 'rolo', 'par', 'conj', 'pct', 'gl'];

// ── STORAGE KEYS ─────────────────────────────────────────────
const KEYS = {
  users:         'aspem_users',
  materials:     'aspem_materials',
  requisitions:  'aspem_requisitions',
  lastReqNum:    'aspem_last_req_num',
};

// ── DATE HELPERS ─────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; }
function daysFwd(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; }
function fmtDate(s) { if (!s) return '—'; const [y,m,d] = s.split('-'); return `${d}/${m}/${y}`; }

// ── DEFAULT DATA ─────────────────────────────────────────────
const DEFAULT_USERS = [
  { id:1, name:'Carlos Menezes',  username:'carlos.menezes', password:'123456', role:'obra',        obra:'Subestação Norte',        avatar:'CM' },
  { id:2, name:'Fernanda Lima',   username:'fernanda.lima',  password:'123456', role:'obra',        obra:'Planta Industrial Sul',    avatar:'FL' },
  { id:3, name:'Ricardo Souza',   username:'ricardo.souza',  password:'123456', role:'obra',        obra:'Data Center Leste',        avatar:'RS' },
  { id:4, name:'Thiago Barros',   username:'thiago.barros',  password:'123456', role:'obra',        obra:'Torre Comercial Centro',   avatar:'TB' },
  { id:5, name:'Paulo Alves',     username:'paulo.alves',    password:'123456', role:'coordenador', obra:null,                       avatar:'PA' },
  { id:6, name:'Juliana Costa',   username:'juliana.costa',  password:'123456', role:'compras',     obra:null,                       avatar:'JC' },
  { id:7, name:'Marcos Viana',    username:'marcos.viana',   password:'123456', role:'gestao',      obra:null,                       avatar:'MV' },
];

const DEFAULT_MATERIALS = """ + json.dumps(materials, indent=2, ensure_ascii=False) + """;

function generateSeed() {
  return [
    {
      id:'REQ-001', userId:1, obra:'Subestação Norte', osNumber:'OS-2024-001',
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
  ];
}

// ── USERS ────────────────────────────────────────────────────
function getUsers() {
  const stored = localStorage.getItem(KEYS.users);
  if (!stored) { localStorage.setItem(KEYS.users, JSON.stringify(DEFAULT_USERS)); return DEFAULT_USERS; }
  return JSON.parse(stored);
}
function getUserById(id) { return getUsers().find(u => u.id === id) || { name: 'Desconhecido', avatar: '?', role: 'obra' }; }

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
  const hdr = ['Req_ID','Obra','OS','Solicitante','Status','Criado em','Prazo','Entrega Estimada','Fornecedor','Categoria','Material','Qtd','Un.','Bitola','Cor','Obs'];
  const rows = [];
  reqs.forEach(r => {
    r.items.forEach(it => {
      rows.push([
        r.id, r.obra, r.osNumber || '', getUserById(r.userId).name, STATUS[r.status].label,
        fmtDate(r.createdAt), fmtDate(r.deadline), fmtDate(r.estimatedDelivery),
        r.supplier || '',
        it.category, it.name||'', it.qty, it.unit, it.bitola||'', it.color||'', it.obs||''
      ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(';'));
    });
  });
  const csv = [hdr.join(';'), ...rows].join('\\n');
  const blob = new Blob(['\\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
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
"""
    with open("data.js", "w", encoding="utf-8") as f:
        f.write(js_template)

if __name__ == "__main__":
    try:
        build_data_js()
        print("data.js successfully updated with new materials list.")
    except Exception as e:
        print(f"Error: {e}")
