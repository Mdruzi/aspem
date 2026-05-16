
// views.js - Renderização das telas (parte 1)

function renderLogin(errorMsg) {
  return `
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-header" style="flex-direction:column; gap:8px">
        <div class="login-logo-wrap"><img src="logo.png" alt="ASPEM ENGENHARIA" style="height:60px; object-fit:contain; border-radius:4px" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'150\\\' height=\\\'50\\\'><rect width=\\\'100%\\\' height=\\\'100%\\\' fill=\\\'#8D3921\\\'/><text x=\\\'50%\\\' y=\\\'50%\\\' fill=\\\'white\\\' font-family=\\\'sans-serif\\\' font-size=\\\'16\\\' text-anchor=\\\'middle\\\' dominant-baseline=\\\'middle\\\'>ASPEM</text></svg>'" /></div>
        <div class="login-subtitle">Sistema de Requisição de Materiais</div>
      </div>
      <form id="login-form" class="login-form">
        <div>
          <label class="field-label">Usuário</label>
          <input id="login-user" class="input" placeholder="seu.usuario" autocomplete="username" required />
        </div>
        <div>
          <label class="field-label">Senha</label>
          <input id="login-pass" class="input" type="password" placeholder="••••••" autocomplete="current-password" required />
        </div>
        ${errorMsg ? `<div class="login-error">⚠ ${errorMsg}</div>` : ''}
        <button type="submit" class="btn btn-primary full-width">Entrar</button>
      </form>
    </div>
  </div>`;
}

function renderSidebar(user, alertCount) {
  const permissions = getPermissions();
  const role = user.role;
  return `
  <aside class="sidebar">
    <div class="sidebar-logo" style="justify-content:center; padding:24px 18px 20px">
      <img src="logo.png" alt="ASPEM ENGENHARIA" style="height:45px; object-fit:contain; border-radius:4px" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'150\\\' height=\\\'45\\\'><rect width=\\\'100%\\\' height=\\\'100%\\\' fill=\\\'#8D3921\\\'/><text x=\\\'50%\\\' y=\\\'50%\\\' fill=\\\'white\\\' font-family=\\\'sans-serif\\\' font-size=\\\'14\\\' font-weight=\\\'bold\\\' text-anchor=\\\'middle\\\' dominant-baseline=\\\'middle\\\'>ASPEM</text></svg>'" />
    </div>
    <div class="sidebar-user">
      <div class="avatar">${user.avatar}</div>
      <div>
        <div class="sidebar-user-name">${user.name}</div>
        <div class="sidebar-user-role">${ROLES[user.role]}</div>
        ${user.clienteId ? (()=>{ const c=getClientes().find(x=>x.id===user.clienteId); return c?`<div class="sidebar-user-obra">${c.name}</div>`:''; })() : ''}
      </div>
    </div>
    <nav class="sidebar-nav">
        ${hasPermission(role, 'list') ? `<div class="nav-item ${state.view==='list'?'active':''}" id="nav-list" tabindex="0" role="button" aria-label="Requisições">📋 Requisições</div>` : ''}
        ${hasPermission(role, 'dashboard') ? `<div class="nav-item ${state.view==='dashboard'?'active':''}" id="nav-dashboard" tabindex="0" role="button" aria-label="Dashboard">📊 Dashboard</div>` : ''}
        ${hasPermission(role, 'materials') ? `<div class="nav-item ${state.view==='materials'?'active':''}" id="nav-materials" tabindex="0" role="button" aria-label="Materiais">📦 Materiais</div>` : ''}
        ${['admin','coordenador','gestao'].includes(role) ? `<div class="nav-item ${state.view==='obras-panel'?'active':''}" id="nav-obras" tabindex="0" role="button" aria-label="Clientes e OS">🏢 Clientes / OS</div>` : ''}
        ${hasPermission(role, 'admin-panel') ? `<div class="nav-item ${state.view==='admin-panel'?'active':''}" id="nav-admin" tabindex="0" role="button" aria-label="Configurações">⚙️ Configurações</div>` : ''}

      ${role === 'compras' && alertCount > 0 ? `
      <div class="nav-item" id="nav-alerts" style="color:#F59E0B" tabindex="0" role="button">
        🔔 Alertas <span class="nav-badge">${alertCount}</span>
      </div>` : ''}
    </nav>
    <div class="sidebar-footer">
      <button class="btn-logout" id="btn-logout">↩ Sair do sistema</button>
    </div>
  </aside>`;
}

function renderTopBar(user, reqs) {
  const stats = {
    obra:        { label:'Minhas Req.',          value: reqs.filter(r=>r.userId===user.id).length },
    coordenador: { label:'Aguardando Aprovação', value: reqs.filter(r=>r.status==='pendente').length },
    compras:     { label:'Sem data de entrega',  value: reqs.filter(r=>['aprovado','cotacao'].includes(r.status)&&!r.estimatedDelivery).length },
    gestao:      { label:'Total de Requisições', value: reqs.length },
    admin:       { label:'Usuários no Sistema',  value: getUsers().length },
  }[user.role] || { label: 'Acesso', value: '' };
  
  const titles = {
    obra:'Requisição de Materiais', coordenador:'Aprovação de Requisições',
    compras:'Gestão de Compras', gestao:'Dashboard Gerencial', admin:'Administração',
  };
  const role = user.role;
  return `
  <div class="topbar">
    <button id="mobile-menu-toggle" class="mobile-menu-btn" aria-label="Abrir menu de navegação">☰</button>
    <div style="flex:1; min-width:0">
      <div class="topbar-title">${titles[user.role] || 'ASPEM'}</div>
      <div class="topbar-subtitle">${new Date().toLocaleDateString('pt-BR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div class="topbar-stat hide-mobile">
      <div class="topbar-stat-value">${stats.value}</div>
      <div class="topbar-stat-label">${stats.label}</div>
    </div>
  </div>`;
}

function renderAlertBanner(count) {
  if (!count) return '';
  return `
  <div class="alert-banner" id="alert-banner">
    <span style="font-size:22px;flex-shrink:0">🔔</span>
    <div><strong>Atenção!</strong> ${count} requisição${count>1?'ões':''} aprovada${count>1?'s':''} sem data de entrega cadastrada. Atualize o sistema.</div>
    <button class="alert-banner-close" id="alert-close">×</button>
  </div>`;
}

function renderStatusBadge(status) {
  const s = STATUS[status];
  return `<span class="badge" style="color:${s.color};background:${s.bg};border-color:${s.color}20">${s.icon} ${s.label}</span>`;
}

function renderReqCard(req) {
  const isLate = req.deadline && req.status!=='entregue' && req.status!=='rejeitado' && new Date(req.deadline)<new Date();
  const user = getUserById(req.userId);
  return `
    <div class="req-card" data-req-id="${req.id}">
      <div class="req-card-header">
        <div class="flex gap-8 flex-center" style="flex-wrap:wrap">
          <span class="req-id font-mono">${req.id}</span>
          ${renderStatusBadge(req.status)}
          ${isLate ? `<span class="badge badge-late">⚠ Prazo Vencido</span>` : ''}
          ${req.osNumber ? `<span class="req-os">OS: ${req.osNumber}</span>` : ''}
        </div>
        <span class="text-muted" style="font-size:12px">${fmtDate(req.createdAt)}</span>
      </div>
      <div class="req-obra">🏢 ${req.clienteName || '—'}${req.osNumber ? ` · ${req.osNumber}` : ''}</div>
      <div class="req-necessity">${req.necessity}</div>
      <div class="req-footer">
        <div class="req-meta">
          <span>👤 Solicitante: ${user.name}</span>
          ${req.approvedByName ? `<span>✅ Aprovador: ${req.approvedByName}</span>` : ''}
          ${req.deliveredByName ? `<span>🎯 Recebedor: ${req.deliveredByName}</span>` : ''}
          <span>📅 Prazo: ${fmtDate(req.deadline)}</span>
          <span>📦 ${req.items.length === 1 ? '1 item' : req.items.length + ' itens'}</span>
          ${req.comments.length>0?`<span>💬 ${req.comments.length}</span>`:''}
        </div>
        ${req.estimatedDelivery?`<span class="text-success fw-bold" style="font-size:12px">🚚 Entrega: ${fmtDate(req.estimatedDelivery)}</span>`:''}
      </div>
    </div>`;
}

function renderReqList(reqs, user) {
  const allReqs = getRequisitions();
  const statusCounts = Object.keys(STATUS).reduce((a,k)=>({...a,[k]:allReqs.filter(r=>r.status===k).length}),{});
  const obras = [...new Set(allReqs.map(r=>r.clienteName).filter(Boolean))].sort();
  return `
  <div id="req-list-view">
    <div class="toolbar">
      ${user.role==='obra'?`<button class="btn btn-primary" id="btn-new-req">+ Nova Requisição</button>`:''}
      <div class="search-input">
        <input id="search-input" class="input" placeholder="Buscar por ID, obra, necessidade..." />
      </div>
      ${user.role!=='obra'?`
      <select id="obra-filter" class="select" style="width:auto">
        <option value="">🏢 Todos os clientes</option>
        ${obras.map(o=>`<option>${o}</option>`).join('')}
      </select>`:''}
      <button class="btn btn-secondary btn-sm" id="btn-export">📊 Exportar</button>
    </div>
    <div class="pill-group" id="status-pills">
      <button class="pill active" data-status="">Todos <span class="pill-count">${allReqs.length}</span></button>
      ${Object.entries(STATUS).map(([k,v])=>statusCounts[k]?`
        <button class="pill" data-status="${k}" style="--pill-color:${v.color}">${v.icon} ${v.label} <span class="pill-count">${statusCounts[k]}</span></button>
      `:'').join('')}
    </div>
    ${user.role!=='obra'?`<div class="obra-tags" id="obra-tags">
      ${obras.map(o=>`<button class="obra-tag" data-obra="${o}">🏗 ${o}</button>`).join('')}
    </div>`:''}
    <div id="req-cards" style="display:flex;flex-direction:column;gap:10px">
      ${reqs.length===0
        ?`<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">Nenhuma requisição encontrada</div><div class="empty-state-desc">Ajuste os filtros ou crie uma nova requisição</div></div>`
        :reqs.map(r=>renderReqCard(r)).join('')}
    </div>
  </div>`;
}

function renderAdminPanel() {
  const permissions = getPermissions();
  const roles = Object.keys(ROLES).filter(r => r !== 'admin');
  const views = [
    { id: 'list', label: 'Lista de Requisições' },
    { id: 'new-req', label: 'Criar Novas Requisições' },
    { id: 'dashboard', label: 'Dashboard / Gráficos' },
    { id: 'materials', label: 'Catálogo de Materiais' }
  ];
  
  const users = getUsers();

  return `
  <div id="admin-panel-view">
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">👥 Gerenciamento de Usuários</div>
        <button class="btn btn-primary btn-sm" id="btn-open-add-user">+ Novo Usuário</button>
      </div>
      <div class="card-body">
        <div class="table-wrap">
          <table style="width:100%">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>Obra</th>
                <th style="text-align:right">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td><div class="avatar" style="width:30px;height:30px;font-size:11px">${u.avatar}</div></td>
                  <td class="fw-bold">${u.name}</td>
                  <td>${u.username}</td>
                  <td>${ROLES[u.role] || u.role}</td>
                  <td>${u.clienteId ? (getClientes().find(c=>c.id===u.clienteId)?.name||'—') : '—'}</td>
                  <td style="text-align:right">
                    <button class="btn btn-secondary btn-sm user-edit" data-uid="${u.id}" aria-label="Editar ${u.name}" title="Editar usuário">✏️</button>
                    ${u.role !== 'admin' ? `<button class="btn btn-danger btn-sm user-delete" data-uid="${u.id}" aria-label="Excluir ${u.name}" title="Excluir usuário">🗑</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">⚙️ Gerenciamento de Áreas de Acesso</div></div>
      <div class="card-body">
        <p style="margin-bottom:20px; color:var(--text-muted); font-size:13px">Define quais telas cada perfil de usuário pode visualizar no menu lateral.</p>
        
        <div class="table-wrap">
          <table style="width:100%">
            <thead>
              <tr>
                <th>Perfil / Role</th>
                ${views.map(v => `<th style="text-align:center">${v.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${roles.map(r => `
                <tr>
                  <td class="fw-bold">${ROLES[r]}</td>
                  ${views.map(v => `
                    <td style="text-align:center">
                      <input type="checkbox" class="perm-check" data-role="${r}" data-view="${v.id}" ${permissions[r].includes(v.id)?'checked':''} style="width:18px; height:18px; cursor:pointer" />
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-top:24px; padding-top:20px; border-top:1px solid var(--border)">
          <button class="btn btn-primary" id="btn-save-perms">💾 Salvar Permissões</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderAddUserModal(user = null) {
  const isEdit = !!user;
  return `
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">${isEdit ? '✏️ Editar Usuário' : '+ Novo Usuário'}</div>
      <button class="modal-close" id="modal-close-user">×</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="user-id" value="${user ? user.id : ''}" />
      <div class="form-row" style="margin-bottom:12px">
        <div>
          <label class="field-label">Nome Completo *</label>
          <input id="user-name" class="input" placeholder="Ex: João da Silva" value="${user ? user.name : ''}" />
        </div>
      </div>
      <div class="form-row form-row-2" style="margin-bottom:12px">
        <div>
          <label class="field-label">Login (Usuário) *</label>
          <input id="user-username" class="input" placeholder="Ex: joao.silva" value="${user ? user.username : ''}" />
        </div>
        <div>
          <label class="field-label">Senha *</label>
          <input id="user-password" class="input" type="password" placeholder="••••••" value="${user ? user.password : ''}" />
        </div>
      </div>
      <div class="form-row" style="margin-bottom:12px">
        <div>
          <label class="field-label">Perfil de Acesso *</label>
          <select id="user-role" class="select">
            ${Object.entries(ROLES).map(([k, v]) => `<option value="${k}" ${user && user.role === k ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Bloco Cliente / Obra — destacado quando perfil = obra -->
      <div id="user-obra-section" style="margin-bottom:12px;padding:14px 16px;border-radius:8px;border:2px solid ${(user?.role==='obra')?'var(--primary)':'var(--border)'};background:${(user?.role==='obra')?'rgba(27,79,216,0.04)':'var(--surface)'}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px">
          <label class="field-label" style="margin-bottom:0;font-size:13px">
            🏗️ Cliente / Obra vinculada
            <span id="user-obra-required" style="color:var(--danger);display:${(user?.role==='obra')?'inline':'none'}"> *</span>
          </label>
          <span id="user-obra-badge" style="font-size:11px;padding:2px 8px;border-radius:20px;background:var(--primary);color:#fff;font-weight:600;display:${(user?.role==='obra')?'inline':'none'}">
            Recomendado para encarregados
          </span>
        </div>

        ${renderSS('user-obra', 'Buscar ou selecionar cliente...', [
          { value: '', text: '— Nenhum —' },
          ...getClientes().map(c => ({ value: String(c.id), text: c.name })),
          { value: '__novo__', text: '➕ Cadastrar novo cliente agora' }
        ], user && user.clienteId ? String(user.clienteId) : '')}

        <!-- Mini-formulário inline para novo cliente -->
        <div id="user-obra-new-form" style="display:none;margin-top:10px;padding:10px 12px;background:#F1F5F9;border:1px dashed var(--primary);border-radius:6px">
          <div style="font-size:11px;font-weight:700;color:var(--primary);margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">➕ Novo Cliente</div>
          <div style="display:flex;gap:8px;align-items:center">
            <input id="user-obra-new-name" class="input" placeholder="Nome do cliente / obra..." style="flex:1;font-size:13px" />
            <button type="button" class="btn btn-primary btn-sm" id="btn-user-obra-confirm" style="white-space:nowrap">Criar e vincular</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-user-obra-cancel">×</button>
          </div>
        </div>

        <div id="user-obra-info" style="margin-top:6px;font-size:12px;color:var(--text-muted);min-height:16px">
          ${(()=>{
            if (!user?.clienteId) return '';
            const oses = getOSes().filter(o => o.clienteId === user.clienteId);
            return oses.length
              ? `📋 ${oses.length} OS${oses.length!==1?'s':''} cadastrada${oses.length!==1?'s':''}: ${oses.map(o=>o.osNumber).join(', ')}`
              : '📋 Nenhuma OS cadastrada ainda para este cliente';
          })()}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-cancel-user">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-user">${isEdit ? 'Salvar Alterações' : 'Criar Usuário'}</button>
    </div>
  </div>`;
}
