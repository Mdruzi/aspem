
// app.js - Roteador principal e handlers de eventos

// ── STATE ─────────────────────────────────────────────────────
const state = {
  user: null,
  view: 'list',       // 'list' | 'detail' | 'new-req' | 'materials' | 'dashboard' | 'admin-panel'
  selectedReqId: null,
  statusFilter: '',
  obraFilter: '',
  search: '',
  alertDismissed: false,
  itemCount: 1,
};

const app = document.getElementById('app');
const overlay = document.getElementById('modal-overlay');

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, type='success') {
  const tc = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = (type==='success'?'✓ ':type==='error'?'✗ ':'ℹ ') + msg;
  tc.appendChild(t);
  setTimeout(()=>t.remove(), 3500);
}

// ── DEBOUNCE ──────────────────────────────────────────────────
function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// ── SEARCHABLE SELECT (SS) ────────────────────────────────────
function initSS(wrap) {
  const input    = wrap.querySelector('.ss-input');
  const hidden   = wrap.querySelector('.ss-hidden');
  const dropdown = wrap.querySelector('.ss-dropdown');
  if (!input || !dropdown) return;

  const filterOpts = () => {
    const q = input.value.toLowerCase().trim();
    dropdown.querySelectorAll('.ss-option').forEach(opt => {
      opt.style.display = (!q || opt.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
  };

  input.addEventListener('focus', () => { wrap.classList.add('ss-open'); filterOpts(); });
  input.addEventListener('input', () => {
    wrap.classList.add('ss-open');
    filterOpts();
    // Se o usuário edita o texto depois de ter selecionado uma opção, desfaz a seleção
    if (hidden.value) {
      const selText = dropdown.querySelector(`.ss-option[data-value="${CSS.escape(hidden.value)}"]`)?.textContent.trim() || '';
      if (input.value.trim() !== selText) {
        hidden.value = '';
        wrap.dispatchEvent(new CustomEvent('ss-change', { bubbles: true, detail: { value: '', text: input.value } }));
      }
    }
  });

  dropdown.addEventListener('click', e => {
    const opt = e.target.closest('.ss-option');
    if (!opt) return;
    const val  = opt.dataset.value;
    const text = opt.textContent.trim();
    input.value  = text;
    hidden.value = val;
    wrap.classList.remove('ss-open');
    wrap.dispatchEvent(new CustomEvent('ss-change', { bubbles: true, detail: { value: val, text } }));
  });
}

function initSearchableSelects() {
  document.querySelectorAll('.ss-wrap').forEach(initSS);
}

// Repopulates an SS dropdown without re-attaching listeners
function rebuildSS(wrapId, newOpts, newPlaceholder) {
  const wrap = document.getElementById(wrapId + '-wrap');
  if (!wrap) return;
  const dropdown = wrap.querySelector('.ss-dropdown');
  const input    = wrap.querySelector('.ss-input');
  const hidden   = wrap.querySelector('.ss-hidden');
  if (dropdown) dropdown.innerHTML = newOpts.map(o =>
    `<div class="ss-option" data-value="${String(o.value).replace(/"/g,'&quot;')}">${o.text}</div>`
  ).join('');
  if (input)  { input.value = ''; if (newPlaceholder) input.placeholder = newPlaceholder; }
  if (hidden) hidden.value = '';
}

// Global outside-click: close all open SS dropdowns
document.addEventListener('click', e => {
  if (!e.target.closest('.ss-wrap')) {
    document.querySelectorAll('.ss-wrap.ss-open').forEach(w => w.classList.remove('ss-open'));
  }
});

// ── NAVIGATION GUARD ──────────────────────────────────────────
function confirmNavigation() {
  if (state.view !== 'new-req') return true;
  return confirm('Você tem uma requisição em andamento. Deseja descartar as alterações?');
}

// ── NOTIFICATION MODAL ────────────────────────────────────────
function showNotificationModal(title, message) {
  overlay.innerHTML = `
    <div class="modal" style="max-width:400px; text-align:center">
      <div class="modal-header" style="justify-content:center">
        <div class="modal-title" style="font-size:18px">${title}</div>
      </div>
      <div class="modal-body">
        <div style="font-size:40px; margin-bottom:16px">🔔</div>
        <p style="font-size:14px; color:var(--text-muted); line-height:1.5">${message}</p>
      </div>
      <div class="modal-footer" style="justify-content:center">
        <button class="btn btn-primary" id="btn-close-notif" style="min-width:120px">Entendi</button>
      </div>
    </div>
  `;
  overlay.classList.remove('hidden');
  document.getElementById('btn-close-notif')?.addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  });
}

function checkNotifications() {
  if (!state.user) return;
  const reqs = getRequisitions();
  const lastSeen = localStorage.getItem(`last_notif_${state.user.role}`) || '0';
  const currentCount = reqs.length;

  if (state.user.role === 'coordenador') {
    const pending = reqs.filter(r => r.status === 'pendente').length;
    if (pending > 0 && lastSeen !== String(pending)) {
      showNotificationModal('Novas Requisições', `Você tem ${pending} ${pending === 1 ? 'requisição aguardando' : 'requisições aguardando'} sua aprovação.`);
      localStorage.setItem(`last_notif_${state.user.role}`, String(pending));
    }
  } else if (state.user.role === 'compras') {
    const approved = reqs.filter(r => r.status === 'aprovado' || r.status === 'cotacao').length;
    if (approved > 0 && lastSeen !== String(approved)) {
      showNotificationModal('Materiais Aprovados', `Existem ${approved} ${approved === 1 ? 'requisição aprovada' : 'requisições aprovadas'} prontas para processamento de compra.`);
      localStorage.setItem(`last_notif_${state.user.role}`, String(approved));
    }
  } else if (state.user.role === 'obra') {
    const myReqs = reqs.filter(r => r.userId === state.user.id);
    const updated = myReqs.filter(r => r.status === 'aprovado' || r.status === 'cotacao').length;
    if (updated > 0 && lastSeen !== String(updated)) {
      showNotificationModal('Atualização de Pedido', `Suas requisições foram processadas. ${updated} ${updated === 1 ? 'item está' : 'itens estão'} em fase de compra/entrega.`);
      localStorage.setItem(`last_notif_${state.user.role}`, String(updated));
    }
  }
}

// ── RENDER ROOT ───────────────────────────────────────────────
function render() {
  if (!state.user) { app.innerHTML = renderLogin(); bindLogin(); return; }
  const reqs = getRequisitions();
  const alertCount = getPendingAlertCount();
  let html = `<div class="layout" id="main-layout">
    ${renderSidebar(state.user, alertCount)}
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <div class="main-content">
      ${renderTopBar(state.user, reqs)}
      <div class="page-content">
        ${state.user.role==='compras' && alertCount>0 && !state.alertDismissed ? renderAlertBanner(alertCount) : ''}
        ${renderView(reqs)}
      </div>
    </div>
  </div>`;
  app.innerHTML = html;
  bindLayout();
  bindView(reqs);
}

function renderView(reqs) {
  const role = state.user.role;
  
  if (state.view === 'admin-panel' && hasPermission(role, 'admin-panel')) return renderAdminPanel();
  if (state.view === 'materials' && hasPermission(role, 'materials')) return renderMaterialsAdmin(state.user);
  if (state.view === 'dashboard' && hasPermission(role, 'dashboard')) return renderDashboard(reqs);
  if (state.view === 'obras-panel' && ['admin','coordenador','gestao'].includes(role)) return renderObrasPanel(state.user);
  
  if (state.view === 'detail') {
    const req = getRequisitionById(state.selectedReqId);
    if (!req) { state.view='list'; return renderView(reqs); }
    return renderReqDetail(req, state.user);
  }
  if (state.view === 'new-req' && hasPermission(role, 'new-req')) return renderNewReqForm(state.user);
  
  // Default fallback if current view is not permitted
  if (!hasPermission(role, state.view)) {
    if (hasPermission(role, 'list')) { state.view = 'list'; }
    else if (hasPermission(role, 'dashboard')) { state.view = 'dashboard'; }
    else { state.view = 'list'; }
  }

  if (state.view === 'dashboard') return renderDashboard(reqs);
  return renderReqList(getFilteredReqs(reqs), state.user);
}

function getFilteredReqs(reqs) {
  let u = state.user;
  let list = u.role==='obra' ? reqs.filter(r=>r.userId===u.id)
           : u.role==='compras' ? reqs.filter(r=>['aprovado','cotacao','pedido','entregue'].includes(r.status))
           : reqs;
  if (state.statusFilter) list = list.filter(r=>r.status===state.statusFilter);
  if (state.obraFilter)   list = list.filter(r=>r.clienteName===state.obraFilter);
  if (state.search.trim()) {
    const s = state.search.toLowerCase();
    list = list.filter(r=>[r.id,r.necessity,r.clienteName||'',r.osNumber||'',r.osDescription||'',getUserById(r.userId).name,r.approvedByName||'',r.deliveredByName||''].join(' ').toLowerCase().includes(s));
  }
  return list;
}

// ── BIND LAYOUT ───────────────────────────────────────────────
function closeMobileSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('visible');
}

function bindLayout() {
  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    logout(); state.user = null; state.view = 'list'; render();
  });

  // Alert banner
  document.getElementById('alert-close')?.addEventListener('click', () => { state.alertDismissed = true; render(); });

  // Sidebar drawer toggle (mobile)
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('visible');
  });
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeMobileSidebar);

  // Nav items — helper para navegar com guard e fechar sidebar
  const navigate = (view) => {
    closeMobileSidebar();
    if (!confirmNavigation()) return;
    state.view = view;
    render();
  };

  document.getElementById('nav-list')?.addEventListener('click', () => navigate('list'));
  document.getElementById('nav-dashboard')?.addEventListener('click', () => navigate('dashboard'));
  document.getElementById('nav-materials')?.addEventListener('click', () => navigate('materials'));
  document.getElementById('nav-obras')?.addEventListener('click', () => navigate('obras-panel'));
  document.getElementById('nav-admin')?.addEventListener('click', () => navigate('admin-panel'));

  // Suporte a teclado (Enter) nos nav items
  document.querySelectorAll('.nav-item[tabindex]').forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });
}

// ── BIND LOGIN ────────────────────────────────────────────────
function bindLogin() {
  document.getElementById('login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value;
    const user = login(u, p);
    if (user) {
      state.user = user;
      state.alertDismissed = false;
      checkNotifications();
      render();
    } else {
      app.innerHTML = renderLogin('Usuário ou senha incorretos. Tente novamente.');
      bindLogin();
    }
  });

  document.querySelectorAll('.login-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const user = loginByUsername(btn.dataset.user);
      if (user) {
        state.user = user;
        state.alertDismissed = false;
        checkNotifications();
        render();
      }
    });
  });
}

// ── BIND VIEWS ────────────────────────────────────────────────
function bindView(reqs) {
  if (state.view==='admin-panel') { bindAdminPanel(); return; }
  if (state.view==='materials') { bindMaterialsView(); return; }
  if (state.view==='obras-panel') { bindObrasPanel(); return; }
  if (state.view==='detail')    { bindDetailView(); return; }
  if (state.view==='new-req')   { bindNewReqView(); return; }
  if (state.view==='dashboard') { bindDashboardView(); return; }
  bindListView(reqs);
}

// LIST VIEW
function bindListView(reqs) {
  document.getElementById('btn-new-req')?.addEventListener('click', ()=>{ state.view='new-req'; state.itemCount=1; render(); });
  document.getElementById('btn-export')?.addEventListener('click', ()=>exportCSV(getFilteredReqs(reqs)));

  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.value = state.search;
    searchEl.addEventListener('input', debounce(e => { state.search = e.target.value; renderCardList(); }, 280));
  }

  const obraEl = document.getElementById('obra-filter');
  if (obraEl) { obraEl.value = state.obraFilter; obraEl.addEventListener('change', e => { state.obraFilter = e.target.value; renderCardList(); }); }

  document.querySelectorAll('#status-pills .pill').forEach(p => {
    if (p.dataset.status === state.statusFilter) p.classList.add('active'); else p.classList.remove('active');
    p.addEventListener('click', () => {
      state.statusFilter = p.dataset.status;
      document.querySelectorAll('#status-pills .pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      renderCardList();
    });
  });

  document.querySelectorAll('.req-card').forEach(c => {
    c.addEventListener('click', () => { state.selectedReqId = c.dataset.reqId; state.view = 'detail'; render(); });
  });
}

function renderCardList() {
  const reqs = getRequisitions();
  const filtered = getFilteredReqs(reqs);
  const container = document.getElementById('req-cards');
  if (!container) return;
  container.innerHTML = filtered.length===0
    ? `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">Nenhuma requisição encontrada</div></div>`
    : filtered.map(r=>renderReqCard(r)).join('');
  container.querySelectorAll('.req-card').forEach(c=>{
    c.addEventListener('click', ()=>{ state.selectedReqId=c.dataset.reqId; state.view='detail'; render(); });
  });
}

// DETAIL VIEW
function bindDetailView() {
  const req = getRequisitionById(state.selectedReqId);
  if (!req) return;

  document.getElementById('btn-back')?.addEventListener('click', ()=>{ state.view='list'; render(); });
  document.getElementById('btn-print-pdf')?.addEventListener('click', ()=>printReqPDF(req));

  // Inicializa SS do detalhe (campo OS na aprovação)
  initSearchableSelects();

  // SS de OS na aprovação: "Nova OS" abre modal; demais atualizam descrição
  document.getElementById('coord-os-sel-wrap')?.addEventListener('ss-change', e => {
    if (e.detail.value === '__nova__') {
      overlay.innerHTML = renderApprovalNewOSModal(req.clienteId, req.clienteName);
      overlay.classList.remove('hidden');
      bindApprovalNewOSModal(req);
    } else {
      const osId = parseInt(e.detail.value);
      const osObj = osId ? getOSById(osId) : null;
      const el = document.getElementById('coord-os-desc');
      if (el) el.textContent = osObj?.description ? `📝 ${osObj.description}` : '';
    }
  });

  // Approval actions (Coordenador, Gestão, Admin)
  const approveBtn = document.getElementById('btn-approve');
  if (approveBtn) {
    const totalItems = req.items.length;

    const updateProgress = () => {
      const evaluated = document.querySelectorAll('.approval-item-row:not([data-status="pending"])').length;
      const countEl = document.getElementById('eval-count');
      const progressDiv = document.getElementById('approval-progress');
      if (countEl) countEl.textContent = evaluated;
      if (progressDiv) {
        if (evaluated === totalItems) {
          progressDiv.classList.add('complete');
          progressDiv.querySelector('span:first-child').textContent = '✅';
        } else {
          progressDiv.classList.remove('complete');
          progressDiv.querySelector('span:first-child').textContent = '⏳';
        }
      }
    };

    // Aceitar todos os itens de uma vez
    document.getElementById('btn-approve-all')?.addEventListener('click', () => {
      document.querySelectorAll('.approval-item-row').forEach(row => {
        row.dataset.status = 'approved';
        row.style.opacity = '1';
        const apprBtn = row.querySelector('.btn-item-approve');
        const rejBtn  = row.querySelector('.btn-item-reject');
        if (apprBtn) { apprBtn.style.background = '#10B981'; apprBtn.style.color = '#fff'; }
        if (rejBtn)  { rejBtn.style.background  = '#E2E8F0'; rejBtn.style.color  = '#94A3B8'; }
      });
      updateProgress();
    });

    document.querySelectorAll('.btn-item-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.approval-item-row');
        row.dataset.status = 'approved';
        row.style.opacity = '1';
        btn.style.background = '#10B981'; btn.style.color = '#fff';
        const rej = row.querySelector('.btn-item-reject');
        rej.style.background = '#E2E8F0'; rej.style.color = '#94A3B8';
        updateProgress();
      });
    });
    document.querySelectorAll('.btn-item-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.approval-item-row');
        row.dataset.status = 'rejected';
        row.style.opacity = '0.45';
        btn.style.background = '#EF4444'; btn.style.color = '#fff';
        const appr = row.querySelector('.btn-item-approve');
        appr.style.background = '#E2E8F0'; appr.style.color = '#94A3B8';
        updateProgress();
      });
    });

    approveBtn.addEventListener('click', ()=>{
      // OS é obrigatório para aprovar
      const osHidden = document.getElementById('coord-os-sel');
      const osId = osHidden?.value ? parseInt(osHidden.value) : null;
      if (!osId) {
        showToast('Selecione a OS vinculada antes de aprovar.', 'error');
        document.getElementById('coord-os-sel-wrap')?.querySelector('.ss-input')?.focus();
        return;
      }
      const osObj = getOSById(osId);
      const approverName = state.user.name;

      let hasPending = false;
      const updatedItems = req.items.map((item, idx) => {
        const row = document.querySelector(`.approval-item-row[data-idx="${idx}"]`);
        if (!row) return { ...item, approved: true };

        const rowStatus = row.dataset.status;
        if (rowStatus === 'pending') {
          hasPending = true;
          return item;
        }

        const isApproved = rowStatus === 'approved';
        const newQty = parseInt(row.querySelector('.approve-qty').value) || item.qty;
        const obs = row.querySelector('.approve-obs')?.value?.trim() || '';

        const updatedItem = { ...item, approved: isApproved };

        if (isApproved && newQty !== item.qty) {
          updatedItem.originalQty = item.qty;
          updatedItem.qty = newQty;
          updatedItem.qtyChangeNote = `Qtd alterada de ${item.qty} para ${newQty} por ${approverName}` + (obs ? ` — ${obs}` : '');
        } else if (isApproved && obs) {
          updatedItem.qtyChangeNote = `${approverName}: ${obs}`;
        }

        if (!isApproved) {
          updatedItem.qtyChangeNote = `Item não aprovado por ${approverName}` + (obs ? ` — ${obs}` : '');
        }

        return updatedItem;
      });

      if (hasPending) {
        showToast('Por favor, selecione Aprovar ou Rejeitar para todos os itens.', 'error');
        return;
      }

      const approvedCount = updatedItems.filter(it => it.approved).length;
      if (approvedCount === 0) {
        showToast('Nenhum item aprovado. Aprove pelo menos um item.', 'error');
        return;
      }

      updateRequisition(req.id, {
        status: 'aprovado',
        approvedAt: todayStr(),
        approvedByName: approverName,
        items: updatedItems,
        osId: osObj?.id       ?? req.osId,
        osNumber: osObj?.osNumber      ?? req.osNumber,
        osDescription: osObj?.description ?? req.osDescription,
      });

      const changed = updatedItems.filter(it => it.originalQty != null).length;
      const removed = updatedItems.filter(it => !it.approved).length;
      let msg = 'Requisição aprovada!';
      if (changed > 0 || removed > 0) {
        msg += ` (${approvedCount}/${updatedItems.length} itens`;
        if (changed > 0) msg += `, ${changed} com qtd. alterada`;
        msg += ')';
      }
      showToast(msg);
      state.view='list'; render();
    });
  }

  document.getElementById('btn-reject-toggle')?.addEventListener('click', ()=>{
    document.getElementById('reject-section').style.display='block';
    document.getElementById('btn-reject-toggle').classList.add('hidden');
    document.getElementById('btn-reject-confirm').classList.remove('hidden');
    document.getElementById('btn-reject-cancel').classList.remove('hidden');
    document.getElementById('btn-approve').disabled=true;
  });

  document.getElementById('btn-reject-cancel')?.addEventListener('click', ()=>{
    document.getElementById('reject-section').style.display='none';
    document.getElementById('btn-reject-toggle').classList.remove('hidden');
    document.getElementById('btn-reject-confirm').classList.add('hidden');
    document.getElementById('btn-reject-cancel').classList.add('hidden');
    document.getElementById('btn-approve').disabled=false;
  });

  document.getElementById('btn-reject-confirm')?.addEventListener('click', ()=>{
    const note = document.getElementById('reject-note').value.trim();
    if (!note) { showToast('Informe o motivo da rejeição.','error'); return; }
    const osHidden = document.getElementById('coord-os-sel');
    const osId = osHidden?.value ? parseInt(osHidden.value) : null;
    const osObj = osId ? getOSById(osId) : null;
    updateRequisition(req.id, {
      status: 'rejeitado',
      rejectNote: note,
      osId:          osObj?.id          ?? req.osId,
      osNumber:      osObj?.osNumber     ?? req.osNumber,
      osDescription: osObj?.description  ?? req.osDescription,
    });
    showToast('Requisição rejeitada.','error');
    state.view='list'; render();
  });

  // Compras actions
  document.getElementById('btn-save-quote')?.addEventListener('click', ()=>{
    const delivery = document.getElementById('quote-delivery').value;
    if (!delivery) { showToast('Informe a data de disponibilidade.','error'); return; }
    updateRequisition(req.id, { status:'cotacao', quotedAt:todayStr(), estimatedDelivery:delivery });
    showToast('Disponibilidade salva com sucesso!');
    state.selectedReqId=req.id; render();
  });

  document.getElementById('btn-export-detail')?.addEventListener('click', () => {
    exportCSV([req]);
  });

  document.getElementById('btn-mark-ordered')?.addEventListener('click', ()=>{
    updateRequisition(req.id, { status:'pedido', orderedAt:todayStr(), orderedByName: state.user.name });
    showToast('Pedido registrado!');
    state.selectedReqId=req.id; render();
  });
  document.getElementById('btn-mark-delivered')?.addEventListener('click', ()=>{
    updateRequisition(req.id, { status:'entregue', deliveredAt:todayStr(), deliveredByName: state.user.name });
    showToast('Entrega confirmada! ✅');
    state.view='list'; render();
  });

  // Comments
  const commentText = document.getElementById('comment-text');
  const sendComment = ()=>{
    const t = commentText?.value.trim();
    if (!t) return;
    addComment(req.id, state.user.id, t);
    commentText.value='';
    const updatedReq = getRequisitionById(req.id);
    const list = document.getElementById('comment-list');
    if (list) list.outerHTML = renderComments(updatedReq, state.user);
    document.getElementById('comment-list')?.scrollTo(0,9999);
  };
  document.getElementById('btn-send-comment')?.addEventListener('click', sendComment);
  commentText?.addEventListener('keydown', e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendComment();} });
}

// NEW REQ VIEW
function bindNewReqView() {
  const categories = getMaterialCategories();
  const materials = getActiveMaterials();

  const addItem = ()=>{
    const idx = state.itemCount;
    const container = document.getElementById('items-container');
    const row = document.createElement('div');
    row.innerHTML = renderItemRow(idx, categories, materials, null);
    container.appendChild(row.firstElementChild);
    state.itemCount++;
    rebindItemHandlers();
  };

  const rebindItemHandlers = ()=>{
    document.querySelectorAll('.item-cat').forEach(sel=>{
      sel.onchange = e=>{
        const idx = parseInt(sel.dataset.idx);
        const cat = sel.value;
        const isOutros = cat === '__outros__';

        const matSel       = document.querySelector(`.item-mat[data-idx="${idx}"]`);
        const outrosWrap   = document.querySelector(`#item-${idx} .item-outros-wrap`);
        const outrosCatWrap= document.querySelector(`#item-${idx} .item-outros-cat-wrap`);

        if (outrosWrap)    outrosWrap.style.display    = isOutros ? '' : 'none';
        if (outrosCatWrap) outrosCatWrap.style.display = isOutros ? '' : 'none';
        if (matSel)        matSel.style.display        = isOutros ? 'none' : '';

        if (!isOutros && matSel) {
          const matsForCat = materials.filter(m=>m.category===cat);
          matSel.innerHTML = matsForCat.map(m=>`<option value="${m.id}" data-unit="${m.defaultUnit}">${m.name}</option>`).join('');
          updateUnit(idx);
        }

        const bitolaWrap = document.querySelector(`.item-bitola[data-idx="${idx}"]`)?.closest('.item-bitola-wrap');
        const colorWrap  = document.querySelector(`.item-color[data-idx="${idx}"]`)?.closest('.item-color-wrap');
        if (bitolaWrap) bitolaWrap.style.display = cat==='Cabeamento' ? '' : 'none';
        if (colorWrap)  colorWrap.style.display  = cat==='Cabeamento' ? '' : 'none';
      };
    });
    document.querySelectorAll('.item-mat').forEach(sel=>{
      sel.onchange = ()=>updateUnit(parseInt(sel.dataset.idx));
    });
    document.querySelectorAll('.remove-item').forEach(btn=>{
      btn.onclick = ()=>{
        if (document.querySelectorAll('.item-card').length<=1) return;
        document.getElementById(`item-${btn.dataset.idx}`)?.remove();
        renumberItems();
      };
    });
  };

  const updateUnit = idx=>{
    const matSel = document.querySelector(`.item-mat[data-idx="${idx}"]`);
    const unitSel = document.querySelector(`.item-unit[data-idx="${idx}"]`);
    if (!matSel||!unitSel) return;
    const opt = matSel.selectedOptions[0];
    const u = opt?.dataset.unit||'un';
    unitSel.value=u;
  };

  const renumberItems = ()=>{
    document.querySelectorAll('.item-card').forEach((card,i)=>{
      const numEl = card.querySelector('.item-number');
      if (numEl) numEl.textContent=i+1;
    });
  };

  // Initial item
  const container = document.getElementById('items-container');
  const row = document.createElement('div');
  row.innerHTML = renderItemRow(0, categories, materials, null);
  container.appendChild(row.firstElementChild);
  rebindItemHandlers();

  // Expõe rebind e contexto para importação via câmera e voz
  window._aspemRebindItems = rebindItemHandlers;
  window._aspemCategories  = categories;
  window._aspemMaterials   = materials;

  document.getElementById('btn-add-item')?.addEventListener('click', addItem);
  document.getElementById('btn-camera-import')?.addEventListener('click', bindCameraImport);
  document.getElementById('btn-audio-import')?.addEventListener('click', bindAudioImport);
  document.getElementById('btn-mic-necessity')?.addEventListener('click', bindMicNecessidade);

  const cancelFn = () => {
    if (confirm('Deseja descartar esta requisição e os itens preenchidos?')) {
      state.view = 'list'; render();
    }
  };
  document.getElementById('btn-cancel-req')?.addEventListener('click', cancelFn);
  document.getElementById('btn-cancel-req2')?.addEventListener('click', cancelFn);

  // Inicializa os searchable selects do formulário
  initSearchableSelects();

  // Ao selecionar um cliente existente, popula o dropdown de OS; ao desselecionar, limpa
  const allOses = getOSes().filter(o => o.active);
  document.getElementById('req-cliente-sel-wrap')?.addEventListener('ss-change', e => {
    const clienteId = e.detail.value ? parseInt(e.detail.value) : null;
    const oses = clienteId ? allOses.filter(o => o.clienteId === clienteId) : [];
    rebuildSS('req-os-sel', oses.map(o => ({ value: String(o.id), text: `${o.osNumber} — ${o.description}` })));
    const descEl = document.getElementById('req-os-desc');
    if (descEl) descEl.textContent = '';
  });

  // OS: mostrar descrição abaixo quando selecionada
  document.getElementById('req-os-sel-wrap')?.addEventListener('ss-change', e => {
    const osId = parseInt(e.detail.value);
    const osObj = osId ? getOSById(osId) : null;
    const el = document.getElementById('req-os-desc');
    if (el) el.textContent = osObj?.description ? `📝 ${osObj.description}` : '';
  });

  document.getElementById('btn-submit-req')?.addEventListener('click', ()=>{
    const clienteWrap  = document.getElementById('req-cliente-sel-wrap');
    const clienteHidden = document.getElementById('req-cliente-sel');  // hidden input do SS
    const clienteText  = clienteWrap?.querySelector('.ss-input')?.value.trim() || '';
    const osHidden     = document.getElementById('req-os-sel');        // hidden input do SS

    // Resolve cliente: se selecionou da lista usa o ID; senão usa o texto digitado como novo
    let clienteId   = null;
    let clienteName = '';
    if (clienteHidden?.value) {
      clienteId   = parseInt(clienteHidden.value);
      clienteName = getClientes().find(c => c.id === clienteId)?.name || clienteText;
    } else if (clienteText) {
      clienteName = clienteText; // será criado em addRequisition
    }

    // alias mantido para compatibilidade com o restante do handler
    const clienteSel = clienteHidden;
    const osSel      = osHidden;

    // Resolve OS
    let osId = null, osNumber = '', osDescription = '';
    if (osSel?.value) {
      osId = parseInt(osSel.value);
      const osObj = getOSById(osId);
      osNumber      = osObj?.osNumber      || '';
      osDescription = osObj?.description   || '';
      if (!clienteId && osObj) clienteId = osObj.clienteId;
    }

    const necessity = document.getElementById('req-necessity').value.trim();
    const deadline  = document.getElementById('req-deadline').value;

    if (!clienteName && !clienteId) { showToast('Digite o nome do cliente ou da obra.','error'); return; }
    if (!deadline) { showToast('Informe o prazo máximo de entrega.','error'); return; }

    const items = [];
    let valid = true;
    document.querySelectorAll('.item-card').forEach((row,i)=>{
      if (!valid) return;
      const catSel  = row.querySelector('.item-cat');
      const qtySel  = row.querySelector('.item-qty');
      const unitSel = row.querySelector('.item-unit');
      const obsSel  = row.querySelector('.item-obs');
      const isOutros = catSel?.value === '__outros__';

      if (!qtySel.value) { valid = false; showToast('Informe a quantidade de todos os itens.', 'error'); return; }

      if (isOutros) {
        const outrosName = row.querySelector('.item-outros-name')?.value.trim();
        const outrosCat  = row.querySelector('.item-outros-cat')?.value;
        if (!outrosName) { valid = false; showToast('Informe o nome do material em "Outros".', 'error'); return; }
        const newMat = addMaterial({ category: outrosCat, name: outrosName, defaultUnit: unitSel.value });
        items.push({ id:i+1, category:outrosCat, name:outrosName, matId:newMat.id, qty:parseInt(qtySel.value), unit:unitSel.value, obs:obsSel?.value||'', bitola:null, color:null });
      } else {
        const matSel   = row.querySelector('.item-mat');
        if (!matSel?.value) { valid = false; showToast('Selecione o material de todos os itens.', 'error'); return; }
        const bitolaSel = row.querySelector('.item-bitola');
        const colorSel  = row.querySelector('.item-color');
        const mat = materials.find(m=>m.id===parseInt(matSel.value));
        const bitola = catSel.value === 'Cabeamento' && bitolaSel ? bitolaSel.value : null;
        const color  = catSel.value === 'Cabeamento' && colorSel  ? colorSel.value  : null;
        items.push({ id:i+1, category:catSel.value, name:mat?.name||matSel.options[matSel.selectedIndex]?.text||'', matId:parseInt(matSel.value), qty:parseInt(qtySel.value), unit:unitSel.value, obs:obsSel?.value||'', bitola, color });
      }
    });

    if (!valid||items.length===0) { showToast('Preencha todos os itens corretamente.','error'); return; }

    addRequisition({ userId:state.user.id, clienteId, clienteName, osId, osNumber, osDescription, necessity, deadline, items });
    showToast('Requisição enviada com sucesso! ✅');
    state.view='list'; render();
  });
}

// DASHBOARD VIEW
function bindDashboardView() {
  document.querySelectorAll('#dashboard-view .obra-tag').forEach(t=>{
    t.addEventListener('click', ()=>{
      const reqs = t.dataset.obra==='' ? getRequisitions() : getRequisitions().filter(r=>r.clienteName===t.dataset.obra);
      document.querySelectorAll('#dashboard-view .obra-tag').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      document.querySelector('#dashboard-view').outerHTML = renderDashboard(reqs);
      bindDashboardView();
    });
  });
  document.getElementById('btn-export-dash')?.addEventListener('click',()=>exportCSV(getRequisitions()));
  document.querySelectorAll('.dash-req-row').forEach(r=>{
    r.addEventListener('click',()=>{ state.selectedReqId=r.dataset.reqId; state.view='detail'; render(); });
  });
}

// MATERIALS VIEW
function bindMaterialsView() {
  document.getElementById('btn-back-materials')?.addEventListener('click',()=>{ state.view='list'; render(); });

  document.getElementById('btn-open-add-material')?.addEventListener('click',()=>{
    overlay.innerHTML = renderAddMaterialModal();
    overlay.classList.remove('hidden');
    bindMaterialModal();
  });

  document.querySelectorAll('.mat-toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.matId);
      const mat=getMaterials().find(m=>m.id===id);
      if(mat){ updateMaterial(id,{active:!mat.active}); render(); }
    });
  });

  document.querySelectorAll('.mat-delete').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(confirm('Remover este material do catálogo?')){ deleteMaterial(parseInt(btn.dataset.matId)); showToast('Material removido.'); render(); }
    });
  });
}

function bindMaterialModal() {
  const closeModal = ()=>{ overlay.classList.add('hidden'); overlay.innerHTML=''; };
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-close2')?.addEventListener('click', closeModal);

  document.getElementById('mat-cat-select')?.addEventListener('change', e=>{
    const newEl = document.getElementById('mat-cat-new');
    newEl.classList.toggle('hidden', e.target.value!=='__new__');
  });

  document.getElementById('btn-save-material')?.addEventListener('click', ()=>{
    const catSel = document.getElementById('mat-cat-select').value;
    const catNew = document.getElementById('mat-cat-new').value.trim();
    const category = catSel==='__new__' ? catNew : catSel;
    const name = document.getElementById('mat-name').value.trim();
    const defaultUnit = document.getElementById('mat-unit').value;
    if (!category) { showToast('Informe a categoria.','error'); return; }
    if (!name) { showToast('Informe o nome do material.','error'); return; }
    addMaterial({ category, name, defaultUnit });
    showToast('Material adicionado ao catálogo!');
    closeModal(); render();
  });
}

// ── PDF EXPORT ────────────────────────────────────────────────
function printReqPDF(req) {
  const owner = getUserById(req.userId);
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${req.id} — ASPEM</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1E293B;padding:32px;font-size:13px}
  .hd{display:flex;justify-content:space-between;border-bottom:3px solid #F59E0B;padding-bottom:16px;margin-bottom:20px}
  .logo{font-size:20px;font-weight:900}.info{font-size:11px;color:#64748B;margin-top:4px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
  .box{background:#F8FAFC;border-radius:8px;padding:12px}.lbl{font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:3px}.val{font-size:14px;font-weight:700}
  .sec{margin-bottom:18px}.sec-t{font-size:12px;font-weight:800;text-transform:uppercase;border-bottom:1px solid #E2E8F0;padding-bottom:6px;margin-bottom:10px}
  .nb{background:#FFFBEB;border-left:4px solid #F59E0B;padding:12px;border-radius:0 8px 8px 0;line-height:1.6}
  table{width:100%;border-collapse:collapse}th{background:#F1F5F9;padding:8px;text-align:left;font-size:11px;font-weight:700;color:#64748B}td{padding:8px;border-bottom:1px solid #F1F5F9;font-size:12px}
  .pbtn{background:#F59E0B;color:#0F172A;border:none;padding:8px 18px;border-radius:6px;font-weight:700;cursor:pointer;margin-bottom:20px}
  @media print{.pbtn{display:none}}</style></head><body>
  <button class="pbtn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
  <div class="hd">
    <div><div class="logo">⚡ ASPEM</div><div class="info">Sistema de Requisição de Materiais Elétricos</div></div>
    <div style="text-align:right"><div style="font-size:18px;font-weight:900;font-family:monospace">${req.id}</div>
    <div style="font-size:11px;color:#64748B">${STATUS[req.status].icon} ${STATUS[req.status].label}</div></div>
  </div>
  <div class="grid">
    <div class="box"><div class="lbl">Cliente</div><div class="val">${req.clienteName||'—'}</div></div>
    <div class="box"><div class="lbl">Solicitante</div><div class="val">${owner.name}</div></div>
    <div class="box"><div class="lbl">OS</div><div class="val">${req.osNumber||'—'}</div></div>
    ${req.osDescription?`<div class="box" style="grid-column:span 3"><div class="lbl">Descrição da OS</div><div class="val" style="font-size:12px;font-weight:400">${req.osDescription}</div></div>`:''}
    <div class="box"><div class="lbl">Data da Requisição</div><div class="val">${fmtDate(req.createdAt)}</div></div>
    <div class="box"><div class="lbl">Prazo Necessário</div><div class="val" style="color:#EF4444">${fmtDate(req.deadline)}</div></div>
    <div class="box"><div class="lbl">Entrega Estimada</div><div class="val" style="color:#10B981">${fmtDate(req.estimatedDelivery)}</div></div>
    ${req.approvedByName ? `<div class="box"><div class="lbl">Aprovador</div><div class="val" style="color:#3B82F6">${req.approvedByName}</div></div>` : ''}
    ${req.deliveredByName ? `<div class="box"><div class="lbl">Recebedor</div><div class="val" style="color:#10B981">${req.deliveredByName}</div></div>` : ''}
  </div>
  <div class="sec"><div class="sec-t">📝 Necessidade do Material</div><div class="nb">${req.necessity}</div></div>
  <div class="sec"><div class="sec-t">📦 Lista de Materiais</div>
    <table><thead><tr><th>#</th><th>Categoria</th><th>Material</th><th>Qtd</th><th>Un.</th><th>Cor</th><th>Bitola</th><th>Obs.</th></tr></thead><tbody>
    ${req.items.map((it,i)=>`<tr><td>${i+1}</td><td>${it.category}</td><td>${it.name||it.description||''}</td><td style="text-align:center;font-weight:700">${it.qty}</td><td style="text-align:center">${it.unit}</td><td style="text-align:center">${it.color||'—'}</td><td style="text-align:center">${it.bitola||'—'}</td><td style="color:#94A3B8">${it.obs||'—'}</td></tr>`).join('')}
    </tbody></table>
  </div>
  ${req.supplier?`<div class="grid"><div class="box"><div class="lbl">Fornecedor</div><div class="val">${req.supplier}</div></div></div>`:''}
  </body></html>`;
  const w = window.open('','_blank','width=900,height=700');
  if(w){w.document.write(html);w.document.close();}
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  const saved = getCurrentUser();
  if (saved) {
    state.user = saved;
    checkNotifications();
  }
  render();
}

window.addEventListener('DOMContentLoaded', init);

// ADMIN PANEL VIEW
function bindAdminPanel() {
  document.getElementById('btn-save-perms')?.addEventListener('click', () => {
    const permissions = getPermissions();
    document.querySelectorAll('.perm-check').forEach(chk => {
      const role = chk.dataset.role;
      const view = chk.dataset.view;
      if (chk.checked) {
        if (!permissions[role].includes(view)) permissions[role].push(view);
      } else {
        permissions[role] = permissions[role].filter(v => v !== view);
      }
    });
    savePermissions(permissions);
    showToast('Permissões atualizadas com sucesso!');
    render();
  });

  document.getElementById('btn-open-add-user')?.addEventListener('click', () => {
    overlay.innerHTML = renderAddUserModal();
    overlay.classList.remove('hidden');
    bindUserModal();
  });

  document.querySelectorAll('.user-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.uid);
      const user = getUserById(id);
      if (user) {
        overlay.innerHTML = renderAddUserModal(user);
        overlay.classList.remove('hidden');
        bindUserModal();
      }
    });
  });

  document.querySelectorAll('.user-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const id = parseInt(btn.dataset.uid);
        deleteUser(id);
        showToast('Usuário removido.');
        render();
      }
    });
  });
}

function bindUserModal() {
  const closeModal = () => { overlay.classList.add('hidden'); overlay.innerHTML = ''; };
  document.getElementById('modal-close-user')?.addEventListener('click', closeModal);
  document.getElementById('modal-cancel-user')?.addEventListener('click', closeModal);
  initSearchableSelects();

  // ── Helpers visuais do bloco obra ──────────────────────────
  const section  = document.getElementById('user-obra-section');
  const badge    = document.getElementById('user-obra-badge');
  const required = document.getElementById('user-obra-required');
  const infoEl   = document.getElementById('user-obra-info');
  const newForm  = document.getElementById('user-obra-new-form');

  const highlightObra = (isObra) => {
    if (!section) return;
    section.style.border       = isObra ? '2px solid var(--primary)' : '2px solid var(--border)';
    section.style.background   = isObra ? 'rgba(27,79,216,0.04)'     : 'var(--surface)';
    if (badge)    badge.style.display    = isObra ? 'inline' : 'none';
    if (required) required.style.display = isObra ? 'inline' : 'none';
  };

  const updateObraInfo = (clienteId) => {
    if (!infoEl) return;
    if (!clienteId) { infoEl.textContent = ''; return; }
    const oses = getOSes().filter(o => o.clienteId === clienteId);
    infoEl.textContent = oses.length
      ? `📋 ${oses.length} OS${oses.length!==1?'s':''}: ${oses.map(o=>o.osNumber).join(', ')}`
      : '📋 Nenhuma OS cadastrada ainda para este cliente';
  };

  // Reage à troca de perfil
  document.getElementById('user-role')?.addEventListener('change', e => {
    highlightObra(e.target.value === 'obra');
  });

  // Reage à seleção de cliente no SS
  document.getElementById('user-obra-wrap')?.addEventListener('ss-change', e => {
    if (e.detail.value === '__novo__') {
      if (newForm) { newForm.style.display = ''; }
      document.getElementById('user-obra-new-name')?.focus();
      updateObraInfo(null);
    } else {
      if (newForm) newForm.style.display = 'none';
      updateObraInfo(e.detail.value ? parseInt(e.detail.value) : null);
    }
  });

  // Cancelar novo cliente
  document.getElementById('btn-user-obra-cancel')?.addEventListener('click', () => {
    if (newForm) newForm.style.display = 'none';
    rebuildSS('user-obra', [
      { value: '', text: '— Nenhum —' },
      ...getClientes().map(c => ({ value: String(c.id), text: c.name })),
      { value: '__novo__', text: '➕ Cadastrar novo cliente agora' }
    ], 'Buscar ou selecionar cliente...');
  });

  // Confirmar novo cliente inline
  document.getElementById('btn-user-obra-confirm')?.addEventListener('click', () => {
    const name = document.getElementById('user-obra-new-name')?.value.trim();
    if (!name) { showToast('Informe o nome do cliente.', 'error'); return; }

    const novoCliente = addCliente(name);
    if (newForm) newForm.style.display = 'none';

    // Reconstrói SS já com o novo cliente selecionado
    rebuildSS('user-obra', [
      { value: '', text: '— Nenhum —' },
      ...getClientes().map(c => ({ value: String(c.id), text: c.name })),
      { value: '__novo__', text: '➕ Cadastrar novo cliente agora' }
    ]);
    const wrap = document.getElementById('user-obra-wrap');
    if (wrap) {
      wrap.querySelector('.ss-input').value  = novoCliente.name;
      wrap.querySelector('.ss-hidden').value = String(novoCliente.id);
    }
    updateObraInfo(novoCliente.id);
    showToast(`Cliente "${name}" criado e vinculado! ✅`);
  });

  // ── Salvar usuário ─────────────────────────────────────────
  document.getElementById('btn-save-user')?.addEventListener('click', () => {
    const idStr    = document.getElementById('user-id').value;
    const isEdit   = !!idStr;
    const name     = document.getElementById('user-name').value.trim();
    const username = document.getElementById('user-username').value.trim();
    const password = document.getElementById('user-password').value;
    const role     = document.getElementById('user-role').value;
    const clienteIdRaw = document.getElementById('user-obra')?.value;
    const clienteId    = clienteIdRaw ? parseInt(clienteIdRaw) : null;

    if (!name || !username || !password || !role) {
      showToast('Preencha todos os campos obrigatórios.', 'error'); return;
    }

    const userData = { name, username, password, role, clienteId };
    if (isEdit) {
      updateUser(parseInt(idStr), userData);
      showToast('Usuário atualizado com sucesso!');
    } else {
      addUser(userData);
      showToast('Usuário criado com sucesso!');
    }
    closeModal(); render();
  });
}

// OBRAS PANEL (Clientes + OS)
function bindObrasPanel() {
  bindBudgetUpload();

  document.getElementById('btn-open-add-obra')?.addEventListener('click', () => {
    overlay.innerHTML = renderAddObraModal();
    overlay.classList.remove('hidden');
    bindObraModal();
  });

  document.getElementById('btn-open-add-os')?.addEventListener('click', () => {
    overlay.innerHTML = renderAddOSModal();
    overlay.classList.remove('hidden');
    bindOSModal();
  });

  // Clientes
  document.querySelectorAll('.obra-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.obraId);
      const c = getClientes().find(x => x.id === id);
      if (c) { updateCliente(id, { active: !c.active }); render(); }
    });
  });
  document.querySelectorAll('.obra-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Excluir este cliente e todas as suas OS?')) {
        deleteCliente(parseInt(btn.dataset.obraId));
        showToast('Cliente removido.');
        render();
      }
    });
  });

  // OSes
  document.querySelectorAll('.os-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.osId);
      const o = getOSById(id);
      if (o) { updateOS(id, { active: !o.active }); render(); }
    });
  });
  document.querySelectorAll('.os-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Excluir esta OS?')) {
        deleteOS(parseInt(btn.dataset.osId));
        showToast('OS removida.');
        render();
      }
    });
  });

  // Inicializa searchable selects do painel
  initSearchableSelects();

  const allOsesHistory = getOSes();

  const getClienteFilterVal = () => document.getElementById('history-cliente-filter')?.value || '';
  const getOsFilterVal      = () => document.getElementById('history-obra-filter')?.value || '';

  const refreshHistory = () => {
    const clienteId = getClienteFilterVal() ? parseInt(getClienteFilterVal()) : null;
    const osNumber  = getOsFilterVal() || null;
    const container = document.getElementById('history-table-container');
    if (osNumber || clienteId) {
      container.innerHTML = renderObraHistoryTable({ osNumber, clienteId }, getRequisitions());
    } else {
      container.innerHTML = `<div class="empty-state" style="padding:40px"><div class="empty-state-icon">🔎</div><div class="empty-state-title">Selecione um cliente ou uma OS para ver o histórico</div></div>`;
    }
  };

  // Ao trocar cliente → repopula o SS de OS
  document.getElementById('history-cliente-filter-wrap')?.addEventListener('ss-change', e => {
    const clienteId = e.detail.value ? parseInt(e.detail.value) : null;
    const osesDoCliente = clienteId
      ? allOsesHistory.filter(o => o.clienteId === clienteId)
      : allOsesHistory;
    rebuildSS('history-obra-filter',
      osesDoCliente.map(o => ({ value: o.osNumber, text: `${o.osNumber} — ${o.description}` })),
      '📋 Todas as OSes'
    );
    refreshHistory();
  });

  document.getElementById('history-obra-filter-wrap')?.addEventListener('ss-change', refreshHistory);

  document.getElementById('btn-export-history')?.addEventListener('click', () => {
    const clienteId = getClienteFilterVal() ? parseInt(getClienteFilterVal()) : null;
    const osNumber  = getOsFilterVal() || null;
    if (!osNumber && !clienteId) { showToast('Selecione um cliente ou uma OS primeiro.', 'error'); return; }
    exportObraHistory({ osNumber, clienteId });
  });
}

function bindApprovalNewOSModal(req) {
  const closeModal = () => { overlay.classList.add('hidden'); overlay.innerHTML = ''; };
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-close2')?.addEventListener('click', closeModal);
  initSearchableSelects();

  // Mostra nome do arquivo selecionado
  document.getElementById('approval-budget-file')?.addEventListener('change', e => {
    const file = e.target.files[0];
    const preview = document.getElementById('approval-budget-preview');
    if (preview) preview.textContent = file ? `📎 ${file.name}` : '';
  });

  document.getElementById('btn-save-approval-os')?.addEventListener('click', async () => {
    // Resolve clienteId
    let clienteId = null;
    const hiddenCli = document.getElementById('approval-os-cliente-id');
    const ssCli     = document.getElementById('approval-os-cliente-sel');
    if (hiddenCli) clienteId = parseInt(hiddenCli.value);
    else if (ssCli?.value) clienteId = parseInt(ssCli.value);

    const osNumber    = document.getElementById('approval-os-number')?.value.trim();
    const description = document.getElementById('approval-os-description')?.value.trim();

    if (!clienteId)   { showToast('Selecione o cliente.', 'error'); return; }
    if (!osNumber)    { showToast('Informe o número da OS.', 'error'); return; }
    if (!description) { showToast('Informe a descrição da obra.', 'error'); return; }

    const newOS = addOS({ clienteId, osNumber, description });

    // Importar orçamento se fornecido (opcional)
    const budgetFile = document.getElementById('approval-budget-file')?.files[0];
    if (budgetFile) {
      try {
        await loadSheetJS();
        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = ev => {
            try {
              const wb   = XLSX.read(ev.target.result, { type: 'array' });
              const ws   = wb.Sheets[wb.SheetNames[0]];
              const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
              const first = rows[0] || [];
              const hasHeader = first.some(c => /material|nome|item|descri/i.test(String(c)));
              const dataRows  = hasHeader ? rows.slice(1) : rows;
              const items = [];
              dataRows.forEach(row => {
                const name = String(row[0] || '').trim();
                const qty  = parseFloat(String(row[1] || '0').replace(',', '.')) || 0;
                const unit = String(row[2] || '').trim() || 'un';
                if (name && qty > 0) items.push({ name, qty, unit });
              });
              if (items.length) {
                saveBudgetForOS(newOS.id, items);
                showToast(`${items.length} itens do orçamento importados! ✅`);
              }
              resolve();
            } catch (err) { reject(err); }
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(budgetFile);
        });
      } catch (err) {
        showToast('Aviso: não foi possível ler o orçamento. ' + err.message, 'error');
      }
    }

    showToast(`OS ${osNumber} cadastrada e vinculada! ✅`);
    closeModal();

    // Repopula o SS de OS na tela de aprovação e seleciona a nova OS
    const allOSes = getOSes().filter(o => o.active && (!req.clienteId || o.clienteId === req.clienteId));
    rebuildSS('coord-os-sel', [
      ...allOSes.map(o => ({ value: String(o.id), text: `${o.osNumber} — ${o.description}` })),
      { value: '__nova__', text: '➕ Cadastrar Nova OS' }
    ]);

    // Seleciona a nova OS manualmente
    const wrap = document.getElementById('coord-os-sel-wrap');
    if (wrap) {
      const inp = wrap.querySelector('.ss-input');
      const hid = wrap.querySelector('.ss-hidden');
      if (inp) inp.value = `${newOS.osNumber} — ${newOS.description}`;
      if (hid) hid.value = String(newOS.id);
    }
    const descEl = document.getElementById('coord-os-desc');
    if (descEl) descEl.textContent = `📝 ${newOS.description}`;
  });
}

function bindObraModal() {
  const closeModal = () => { overlay.classList.add('hidden'); overlay.innerHTML=''; };
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-close2')?.addEventListener('click', closeModal);

  document.getElementById('btn-save-obra')?.addEventListener('click', () => {
    const name = document.getElementById('obra-name').value.trim();
    if (!name) { showToast('Informe o nome do cliente.', 'error'); return; }
    addCliente(name);
    showToast('Cliente adicionado com sucesso!');
    closeModal(); render();
  });
}

function bindOSModal() {
  const closeModal = () => { overlay.classList.add('hidden'); overlay.innerHTML=''; };
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-close2')?.addEventListener('click', closeModal);

  initSearchableSelects();

  document.getElementById('btn-save-os')?.addEventListener('click', () => {
    const clienteId  = parseInt(document.getElementById('os-cliente-sel').value); // hidden SS input
    const osNumber   = document.getElementById('os-number').value.trim();
    const description= document.getElementById('os-description').value.trim();
    if (!clienteId)   { showToast('Selecione o cliente.', 'error'); return; }
    if (!osNumber)    { showToast('Informe o número da OS.', 'error'); return; }
    if (!description) { showToast('Informe a descrição da obra.', 'error'); return; }
    addOS({ clienteId, osNumber, description });
    showToast('OS criada com sucesso!');
    closeModal(); render();
  });
}

function exportObraHistory(filter) {
  // filter: { osNumber?, clienteId? }
  const allReqs = getRequisitions();
  const reqs = allReqs.filter(r => {
    if (filter.osNumber)  return r.osNumber === filter.osNumber;
    if (filter.clienteId) return r.clienteId === filter.clienteId;
    return false;
  });

  const rows = [['Data Pedido', 'Cliente', 'OS', 'Solicitante', 'Material', 'Qtd', 'Unidade', 'Status', 'Data Entrega']];
  reqs.forEach(r => {
    r.items.forEach(it => {
      rows.push([
        fmtDate(r.createdAt),
        r.clienteName || '\u2014',
        r.osNumber    || '\u2014',
        getUserById(r.userId).name,
        it.name || it.description,
        it.qty,
        it.unit,
        STATUS[r.status].label,
        fmtDate(r.deliveredAt)
      ]);
    });
  });

  // Nome do arquivo
  let filename = 'historico';
  if (filter.osNumber)  filename += `_${filter.osNumber.replace(/[^a-z0-9]/gi,'_')}`;
  else if (filter.clienteId) {
    const c = getClientes().find(x => x.id === filter.clienteId);
    if (c) filename += `_${c.name.toLowerCase().replace(/\s+/g,'_')}`;
  }

  const csvContent = '\uFEFF' + rows.map(e => e.join('\t')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// \u2500\u2500 OR\u00c7AMENTO POR OBRA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function loadSheetJS() {
  return new Promise((resolve, reject) => {
    if (typeof XLSX !== 'undefined') { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Falha ao carregar leitor de planilha.'));
    document.head.appendChild(s);
  });
}

function renderBudgetPreview(osId) {
  osId = parseInt(osId);
  const items = getBudgetForOS(osId);
  const el = document.getElementById('budget-preview');
  if (!el) return;
  if (!items.length) { el.innerHTML = ''; return; }
  const osObj = getOSById(osId);
  const label = osObj ? `${osObj.osNumber} \u2014 ${osObj.description}` : `OS #${osId}`;
  el.innerHTML = `
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">${items.length} materiais or\u00e7ados para <strong>${label}</strong></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Material</th><th>Or\u00e7ado</th><th>Un.</th><th>Consumido</th><th>Utiliza\u00e7\u00e3o</th></tr></thead>
        <tbody>
          ${items.map(b => {
            const consumed = getConsumedQty(osId, b.name);
            const pct = b.qty > 0 ? Math.min(100, Math.round(consumed / b.qty * 100)) : 0;
            const color = pct > 100 ? 'var(--danger)' : pct > 80 ? '#F59E0B' : 'var(--success)';
            return `<tr>
              <td>${b.name}</td>
              <td style="text-align:center">${b.qty}</td>
              <td style="text-align:center">${b.unit||'\u2014'}</td>
              <td style="text-align:center">${consumed}</td>
              <td style="min-width:120px">
                <div class="budget-bar-track" style="margin-bottom:2px">
                  <div class="budget-bar-consumed" style="width:${pct}%"></div>
                </div>
                <span style="font-size:11px;font-weight:700;color:${color}">${pct}%</span>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function bindBudgetUpload() {
  const obraSel   = document.getElementById('budget-obra-sel');   // hidden SS input
  const fileInput = document.getElementById('budget-file-input');
  const uploadBtn = document.getElementById('btn-upload-budget');
  if (!fileInput || !uploadBtn) return;

  document.getElementById('budget-obra-sel-wrap')?.addEventListener('ss-change', e => {
    renderBudgetPreview(e.detail.value ? parseInt(e.detail.value) : null);
  });

  uploadBtn.addEventListener('click', async () => {
    const osId = parseInt(obraSel.value);
    if (!osId) { showToast('Selecione uma OS primeiro.', 'error'); return; }
    const file = fileInput.files[0];
    if (!file) { showToast('Selecione uma planilha (.xlsx ou .csv).', 'error'); return; }

    try { await loadSheetJS(); } catch (e) { showToast(e.message, 'error'); return; }

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb   = XLSX.read(e.target.result, { type: 'array' });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        const first = rows[0] || [];
        const hasHeader = first.some(c => /material|nome|item|descri/i.test(String(c)));
        const dataRows  = hasHeader ? rows.slice(1) : rows;

        const items = [];
        dataRows.forEach(row => {
          const name = String(row[0] || '').trim();
          const qty  = parseFloat(String(row[1] || '0').replace(',', '.')) || 0;
          const unit = String(row[2] || '').trim() || 'un';
          if (name && qty > 0) items.push({ name, qty, unit });
        });

        if (!items.length) { showToast('Nenhum item v\u00e1lido encontrado na planilha.', 'error'); return; }

        saveBudgetForOS(osId, items);
        const osObj = getOSById(osId);
        showToast(`${items.length} itens importados para "${osObj?.osNumber||osId}"! \u2705`);
        fileInput.value = '';
        renderBudgetPreview(osId);
      } catch (err) {
        showToast('Erro ao ler planilha: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// \u2500\u2500 RECONHECIMENTO DE VOZ \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function getSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showToast('Seu navegador n\u00e3o suporta reconhecimento de voz. Use Chrome ou Edge.', 'error');
    return null;
  }
  const rec = new SR();
  rec.lang = 'pt-BR';
  rec.interimResults = true;
  rec.continuous = true;
  return rec;
}

// Mic inline no campo "Necessidade"
function bindMicNecessidade() {
  const btn = document.getElementById('btn-mic-necessity');
  const textarea = document.getElementById('req-necessity');
  if (!btn || !textarea) return;

  const rec = getSpeechRecognition();
  if (!rec) return;

  let running = false;
  let finalText = textarea.value;

  btn.classList.add('recording');
  btn.textContent = '\u23f9 Parar';
  running = true;

  rec.onresult = e => {
    let interim = '';
    let newFinal = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) newFinal += t + ' ';
      else interim += t;
    }
    if (newFinal) finalText += newFinal;
    textarea.value = finalText + interim;
  };

  rec.onerror = e => {
    const msgs = { 'not-allowed': 'Permiss\u00e3o de microfone negada.', 'no-speech': 'Nenhuma fala detectada.' };
    showToast(msgs[e.error] || 'Erro no microfone: ' + e.error, 'error');
    stopMic();
  };

  rec.onend = () => { if (running) rec.start(); }; // reinicia automaticamente

  const stopMic = () => {
    running = false;
    rec.onend = null;
    try { rec.stop(); } catch(_) {}
    btn.classList.remove('recording');
    btn.innerHTML = '\ud83c\udf99\ufe0f Ditar';
    textarea.value = finalText.trim();
    btn.removeEventListener('click', stopMic);
    btn.addEventListener('click', bindMicNecessidade, { once: true });
  };

  rec.start();
  btn.removeEventListener('click', bindMicNecessidade);
  btn.addEventListener('click', stopMic, { once: true });
}

// Modal de ditado para lista de itens
function bindAudioImport() {
  const rec = getSpeechRecognition();
  if (!rec) return;

  const ov = document.getElementById('modal-overlay');
  ov.innerHTML = renderAudioModal();
  ov.classList.remove('hidden');

  let running = true;
  let finalTranscript = '';

  const close = () => {
    running = false;
    rec.onend = null;
    try { rec.stop(); } catch(_) {}
    ov.classList.add('hidden');
    ov.innerHTML = '';
  };

  document.getElementById('aud-close')?.addEventListener('click', close);
  document.getElementById('aud-btn-cancel')?.addEventListener('click', close);

  // Converte n\u00fameros por extenso falados para algarismos
  const numWords = {
    'um':1,'uma':1,'dois':2,'duas':2,'tr\u00eas':3,'quatro':4,'cinco':5,
    'seis':6,'sete':7,'oito':8,'nove':9,'dez':10,'onze':11,'doze':12,
    'treze':13,'quatorze':14,'quinze':15,'dezesseis':16,'dezessete':17,
    'dezoito':18,'dezenove':19,'vinte':20,'trinta':30,'quarenta':40,
    'cinquenta':50,'sessenta':60,'setenta':70,'oitenta':80,'noventa':90,
    'cem':100,'cento':100,'duzentos':200,'trezentos':300,'quatrocentos':400,
  };

  function normalizeNumbers(text) {
    return text.replace(/\b([a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00e2\u00ea\u00f4\u00e3\u00f5\u00e7\u00fc]+(?:\s+e\s+[a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00e2\u00ea\u00f4\u00e3\u00f5\u00e7\u00fc]+)?)\b/gi, match => {
      const parts = match.toLowerCase().replace(' e ', ' ').split(' ');
      const total = parts.reduce((sum, w) => {
        const n = numWords[w];
        return n ? sum + n : sum;
      }, 0);
      return total > 0 ? String(total) : match;
    });
  }

  rec.onresult = e => {
    let interim = '';
    let newFinal = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) newFinal += t + '\n';
      else interim += t;
    }
    if (newFinal) finalTranscript += normalizeNumbers(newFinal);
    const interimEl = document.getElementById('aud-interim');
    if (interimEl) interimEl.textContent = interim || 'Aguardando sua voz...';
  };

  rec.onerror = e => {
    if (e.error === 'no-speech') return;
    const msgs = { 'not-allowed': 'Permiss\u00e3o de microfone negada. Verifique as configura\u00e7\u00f5es do navegador.' };
    showToast(msgs[e.error] || 'Erro: ' + e.error, 'error');
    close();
  };

  rec.onend = () => { if (running) rec.start(); };

  const goToReview = () => {
    running = false;
    rec.onend = null;
    try { rec.stop(); } catch(_) {}

    const mats  = window._aspemMaterials || getActiveMaterials();
    const lines = finalTranscript.split('\n').map(l => l.trim()).filter(l => l.length >= 2);
    const parsed = lines.map(l => parseOCRLine(l, mats)).filter(Boolean);

    // Mostra transcri\u00e7\u00e3o bruta no details
    const rawEl = document.getElementById('aud-raw-transcript');
    if (rawEl) rawEl.textContent = lines.join('\n') || '(nada captado)';

    document.getElementById('aud-recording-state').classList.add('hidden');
    document.getElementById('aud-review-state').classList.remove('hidden');

    const wrap = document.getElementById('aud-review-wrap');
    if (parsed.length && wrap) {
      wrap.innerHTML = buildImportReviewTable(parsed, mats);
      bindImportReviewTable(mats);
      document.getElementById('aud-btn-import').classList.remove('hidden');
    } else if (wrap) {
      wrap.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:20px 0">
        Nenhum item detectado. Grave novamente falando claramente quantidade e nome do material.<br>
        <em style="font-size:11px">Ex: "10 metros cabo dois e meio azul"</em>
      </div>`;
    }
  };

  document.getElementById('aud-btn-stop')?.addEventListener('click', goToReview);

  document.getElementById('aud-btn-restart')?.addEventListener('click', () => {
    finalTranscript = '';
    const wrap = document.getElementById('aud-review-wrap');
    if (wrap) wrap.innerHTML = '';
    document.getElementById('aud-recording-state').classList.remove('hidden');
    document.getElementById('aud-review-state').classList.add('hidden');
    document.getElementById('aud-btn-import').classList.add('hidden');
    running = true;
    rec.onend = () => { if (running) rec.start(); };
    rec.start();
  });

  document.getElementById('aud-btn-import')?.addEventListener('click', () => {
    const mats   = window._aspemMaterials || getActiveMaterials();
    const parsed = getReviewTableItems(mats);
    if (!parsed.length) { showToast('Adicione pelo menos um item.', 'error'); return; }

    const container = document.getElementById('items-container');
    const existingCards = container?.querySelectorAll('.item-card');
    if (existingCards?.length === 1 && !existingCards[0].querySelector('.item-qty')?.value) {
      existingCards[0].remove(); state.itemCount = 0;
    }

    importScannedItems(parsed);
    close();
    showToast(`${parsed.length} item(s) importado(s) por voz! \u2705`);
  });

  rec.start();
}

// \u2500\u2500 CAMERA / OCR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function loadTesseract() {
  return new Promise((resolve, reject) => {
    if (typeof Tesseract !== 'undefined') { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Falha ao carregar Tesseract.js. Verifique sua conex\u00E3o.'));
    document.head.appendChild(s);
  });
}

// \u2500\u2500 FUZZY MATCHING \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function _normStr(s) {
  return s.toLowerCase()
    .replace(/\u00B2/g,'2').replace(/\u00B3/g,'3')
    .replace(/,/g,'.').replace(/[.\-\/]/g,' ')
    .replace(/\s+/g,' ').trim();
}

function fuzzyScore(query, target) {
  const q = _normStr(query);
  const t = _normStr(target);
  const qWords = q.split(' ').filter(w => w.length >= 2);
  if (!qWords.length) return 0;
  let hits = 0;
  qWords.forEach(w => { if (t.includes(w)) hits++; });
  return hits / qWords.length;
}

function findBestMaterialMatch(desc, materials) {
  if (!desc || desc.length < 3) return null;
  let best = null, bestScore = 0;
  for (const m of materials) {
    const score = fuzzyScore(desc, m.name);
    if (score > bestScore && score >= 0.45) { best = m; bestScore = score; }
  }
  return best;
}

function parseOCRLine(line, materials) {
  line = line.trim();
  if (!line || line.length < 2) return null;

  // Extrai quantidade no in\u00EDcio da linha
  const qtyMatch = line.match(/^(\d+(?:[,.]\d+)?)\s*/);
  const qty = qtyMatch ? Math.max(1, Math.round(parseFloat(qtyMatch[1].replace(',','.')))) : 1;
  let rest = (qtyMatch ? line.slice(qtyMatch[0].length) : line).trim();

  // Detecta unidade logo ap\u00F3s a quantidade
  const unitPatterns = [
    [/^metros?\b/i,'m'],[/^m\b(?!m)/i,'m'],
    [/^unidades?\b/i,'un'],[/^un\b/i,'un'],
    [/^barras?\b/i,'br'],[/^br\b/i,'br'],
    [/^rolos?\b/i,'rolo'],[/^rolo\b/i,'rolo'],
    [/^caixas?\b/i,'cx'],[/^cx\b/i,'cx'],
    [/^kg\b/i,'kg'],[/^pares?\b/i,'par'],[/^par\b/i,'par'],
    [/^pct\b/i,'pct'],[/^conj\b/i,'conj'],
  ];
  let unit = 'un';
  for (const [pat, u] of unitPatterns) {
    if (pat.test(rest)) { unit = u; rest = rest.replace(pat,'').trim(); break; }
  }

  const mats = materials || window._aspemMaterials || [];
  const matched = findBestMaterialMatch(rest, mats);

  return {
    qty,
    unit: matched ? matched.defaultUnit : unit,
    desc: rest,
    matId: matched ? matched.id : null,
    category: matched ? matched.category : null,
    matchedName: matched ? matched.name : null,
  };
}

// ── TABELA DE REVISÃO DE IMPORTAÇÃO ──────────────────────────

function _reviewRow(item, idx) {
  const unitsHtml = (typeof UNITS !== 'undefined' ? UNITS : ['un','m','m²','br','kg','cx','rolo','par','conj','pct','gl'])
    .map(u => `<option ${u === item.unit ? 'selected' : ''}>${u}</option>`).join('');
  const matchLabel = item.matId
    ? `<div style="font-size:10px;color:var(--success);margin-top:2px">✓ Encontrado no catálogo</div>`
    : `<div style="font-size:10px;color:#F59E0B;margin-top:2px">⚠ Não encontrado — será adicionado como obs.</div>`;
  return `
  <tr class="review-row" style="${idx > 0 ? 'border-top:1px solid #F1F5F9' : ''}">
    <td style="padding:5px 8px">
      <input class="input review-name" list="mat-catalog-list"
        value="${(item.matchedName || item.desc || '').replace(/"/g, '&quot;')}"
        placeholder="Digite ou escolha do catálogo..." style="width:100%;min-width:160px;font-size:12px" />
      ${matchLabel}
    </td>
    <td style="padding:5px 8px">
      <input type="number" class="input review-qty" value="${item.qty || 1}" min="1"
        style="width:56px;padding:4px 6px;text-align:center;font-weight:700;font-size:13px" />
    </td>
    <td style="padding:5px 8px">
      <select class="select review-unit" style="padding:4px 6px;width:68px;font-size:12px">
        ${unitsHtml}
      </select>
    </td>
    <td style="padding:4px">
      <button class="btn btn-danger btn-sm review-remove-row" style="padding:2px 7px;font-size:14px" title="Remover">×</button>
    </td>
  </tr>`;
}

function buildImportReviewTable(parsedItems, materials) {
  const matched = parsedItems.filter(p => p.matId).length;
  const catalogOptions = materials.map(m => `<option value="${m.name.replace(/"/g,'&quot;')}"></option>`).join('');
  return `
  <datalist id="mat-catalog-list">${catalogOptions}</datalist>
  <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;display:flex;justify-content:space-between">
    <span><strong>${parsedItems.length}</strong> item(s) detectado(s)</span>
    <span style="color:var(--success)">${matched} no catálogo</span>
  </div>
  <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#F8FAFC;font-size:11px;color:var(--text-muted)">
          <th style="text-align:left;padding:6px 8px;border-bottom:1px solid var(--border)">Material</th>
          <th style="width:65px;padding:6px 8px;border-bottom:1px solid var(--border)">Qtd</th>
          <th style="width:75px;padding:6px 8px;border-bottom:1px solid var(--border)">Un.</th>
          <th style="width:30px;border-bottom:1px solid var(--border)"></th>
        </tr>
      </thead>
      <tbody id="review-tbody">
        ${parsedItems.map((item, i) => _reviewRow(item, i)).join('')}
      </tbody>
    </table>
  </div>
  <button class="btn btn-secondary btn-sm" id="review-add-row" style="margin-top:10px;font-size:12px">+ Adicionar item manualmente</button>`;
}

function bindImportReviewTable(materials) {
  const tbody = document.getElementById('review-tbody');
  if (!tbody) return;

  const unitsArr = typeof UNITS !== 'undefined' ? UNITS : ['un','m','m²','br','kg','cx','rolo','par','conj','pct','gl'];

  const rebind = () => {
    tbody.querySelectorAll('.review-name').forEach(inp => {
      inp.oninput = () => {
        const val = inp.value.trim();
        const mat = materials.find(m => m.name.toLowerCase() === val.toLowerCase());
        const hint = inp.nextElementSibling;
        const row  = inp.closest('.review-row');
        const unitSel = row?.querySelector('.review-unit');
        if (mat) {
          if (hint) { hint.style.color = 'var(--success)'; hint.textContent = '✓ Encontrado no catálogo'; }
          if (unitSel) unitSel.value = mat.defaultUnit;
        } else {
          if (hint) { hint.style.color = '#F59E0B'; hint.textContent = '⚠ Não encontrado — será adicionado como obs.'; }
        }
      };
    });
    tbody.querySelectorAll('.review-remove-row').forEach(btn => {
      btn.onclick = () => btn.closest('.review-row').remove();
    });
  };

  rebind();

  document.getElementById('review-add-row')?.addEventListener('click', () => {
    const unitsHtml = unitsArr.map(u => `<option>${u}</option>`).join('');
    const tr = document.createElement('tr');
    tr.className = 'review-row';
    tr.style.borderTop = '1px solid #F1F5F9';
    tr.innerHTML = `
      <td style="padding:5px 8px">
        <input class="input review-name" list="mat-catalog-list"
          placeholder="Digite ou escolha do catálogo..." style="width:100%;min-width:160px;font-size:12px" />
        <div style="font-size:10px;color:#F59E0B;margin-top:2px">⚠ Não encontrado — será adicionado como obs.</div>
      </td>
      <td style="padding:5px 8px">
        <input type="number" class="input review-qty" value="1" min="1"
          style="width:56px;padding:4px 6px;text-align:center;font-weight:700;font-size:13px" />
      </td>
      <td style="padding:5px 8px">
        <select class="select review-unit" style="padding:4px 6px;width:68px;font-size:12px">${unitsHtml}</select>
      </td>
      <td style="padding:4px">
        <button class="btn btn-danger btn-sm review-remove-row" style="padding:2px 7px;font-size:14px" title="Remover">×</button>
      </td>`;
    tbody.appendChild(tr);
    rebind();
    tr.querySelector('.review-name')?.focus();
  });
}

function getReviewTableItems(materials) {
  const items = [];
  document.querySelectorAll('#review-tbody .review-row').forEach(row => {
    const name = row.querySelector('.review-name')?.value.trim();
    const qty  = parseInt(row.querySelector('.review-qty')?.value) || 1;
    const unit = row.querySelector('.review-unit')?.value || 'un';
    if (!name) return;
    const mat = materials.find(m => m.name.toLowerCase() === name.toLowerCase());
    items.push({ qty, unit, desc: name, matId: mat?.id || null, category: mat?.category || null, matchedName: mat?.name || null });
  });
  return items;
}

function importScannedItems(parsedItems) {
  const container = document.getElementById('items-container');
  if (!container) return;

  const categories = window._aspemCategories || getMaterialCategories();
  const materials  = window._aspemMaterials  || getActiveMaterials();

  parsedItems.forEach(item => {
    if (!item) return;
    const idx = state.itemCount++;
    const cat = item.category || categories[0];
    const matId = item.matId || (materials.find(m => m.category === cat)?.id);
    const prefilledItem = { qty: item.qty, unit: item.unit, obs: item.desc, category: cat, matId };
    const div = document.createElement('div');
    div.innerHTML = renderItemRow(idx, categories, materials, prefilledItem);
    container.appendChild(div.firstElementChild);
  });

  if (window._aspemRebindItems) window._aspemRebindItems();
}

function bindCameraImport() {
  const ov = document.getElementById('modal-overlay');
  ov.innerHTML = renderCameraModal();
  ov.classList.remove('hidden');

  const close = () => { ov.classList.add('hidden'); ov.innerHTML = ''; };
  document.getElementById('cam-close')?.addEventListener('click', close);
  document.getElementById('cam-btn-cancel')?.addEventListener('click', close);

  const fileInput   = document.getElementById('cam-file-input');
  const previewImg  = document.getElementById('cam-preview-img');
  const previewWrap = document.getElementById('cam-preview-wrap');
  const dropArea    = document.getElementById('cam-drop-area');
  let capturedFile  = null;

  // Sele\u00E7\u00E3o / c\u00E2mera
  fileInput?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    capturedFile = file;
    previewImg.src = URL.createObjectURL(file);
    previewWrap.classList.remove('hidden');
    dropArea.style.display = 'none';
  });

  document.getElementById('cam-btn-retake')?.addEventListener('click', () => {
    capturedFile = null;
    previewWrap.classList.add('hidden');
    dropArea.style.display = '';
    fileInput.value = '';
  });

  // An\u00E1lise OCR
  document.getElementById('cam-btn-analyze')?.addEventListener('click', async () => {
    if (!capturedFile) { showToast('Selecione uma foto primeiro.','error'); return; }

    document.getElementById('cam-step-1').classList.add('hidden');
    const loadingEl = document.getElementById('cam-step-loading');
    loadingEl.classList.remove('hidden');

    try {
      await loadTesseract();

      const { data: { text } } = await Tesseract.recognize(capturedFile, 'por', {
        logger: m => {
          const bar  = document.getElementById('cam-progress-bar');
          const info = document.getElementById('cam-progress-text');
          if (!bar || !info) return;
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            bar.style.width = pct + '%';
            info.textContent = `Analisando texto... ${pct}%`;
          } else {
            info.textContent = m.status === 'loading tesseract core' ? 'Carregando motor OCR...'
                             : m.status === 'loading language traineddata' ? 'Carregando dicion\u00E1rio portugu\u00EAs...'
                             : m.status;
          }
        }
      });

      loadingEl.classList.add('hidden');

      // Limpa o texto: remove linhas muito curtas e ru\u00EDdo
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length >= 3 && /\w/.test(l));

      const mats   = window._aspemMaterials || getActiveMaterials();
      const parsed = lines.map(l => parseOCRLine(l, mats)).filter(Boolean);

      if (!parsed.length) {
        showToast('N\u00E3o foi poss\u00EDvel detectar itens na imagem. Tente com melhor ilumina\u00E7\u00E3o ou letra mais leg\u00EDvel.', 'error');
        close(); return;
      }

      const wrap = document.getElementById('cam-review-wrap');
      if (wrap) { wrap.innerHTML = buildImportReviewTable(parsed, mats); bindImportReviewTable(mats); }
      document.getElementById('cam-step-2').classList.remove('hidden');
      document.getElementById('cam-btn-import').classList.remove('hidden');

    } catch (err) {
      showToast(err.message || 'Erro ao analisar imagem.', 'error');
      close();
    }
  });

  // Importar da tabela de revis\u00E3o
  document.getElementById('cam-btn-import')?.addEventListener('click', () => {
    const mats   = window._aspemMaterials || getActiveMaterials();
    const parsed = getReviewTableItems(mats);
    if (!parsed.length) { showToast('Adicione pelo menos um item.', 'error'); return; }

    const container = document.getElementById('items-container');
    const existingCards = container?.querySelectorAll('.item-card');
    if (existingCards?.length === 1 && !existingCards[0].querySelector('.item-qty')?.value) {
      existingCards[0].remove(); state.itemCount = 0;
    }

    importScannedItems(parsed);
    close();
    showToast(`${parsed.length} item(s) importado(s) da foto! \u2705`);
  });
}
