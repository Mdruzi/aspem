
// views2.js - Renderização das telas (parte 2): Detalhe, Formulário, Compras, Dashboard, Materiais

function renderTimeline(req) {
  const steps = [
    {label:'Criado',   date:req.createdAt},
    {label:'Aprovado', date:req.approvedAt},
    {label:'Cotação',  date:req.quotedAt},
    {label:'Pedido',   date:req.orderedAt},
    {label:'Entregue', date:req.deliveredAt},
  ];
  return `
  <div class="timeline">
    ${steps.map((s,i)=>`
      <div class="tl-step">
        ${i<steps.length-1?`<div class="tl-line ${s.date&&steps[i+1].date?'done':''}"></div>`:''}
        <div class="tl-dot ${s.date?'done':''}"></div>
        <div class="tl-label">${s.label}</div>
        <div class="tl-date">${fmtDate(s.date)}</div>
      </div>`).join('')}
  </div>`;
}

function renderComments(req, user) {
  return `
  <div class="comment-list" id="comment-list">
    ${req.comments.length===0
      ?`<div class="empty-state" style="padding:16px"><div class="empty-state-desc">Nenhum comentário ainda.</div></div>`
      :req.comments.map(c=>{
        const u=getUserById(c.userId); const mine=c.userId===user.id;
        return `<div class="comment-item ${mine?'mine':''}">
          <div class="avatar" style="width:30px;height:30px;font-size:11px;flex-shrink:0;background:${mine?'#1B4FD8':'#F59E0B'};color:${mine?'#fff':'#0F172A'}">${u.avatar}</div>
          <div style="max-width:72%">
            <div class="comment-meta ${mine?'flex-between':''}">
              <span class="comment-author">${u.name}</span>
              <span class="comment-date">${fmtDate(c.createdAt)}</span>
            </div>
            <div class="comment-bubble">${c.text}</div>
          </div>
        </div>`;}).join('')}
  </div>
  <div class="comment-input-row">
    <div class="avatar" style="width:30px;height:30px;font-size:11px;flex-shrink:0">${user.avatar}</div>
    <textarea id="comment-text" class="textarea" style="min-height:52px;flex:1;resize:none" placeholder="Comentar... (Enter para enviar, Shift+Enter nova linha)"></textarea>
    <button class="btn btn-primary btn-sm" id="btn-send-comment" aria-label="Enviar comentário" title="Enviar comentário">➤</button>
  </div>
  <div class="field-hint" style="padding-left:38px">Enter para enviar · Shift+Enter nova linha</div>`;
}

function renderReqDetail(req, user) {
  const owner = getUserById(req.userId);
  const isLate = req.deadline && req.status!=='entregue' && req.status!=='rejeitado' && new Date(req.deadline)<new Date();
  return `
  <div id="req-detail-view">
    <div class="toolbar" style="margin-bottom:16px">
      <button class="btn btn-secondary btn-sm" id="btn-back">← Voltar</button>
      <button class="btn btn-secondary btn-sm" id="btn-print-pdf">🖨️ Exportar PDF</button>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="flex gap-8 flex-center" style="flex-wrap:wrap">
          <span class="fw-black font-mono" style="font-size:18px">${req.id}</span>
          ${renderStatusBadge(req.status)}
          ${isLate?`<span class="badge badge-late">⚠ Prazo Vencido</span>`:''}
          ${req.osNumber?`<span class="req-os" style="font-size:12px;padding:4px 10px">📋 ${req.osNumber}</span>`:''}
        </div>
        <div style="text-align:right;font-size:12px;color:var(--text-muted)">
          <div>Criado em ${fmtDate(req.createdAt)}</div>
          <div>Prazo: <strong style="color:var(--danger)">${fmtDate(req.deadline)}</strong></div>
        </div>
      </div>
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-muted)">
        🏢 <strong>${req.clienteName||'—'}</strong>
        ${req.osNumber ? `&nbsp;·&nbsp; 📋 <strong>${req.osNumber}</strong>` : ''}
        ${req.osDescription ? `<span style="color:var(--text-light)"> — ${req.osDescription}</span>` : ''}
        &nbsp;·&nbsp; 👤 <strong>${owner.name}</strong>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">📝 Necessidade do Material</div>
        <div class="necessity-box">${req.necessity}</div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">📦 Lista de Materiais</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Categoria</th><th>Material</th><th>Qtd</th><th>Un.</th><th>Cor</th><th>Bitola</th><th>Obs.</th></tr></thead>
            <tbody>
              ${req.items.map((it,i)=>`
                <tr style="${it.approved===false?'opacity:0.5;text-decoration:line-through':''}">
                  <td>${i+1}</td>
                  <td><span class="cat-badge">${it.category}</span></td>
                  <td>
                    ${it.name||it.description||''}
                    ${it.qtyChangeNote?`<div style="font-size:10px;color:var(--danger);margin-top:2px;font-style:italic;text-decoration:none !important">${it.qtyChangeNote}</div>`:''}
                  </td>
                  <td style="text-align:center;font-weight:700">
                    ${it.originalQty?`<span style="text-decoration:line-through;font-weight:400;color:var(--text-muted);font-size:11px">${it.originalQty}</span> `:''}
                    ${it.qty}
                  </td>
                  <td style="text-align:center">${it.unit}</td>
                  <td style="text-align:center">${it.color||'—'}</td>
                  <td style="text-align:center">${it.bitola||'—'}</td>
                  <td style="color:var(--text-muted)">${it.obs||'—'}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">📅 Histórico de Status</div>
        ${renderTimeline(req)}
      </div>

      ${req.status==='rejeitado'&&req.rejectNote?`
      <div class="detail-section">
        <div class="detail-section-title">❌ Motivo da Rejeição</div>
        <div style="background:#FEF2F2;border-left:4px solid var(--danger);padding:12px 16px;border-radius:0 8px 8px 0;font-size:13px;color:#7F1D1D">${req.rejectNote}</div>
      </div>`:''}

      ${['coordenador','gestao','admin'].includes(user.role)&&req.status==='pendente'?`
      <div class="detail-section">
        <div class="detail-section-title">⚙️ Aprovação de Itens</div>
        <div class="form-row form-row-2" style="margin-bottom:16px">
          <div>
            <label class="field-label">🏢 Cliente</label>
            <div class="fw-bold" style="padding:8px 0;font-size:13px">${req.clienteName||'—'}</div>
          </div>
          <div>
            <label class="field-label">
              📋 OS Vinculada&nbsp;<span style="color:var(--danger)">*</span>
              <span style="font-weight:400;font-size:11px;color:var(--text-muted)"> — obrigatório para aprovar</span>
            </label>
            ${renderSS('coord-os-sel', 'Selecionar / buscar OS...', [
              ...getOSes().filter(o => o.active && (!req.clienteId || o.clienteId === req.clienteId))
                .map(o => ({ value: String(o.id), text: `${o.osNumber} — ${o.description}` })),
              { value: '__nova__', text: '➕ Cadastrar Nova OS' }
            ], req.osId ? String(req.osId) : '')}
            <div id="coord-os-desc" style="font-size:11px;color:var(--text-muted);margin-top:4px;min-height:14px">
              ${req.osDescription ? `📝 ${req.osDescription}` : ''}
            </div>
          </div>
        </div>
        
        <div style="display:flex;justify-content:flex-end;margin-bottom:8px">
          <button class="btn btn-success btn-sm" id="btn-approve-all" title="Aprovar todos os itens com as quantidades solicitadas">
            ✅ Aceitar Todos
          </button>
        </div>
        <div class="table-wrap" style="margin-bottom:16px">
          <table style="background:#F8FAFC">
            <thead>
              <tr>
                <th>Item</th>
                <th>Material</th>
                <th style="width:120px">Qtd. Pedida</th>
                <th style="width:120px">Qtd. Aprovada</th>
                <th style="width:180px">Observação / Motivo</th>
                <th style="text-align:center; width:100px">Ação</th>
              </tr>
            </thead>
            <tbody>
              ${req.items.map((it, i) => {
                const budget = req.osId ? getBudgetForOS(req.osId) : [];
                const norm = s => s.toLowerCase().trim();
                const budgetItem = budget.find(b => norm(b.name) === norm(it.name || ''));
                const consumed   = budgetItem ? getConsumedQty(req.osId, it.name) : 0;
                const budgeted   = budgetItem ? (budgetItem.qty || 0) : 0;
                const pending    = it.qty || 0;
                const consumedPct = budgeted > 0 ? Math.min(100, Math.round(consumed / budgeted * 100)) : 0;
                const pendingPct  = budgeted > 0 ? Math.min(100 - consumedPct, Math.round(pending / budgeted * 100)) : 0;
                const totalPct    = consumedPct + pendingPct;
                const barHtml = budgetItem ? `
                  <div class="budget-bar-wrap" title="Orçado: ${budgeted} ${budgetItem.unit||it.unit}">
                    <div class="budget-bar-track">
                      <div class="budget-bar-consumed" style="width:${consumedPct}%"></div>
                      <div class="budget-bar-pending${totalPct>100?' budget-bar-over':''}" style="width:${pendingPct}%"></div>
                    </div>
                    <div class="budget-bar-label">${consumed} já usados + ${pending} este pedido / ${budgeted} orçados — <strong style="color:${totalPct>100?'var(--danger)':totalPct>80?'#F59E0B':'var(--success)'}">${totalPct}%</strong></div>
                  </div>` : '';
                return `
                <tr class="approval-item-row" data-idx="${i}" data-status="pending">
                  <td>${i+1}</td>
                  <td>
                    <div class="fw-bold">${it.name}</div>
                    <div style="font-size:10px;color:var(--text-muted)">${it.category} ${it.bitola?`· ${it.bitola}`:''} ${it.color?`· ${it.color}`:''}</div>
                    ${barHtml}
                  </td>
                  <td style="text-align:center">${it.qty} ${it.unit}</td>
                  <td>
                    <input type="number" class="input approve-qty" value="${it.qty}" min="0" style="padding:4px 8px; font-weight:700" />
                  </td>
                  <td>
                    <input type="text" class="input approve-obs" placeholder="Nota opcional..." style="padding:4px 8px; font-size:11px" />
                  </td>
                  <td>
                    <div style="display:flex; gap:4px; justify-content:center">
                      <button class="btn btn-sm btn-item-approve" style="background:#E2E8F0; color:#94A3B8; padding:4px 8px" title="Aprovar">✅</button>
                      <button class="btn btn-sm btn-item-reject" style="background:#E2E8F0; color:#94A3B8; padding:4px 8px" title="Rejeitar">❌</button>
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div id="approval-progress" class="approval-progress">
          <span>⏳</span>
          <span><strong id="eval-count">0</strong> de <strong>${req.items.length}</strong> itens avaliados</span>
        </div>
        <div id="reject-section" style="display:none;margin-bottom:12px">
          <label class="field-label">Motivo da Rejeição Total da Requisição</label>
          <textarea id="reject-note" class="textarea" style="min-height:80px" placeholder="Informe o motivo da rejeição total..."></textarea>
        </div>
        <div class="flex gap-10">
          <button class="btn btn-success" id="btn-approve">✅ Finalizar Aprovação</button>
          <button class="btn btn-danger" id="btn-reject-toggle">❌ Rejeitar Tudo</button>
          <button class="btn btn-danger hidden" id="btn-reject-confirm">Confirmar Rejeição Total</button>
          <button class="btn btn-secondary hidden" id="btn-reject-cancel">Cancelar</button>
        </div>
      </div>`:''}

      ${user.role==='compras'&&(req.status==='aprovado'||req.status==='cotacao')?`
      <div class="detail-section">
        <div class="detail-section-title">📦 Processamento de Compra</div>
        <div class="form-row form-row-2" style="margin-bottom:16px">
          <div>
            <label class="field-label">📅 Data de Disponibilidade do Material *</label>
            <input id="quote-delivery" class="input" type="date" value="${req.estimatedDelivery||''}" />
            <div class="field-hint">Informe quando o material estará disponível para a obra</div>
          </div>
          <div style="display:flex; align-items:flex-end">
            <button class="btn btn-secondary full-width" id="btn-export-detail">📗 Exportar para Excel</button>
          </div>
        </div>
        <div class="flex gap-10">
          <button class="btn btn-success" id="btn-save-quote">✅ Salvar e Notificar Disponibilidade</button>
          ${req.status==='cotacao'||req.status==='aprovado'?`<button class="btn btn-primary" id="btn-mark-ordered">📦 Marcar como Pedido Efetuado</button>`:''}
        </div>
      </div>`:''}

      ${user.role==='compras'&&req.status==='pedido'?`
      <div class="detail-section">
        <div class="detail-section-title">🚚 Confirmação de Entrega</div>
        <div class="flex gap-12 flex-center">
          <div style="font-size:13px;color:var(--text-muted)">Entrega estimada: <strong>${fmtDate(req.estimatedDelivery)}</strong></div>
          <button class="btn btn-success" id="btn-mark-delivered">✅ Confirmar Entrega</button>
        </div>
      </div>`:''}

      ${req.supplier?`
      <div class="detail-section">
        <div class="detail-section-title">💰 Dados da Compra</div>
        <div class="form-row form-row-2">
          <div><label class="field-label">Fornecedor</label><div class="fw-bold" style="font-size:14px">${req.supplier}</div></div>
          <div><label class="field-label">Entrega Estimada</label><div class="fw-bold" style="font-size:14px">${fmtDate(req.estimatedDelivery)}</div></div>
        </div>
      </div>`:''}

      <div class="detail-section" style="padding-bottom:24px">
        <div class="detail-section-title">💬 Comentários ${req.comments.length>0?`<span style="font-weight:400;color:var(--text-muted)">(${req.comments.length})</span>`:''}</div>
        ${renderComments(req, user)}
      </div>
    </div>
  </div>`;
}

function renderNewReqForm(user) {
  const materials = getActiveMaterials();
  const categories = getMaterialCategories();
  const clientes = getClientes().filter(c => c.active);
  const oses = getOSes().filter(o => o.active);
  // cliente padrão do usuário (encarregado)
  const defaultClienteId = user.clienteId || null;
  const defaultCliente = defaultClienteId ? clientes.find(c => c.id === defaultClienteId) : null;
  const clienteOses = defaultClienteId ? oses.filter(o => o.clienteId === defaultClienteId) : [];
  return `
  <div id="new-req-view">
    <div class="toolbar" style="margin-bottom:16px">
      <button class="btn btn-secondary btn-sm" id="btn-cancel-req">← Voltar</button>
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title" style="font-size:16px">📨 Nova Requisição de Materiais</div>
        </div>
      </div>
      <div class="card-body">
        <div class="form-row form-row-2" style="margin-bottom:14px">
          <div>
            <label class="field-label">🏢 Cliente *</label>
            ${renderSS('req-cliente-sel', 'Digite o nome do cliente ou obra...',
              clientes.map(c => ({ value: String(c.id), text: c.name })),
              ''
            )}
          </div>
          <div>
            <label class="field-label">📋 Ordem de Serviço</label>
            ${renderSS('req-os-sel', 'Buscar OS...',
              clienteOses.map(o => ({ value: String(o.id), text: `${o.osNumber} — ${o.description}` })),
              ''
            )}
            <div id="req-os-desc" style="font-size:11px;color:var(--text-muted);margin-top:3px;min-height:14px"></div>
          </div>
        </div>
        <div class="form-row" style="margin-bottom:14px">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
              <label class="field-label" style="margin-bottom:0">📝 Justificativa / Necessidade do Material</label>
              <button type="button" id="btn-mic-necessity" class="btn-mic" title="Ditar por voz (Chrome/Edge)">🎙️ Ditar</button>
            </div>
            <textarea id="req-necessity" class="textarea" style="min-height:100px" placeholder="Descreva para que será usado, onde será instalado, urgência... (opcional)"></textarea>
          </div>
        </div>
        <div class="form-row" style="margin-bottom:14px">
          <div>
            <label class="field-label">📅 Prazo Máximo para Entrega *</label>
            <input id="req-deadline" class="input" type="date" min="${todayStr()}" />
            <div class="field-hint">Informe o prazo máximo para chegada do material na obra</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <div style="font-weight:800;font-size:13px">📦 Lista de Materiais</div>
          <div style="display:flex;gap:6px">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-camera-import" title="Fotografar lista manuscrita ou impressa">📷 Foto</button>
            <button type="button" class="btn-mic" id="btn-audio-import" title="Ditar lista de materiais por voz">🎙️ Voz</button>
          </div>
        </div>
        <div id="items-container"></div>
        <button class="btn" id="btn-add-item" style="margin-top:16px;width:100%;padding:14px;border:2px dashed var(--primary);color:var(--primary);font-weight:700;display:flex;justify-content:center;align-items:center;background:rgba(27,79,216,0.05);cursor:pointer;border-radius:6px;transition:0.2s">➕ Adicionar Mais Itens</button>

        <div style="display:flex;gap:12px;margin-top:24px;padding-top:18px;border-top:1px solid var(--border)">
          <button class="btn btn-primary" id="btn-submit-req">📨 Enviar Requisição</button>
          <button class="btn btn-secondary" id="btn-cancel-req2">Cancelar</button>
        </div>
      </div>
    </div>
  </div>`;
}

const FIXED_CATEGORIES = ['SPDA', 'Infraestrutura', 'Luminárias', 'Acabamentos'];

// ── SEARCHABLE SELECT helper ──────────────────────────────────
// opts: [{ value, text }]  |  selectedValue: string
function renderSS(id, placeholder, opts, selectedValue = '') {
  const displayVal = selectedValue
    ? (opts.find(o => String(o.value) === String(selectedValue))?.text || '')
    : '';
  return `
  <div class="ss-wrap" id="${id}-wrap">
    <input type="text" class="input ss-input" placeholder="${placeholder}"
      autocomplete="off" value="${displayVal.replace(/"/g,'&quot;')}" />
    <input type="hidden" class="ss-hidden" id="${id}" value="${selectedValue}" />
    <div class="ss-dropdown">
      ${opts.map(o=>`<div class="ss-option" data-value="${String(o.value).replace(/"/g,'&quot;')}">${o.text}</div>`).join('')}
    </div>
  </div>`;
}

function renderItemRow(idx, categories, materials, item) {
  const isOtros = item && (item.category === '__outros__' || item.matId === '__outros__');
  const isCab   = item && item.category === 'Cabeamento';

  return `
  <div class="item-card" id="item-${idx}">
    <div class="item-card-header">
      <span class="item-number">${idx+1}</span>
      <button class="btn btn-danger btn-sm remove-item" data-idx="${idx}" aria-label="Remover item ${idx+1}" title="Remover item">×</button>
    </div>
    <div class="item-fields-grid">

      <!-- Campo único de busca por material -->
      <div class="item-mat-span">
        <label class="field-label">Material</label>
        <div class="item-mat-ss" id="item-mat-ss-${idx}" style="position:relative">
          <input type="text" class="input item-mat-text" data-idx="${idx}"
            placeholder="Digite para buscar no catálogo..." autocomplete="off"
            value="${isOtros ? '' : (item ? item.name||'' : '')}" />
          <input type="hidden" class="item-mat-id" data-idx="${idx}"
            value="${isOtros ? '__outros__' : (item && item.matId ? item.matId : '')}" />
          <input type="hidden" class="item-mat-cat" data-idx="${idx}"
            value="${isOtros ? '' : (item ? item.category||'' : '')}" />
          <div class="ss-dropdown item-mat-dropdown">
            <div style="padding:10px 12px;font-size:12px;color:var(--text-muted);font-style:italic">
              Digite ao menos 2 letras para buscar...
            </div>
          </div>
        </div>
        <!-- Campo "Outros": nome livre -->
        <div class="item-outros-wrap" style="display:${isOtros?'':'none'};margin-top:6px">
          <input class="input item-outros-name" data-idx="${idx}"
            placeholder="Nome do material..." value="${item&&item.outrosName?item.outrosName:item&&isOtros&&item.name?item.name:''}" />
          <div class="field-hint" style="margin-top:4px">Este item será salvo no catálogo para uso futuro.</div>
        </div>
      </div>

      <!-- Classificação para itens "Outros" -->
      <div class="item-outros-cat-wrap" style="display:${isOtros?'':'none'}">
        <label class="field-label">Categoria <span style="color:var(--danger)">*</span></label>
        <select class="select item-outros-cat" data-idx="${idx}">
          ${FIXED_CATEGORIES.map(c => `<option>${c}</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="field-label">Quantidade</label>
        <input class="input item-qty" data-idx="${idx}" type="number" placeholder="0" min="1" value="${item?item.qty:''}" />
      </div>
      <div>
        <label class="field-label">Unidade</label>
        <select class="select item-unit" data-idx="${idx}">
          ${UNITS.map(u => `<option ${item&&item.unit===u?'selected':''}>${u}</option>`).join('')}
        </select>
      </div>
      <div class="item-bitola-wrap" style="display:${isCab?'':'none'}">
        <label class="field-label">Bitola</label>
        <select class="select item-bitola" data-idx="${idx}">
          <option value="">—</option>
          ${['1,5mm²','2,5mm²','4,0mm²','6,0mm²','10mm²','16mm²','25mm²','35mm²','50mm²','70mm²','95mm²','120mm²'].map(b => `<option ${item&&item.bitola===b?'selected':''}>${b}</option>`).join('')}
        </select>
      </div>
      <div class="item-color-wrap" style="display:${isCab?'':'none'}">
        <label class="field-label">Cor</label>
        <select class="select item-color" data-idx="${idx}">
          <option value="">—</option>
          ${['Azul','Amarelo/Verde','Preto','Vermelho','Branco','Cinza','Marrom','Laranja'].map(col => `<option ${item&&item.color===col?'selected':''}>${col}</option>`).join('')}
        </select>
      </div>
      <div class="item-obs-span">
        <label class="field-label">Observação <span style="font-weight:400;color:var(--text-light)">(opcional)</span></label>
        <input class="input item-obs" data-idx="${idx}" placeholder="Ex: Para painel elétrico do 3º andar..." value="${item&&item.obs?item.obs:''}" />
      </div>
    </div>
  </div>`;
}

function renderDashboard(reqs) {
  const byS = s => reqs.filter(r => r.status===s).length;
  const done = reqs.filter(r => r.createdAt && r.deliveredAt);
  const avgDays = done.length ? Math.round(done.reduce((a,r) => a+(new Date(r.deliveredAt)-new Date(r.createdAt))/86400000,0)/done.length) : 0;
  const obras = [...new Set(reqs.map(r => r.clienteName).filter(Boolean))].sort();
  const barData = Object.entries(STATUS).map(([k,v]) => ({k,v,count:byS(k)}));
  const maxBar = Math.max(...barData.map(d => d.count),1);
  const recent = [...reqs].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0,6);

  // OS totals for gestão role
  const osTotals = {};
  reqs.forEach(r => {
    if (!r.osNumber) return;
    const totalQty = r.items.reduce((sum,it) => sum + (it.qty||0),0);
    osTotals[r.osNumber] = (osTotals[r.osNumber]||0) + totalQty;
  });
  const osRows = Object.entries(osTotals).map(([os,qty]) => `
    <tr>
      <td class="font-mono">${os}</td>
      <td class="fw-bold">${qty}</td>
    </tr>`).join('');

  return `
  <div id="dashboard-view">
    <div class="toolbar" style="margin-bottom:16px">
      <span style="font-size:13px;font-weight:600;color:var(--text-muted)">Filtrar por obra:</span>
      <button class="obra-tag active" data-obra="">🌐 Todas</button>
      ${obras.map(o => `<button class="obra-tag" data-obra="${o}">🏗 ${o}</button>`).join('')}
      <button class="btn btn-secondary btn-sm" id="btn-export-dash" style="margin-left:auto">📊 Exportar</button>
    </div>
    <div class="kpi-grid">
      ${[
        {icon:'📋',label:'Total de Requisições',value:reqs.length,color:'#1B4FD8'},
        {icon:'⏳',label:'Aguardando Aprovação',value:byS('pendente'),color:'#F59E0B'},
        {icon:'🔍',label:'Em Cotação',value:byS('cotacao'),color:'#8B5CF6'},
        {icon:'📦',label:'Pedido Efetuado',value:byS('pedido'),color:'#06B6D4'},
        {icon:'🎯',label:'Entregues',value:byS('entregue'),color:'#10B981'},
        {icon:'❌',label:'Rejeitadas',value:byS('rejeitado'),color:'#EF4444'},
        {icon:'⏱',label:'Prazo Médio (dias)',value:avgDays,color:'#64748B'},
      ].map(k => `
        <div class="kpi-card" style="border-top-color:${k.color}">
          <div class="kpi-icon">${k.icon}</div>
          <div class="kpi-value" style="color:${k.color}">${k.value}</div>
          <div class="kpi-label">${k.label}</div>
        </div>`).join('')}
    </div>

    <div class="dash-charts-grid">
      <div class="chart-card">
        <div class="chart-title">Requisições por Status</div>
        <div class="bar-chart">
          ${barData.map(d => `
            <div class="bar-col">
              <div class="bar-value">${d.count}</div>
              <div class="bar-fill" style="height:${Math.max(d.count/maxBar*100,4)}px;background:${d.v.color}"></div>
              <div class="bar-label">${d.v.icon}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Por Cliente</div>
        ${obras.map(o => {
          const t = reqs.filter(r => r.clienteName===o).length;
          return `<div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
              <span class="fw-bold">${o}</span><span class="text-muted">${t} req.</span>
            </div>
            <div style="height:6px;background:#F1F5F9;border-radius:3px">
              <div style="height:6px;border-radius:3px;background:var(--primary);width:${Math.max(t/reqs.length*100,0)}%"></div>
            </div>
          </div>`;}).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">📋 Requisições Recentes</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Cliente</th><th>OS</th><th>Solicitante</th><th>Status</th><th>Prazo</th></tr></thead>
          <tbody>
            ${recent.map(r => `
              <tr style="cursor:pointer" class="dash-req-row" data-req-id="${r.id}">
                <td class="font-mono fw-bold">${r.id}</td>
                <td>${r.clienteName||'—'}</td>
                <td style="color:var(--text-muted);font-size:12px">${r.osNumber||'—'}</td>
                <td>${getUserById(r.userId).name}</td>
                <td>${renderStatusBadge(r.status)}</td>
                <td style="color:${new Date(r.deadline) < new Date() && r.status!=='entregue' ? 'var(--danger)' : 'inherit'}">${fmtDate(r.deadline)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${state.user && state.user.role==="gestao" ? `
    <div class="card" style="margin-top:20px">
      <div class="card-header"><div class="card-title">📊 Total de Quantidade por OS</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>OS</th><th>Quantidade Total</th></tr></thead>
          <tbody>${osRows}</tbody>
        </table>
      </div>
    </div>` : ''}
  </div>`;
}

function renderMaterialsAdmin(user) {
  const materials = getMaterials();
  const categories = [...new Set(materials.map(m=>m.category))].sort();
  return `
  <div id="materials-view">
    <div class="toolbar" style="margin-bottom:16px">
      <button class="btn btn-secondary btn-sm" id="btn-back-materials">← Voltar</button>
      <button class="btn btn-primary" id="btn-open-add-material">+ Novo Material</button>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📦 Catálogo de Materiais</div><span class="text-muted" style="font-size:12px">${materials.length} materiais cadastrados</span></div>
      <div class="card-body">
        ${categories.map(cat=>`
          <div style="margin-bottom:18px">
            <div style="font-weight:800;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${cat}</div>
            ${materials.filter(m=>m.category===cat).map(m=>`
              <div class="material-row ${m.active?'':'material-inactive'}">
                <div style="flex:1;font-size:13px;font-weight:500">${m.name}</div>
                <span class="badge" style="background:#F8FAFC;color:var(--text-muted);border-color:var(--border)">${m.defaultUnit}</span>
                <span class="badge" style="background:${m.active?'#ECFDF5':'#FEF2F2'};color:${m.active?'#10B981':'#EF4444'};border-color:${m.active?'#A7F3D0':'#FECACA'}">${m.active?'Ativo':'Inativo'}</span>
                <button class="btn btn-secondary btn-sm mat-toggle" data-mat-id="${m.id}" aria-label="${m.active?'Desativar':'Ativar'} ${m.name}">${m.active?'Desativar':'Ativar'}</button>
                ${user.role!=='obra'?`<button class="btn btn-danger btn-sm mat-delete" data-mat-id="${m.id}" aria-label="Excluir ${m.name}" title="Excluir material">🗑</button>`:''}
              </div>`).join('')}
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderAddMaterialModal() {
  const categories = [...new Set(getMaterials().map(m=>m.category))].sort();
  return `
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">+ Novo Material</div>
      <button class="modal-close" id="modal-close">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="margin-bottom:12px">
        <div>
          <label class="field-label">Categoria *</label>
          <div style="display:flex;gap:8px">
            <select id="mat-cat-select" class="select" style="flex:1">
              ${categories.map(c=>`<option>${c}</option>`).join('')}
              <option value="__new__">+ Nova categoria...</option>
            </select>
          </div>
          <input id="mat-cat-new" class="input hidden" placeholder="Nome da nova categoria" style="margin-top:6px" />
        </div>
      </div>
      <div class="form-row" style="margin-bottom:12px">
        <div>
          <label class="field-label">Nome do Material *</label>
          <input id="mat-name" class="input" placeholder="Ex: Cabo Flexível 6mm² Preto" />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="field-label">Unidade padrão</label>
          <select id="mat-unit" class="select">
            ${UNITS.map(u=>`<option>${u}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-close2">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-material">Salvar Material</button>
    </div>
  </div>`;
}

function renderObrasPanel(user) {
  const clientes = getClientes();
  const oses     = getOSes();
  return `
  <div id="obras-panel-view">
    <div class="toolbar" style="margin-bottom:16px">
      <button class="btn btn-primary" id="btn-open-add-obra">+ Novo Cliente</button>
      <button class="btn btn-secondary" id="btn-open-add-os" style="margin-left:8px">+ Nova OS</button>
    </div>

    <!-- Clientes -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">🏢 Clientes</div></div>
      <div class="card-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Cliente</th><th>OSes</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
            <tbody>
              ${clientes.map(c => {
                const qtdOS = oses.filter(o=>o.clienteId===c.id).length;
                return `<tr>
                  <td class="fw-bold">${c.name}</td>
                  <td style="color:var(--text-muted)">${qtdOS} OS${qtdOS!==1?'s':''}</td>
                  <td><span class="badge" style="background:${c.active?'#ECFDF5':'#FEF2F2'};color:${c.active?'#10B981':'#EF4444'}">${c.active?'Ativo':'Inativo'}</span></td>
                  <td style="text-align:right">
                    <button class="btn btn-secondary btn-sm obra-toggle" data-obra-id="${c.id}">${c.active?'Desativar':'Ativar'}</button>
                    <button class="btn btn-danger btn-sm obra-delete" data-obra-id="${c.id}" title="Excluir cliente">🗑</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- OSes -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">📋 Ordens de Serviço</div></div>
      <div class="card-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>OS</th><th>Descrição</th><th>Cliente</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
            <tbody>
              ${oses.map(o => {
                const cli = clientes.find(c=>c.id===o.clienteId);
                return `<tr>
                  <td class="fw-bold font-mono">${o.osNumber}</td>
                  <td>${o.description}</td>
                  <td style="color:var(--text-muted)">${cli?.name||'—'}</td>
                  <td><span class="badge" style="background:${o.active?'#ECFDF5':'#FEF2F2'};color:${o.active?'#10B981':'#EF4444'}">${o.active?'Ativa':'Inativa'}</span></td>
                  <td style="text-align:right">
                    <button class="btn btn-secondary btn-sm os-toggle" data-os-id="${o.id}">${o.active?'Desativar':'Ativar'}</button>
                    <button class="btn btn-danger btn-sm os-delete" data-os-id="${o.id}" title="Excluir OS">🗑</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Orçamento por OS -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">📊 Orçamento de Materiais por OS</div></div>
      <div class="card-body">
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
          Importe uma planilha (.xlsx / .csv) com o orçamento previsto por OS.
          Colunas: A = nome do material · B = quantidade orçada · C = unidade (opcional).
        </p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
          <div style="min-width:220px">
            <label class="field-label">OS</label>
            ${renderSS('budget-obra-sel', 'Buscar OS...',
              oses.map(o=>{const c=clientes.find(x=>x.id===o.clienteId);return {value:String(o.id),text:`${o.osNumber} — ${c?.name||''}`};}),
              ''
            )}
          </div>
          <div>
            <label class="field-label">Planilha de orçamento</label>
            <input type="file" id="budget-file-input" accept=".xlsx,.xls,.csv"
              style="padding:6px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px" />
          </div>
          <button class="btn btn-primary" id="btn-upload-budget">📥 Importar</button>
        </div>
        <div id="budget-preview" style="margin-top:14px"></div>
      </div>
    </div>

    <!-- Histórico por Cliente / OS -->
    <div class="card">
      <div class="card-header" style="flex-wrap:wrap;gap:10px">
        <div class="card-title">📈 Histórico de Materiais</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <div style="min-width:180px">
            ${renderSS('history-cliente-filter', '🏢 Todos os clientes',
              clientes.map(c => ({ value: String(c.id), text: c.name })),
              ''
            )}
          </div>
          <div style="min-width:220px">
            ${renderSS('history-obra-filter', '📋 Todas as OSes',
              oses.map(o=>{const c=clientes.find(x=>x.id===o.clienteId);return {value:o.osNumber,text:`${o.osNumber} — ${o.description}`};}),
              ''
            )}
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-export-history">📗 Exportar</button>
        </div>
      </div>
      <div class="card-body">
        <div id="history-table-container">
          <div class="empty-state" style="padding:40px">
            <div class="empty-state-icon">🔎</div>
            <div class="empty-state-title">Selecione um cliente ou uma OS para ver o histórico</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderObraHistoryTable(filter, reqs) {
  // filter: { osNumber?, clienteId? }
  const filtered = reqs.filter(r => {
    if (filter.osNumber)  return r.osNumber === filter.osNumber;
    if (filter.clienteId) return r.clienteId === filter.clienteId;
    return false;
  });
  const items = [];
  filtered.forEach(r => {
    r.items.forEach(it => {
      items.push({
        date: r.createdAt,
        reqId: r.id,
        osNumber: r.osNumber || '',
        requester: getUserById(r.userId).name,
        material: it.name || it.description,
        qty: it.qty,
        unit: it.unit,
        deliveredAt: r.deliveredAt || '—',
        estimatedDelivery: r.estimatedDelivery || '—',
        status: r.status,
        approved: it.approved
      });
    });
  });

  if (items.length === 0) return `<div class="empty-state" style="padding:32px"><div class="empty-state-icon">📭</div><div class="empty-state-title">Nenhum material requisitado para esta seleção.</div></div>`;
  // Label descritivo
  let headerLabel = '';
  if (filter.osNumber) {
    const osObj = getOSes().find(o => o.osNumber === filter.osNumber);
    const cli   = osObj ? getClientes().find(c => c.id === osObj.clienteId) : null;
    headerLabel = `${cli?.name||''} · ${filter.osNumber}${osObj?' — '+osObj.description:''}`;
  } else if (filter.clienteId) {
    const cli = getClientes().find(c => c.id === filter.clienteId);
    headerLabel = cli?.name || '';
  }

  return `
  ${headerLabel ? `<div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;padding:8px 12px;background:#F8FAFC;border-radius:var(--radius-sm);border:1px solid var(--border)">
    🔎 Exibindo <strong>${items.length}</strong> item(s) de <strong>${filtered.length}</strong> requisição(ões) — <span>${headerLabel}</span>
  </div>` : ''}
  <div class="table-wrap">
    <table id="table-history">
      <thead>
        <tr>
          <th>Data Pedido</th>
          <th>${filter.clienteId && !filter.osNumber ? 'OS' : 'Solicitante'}</th>
          <th>Solicitante</th>
          <th>Material</th>
          <th>Qtd</th>
          <th>Un.</th>
          <th>Status / Entrega</th>
          <th>Status Geral</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(it => {
          let statusText = '';
          let statusColor = '';
          
          if (it.status === 'rejeitado' || it.approved === false) {
             statusText = 'Rejeitado';
             statusColor = 'var(--danger)';
          } else if (it.status === 'pendente') {
             statusText = 'Pendente';
             statusColor = 'var(--danger)';
          } else if (it.status === 'entregue') {
             statusText = fmtDate(it.deliveredAt);
             statusColor = 'var(--success)';
          } else {
             statusText = it.estimatedDelivery !== '—' ? fmtDate(it.estimatedDelivery) : 'Aprovado';
             statusColor = '#3B82F6'; // BLUE as requested
          }

          return `
          <tr>
            <td>${fmtDate(it.date)}</td>
            ${filter.clienteId && !filter.osNumber ? `<td style="font-size:11px;color:var(--text-muted)">${it.osNumber||'—'}</td>` : ''}
            <td>${it.requester}</td>
            <td class="fw-bold">${it.material}</td>
            <td>${it.qty}</td>
            <td>${it.unit}</td>
            <td><span style="color:${statusColor};font-weight:700">${statusText}</span></td>
            <td>${it.approved === false ? '<span class="badge" style="color:var(--danger);background:#FEF2F2;border-color:var(--danger)20">❌ Rejeitado</span>' : renderStatusBadge(it.status)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderAddObraModal() {
  return `
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">🏢 Novo Cliente</div>
      <button class="modal-close" id="modal-close">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div>
          <label class="field-label">Nome do Cliente *</label>
          <input id="obra-name" class="input" placeholder="Ex: Construtora Horizonte S.A." />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-close2">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-obra">Salvar Cliente</button>
    </div>
  </div>`;
}

function renderAddOSModal() {
  const clientes = getClientes().filter(c => c.active);
  return `
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">📋 Nova Ordem de Serviço</div>
      <button class="modal-close" id="modal-close">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="margin-bottom:14px">
        <div>
          <label class="field-label">Cliente *</label>
          ${renderSS('os-cliente-sel', 'Buscar cliente...',
            clientes.map(c => ({ value: String(c.id), text: c.name })),
            ''
          )}
        </div>
      </div>
      <div class="form-row form-row-2" style="margin-bottom:14px">
        <div>
          <label class="field-label">Número da OS *</label>
          <input id="os-number" class="input" placeholder="Ex: 1001" />
        </div>
        <div>
          <label class="field-label">Descrição da Obra *</label>
          <input id="os-description" class="input" placeholder="Ex: SPDA e aterramento — Bloco C" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-close2">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-os">Salvar OS</button>
    </div>
  </div>`;
}

// ── MODAL: NOVA OS NO FLUXO DE APROVAÇÃO ─────────────────────
function renderApprovalNewOSModal(clienteId, clienteName) {
  const clientes = getClientes().filter(c => c.active);
  return `
  <div class="modal" style="max-width:540px">
    <div class="modal-header">
      <div class="modal-title">📋 Cadastrar Nova OS</div>
      <button class="modal-close" id="modal-close">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="margin-bottom:14px">
        <div>
          <label class="field-label">Cliente</label>
          ${clienteId
            ? `<div class="fw-bold" style="padding:8px 0;font-size:13px;color:var(--text)">${clienteName||'—'}</div>
               <input type="hidden" id="approval-os-cliente-id" value="${clienteId}" />`
            : renderSS('approval-os-cliente-sel', 'Selecione o cliente...', clientes.map(c=>({value:String(c.id),text:c.name})), '')
          }
        </div>
      </div>
      <div class="form-row form-row-2" style="margin-bottom:14px">
        <div>
          <label class="field-label">Número da OS <span style="color:var(--danger)">*</span></label>
          <input id="approval-os-number" class="input" placeholder="Ex: 1001" />
        </div>
        <div>
          <label class="field-label">Descrição da Obra <span style="color:var(--danger)">*</span></label>
          <input id="approval-os-description" class="input" placeholder="Ex: SPDA — Bloco C" />
        </div>
      </div>

      <div style="border-top:1px solid var(--border);padding-top:14px;margin-top:4px">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">
          📊 Orçamento de Materiais &nbsp;<span style="font-weight:400;font-size:11px;color:var(--text-light)">(opcional)</span>
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Importe uma planilha com os materiais previstos. Colunas: A = material · B = quantidade · C = unidade.
        </p>
        <input type="file" id="approval-budget-file" accept=".xlsx,.xls,.csv"
          style="padding:6px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;width:100%" />
        <div id="approval-budget-preview" style="margin-top:8px;font-size:12px;color:var(--success);min-height:16px"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-close2">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-approval-os">✅ Salvar OS e Vincular</button>
    </div>
  </div>`;
}

// ── CAMERA / OCR MODAL ────────────────────────────────────────

function renderCameraModal() {
  return `
  <div class="modal" style="max-width:600px">
    <div class="modal-header">
      <div class="modal-title">📷 Importar Lista por Foto</div>
      <button class="modal-close" id="cam-close" aria-label="Fechar">×</button>
    </div>
    <div class="modal-body">

      <!-- Passo 1: Captura -->
      <div id="cam-step-1">
        <div class="cam-drop-area" id="cam-drop-area">
          <div style="font-size:48px;margin-bottom:12px">📋</div>
          <div style="font-weight:700;font-size:14px;margin-bottom:6px">Fotografe ou selecione a lista de materiais</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:20px;line-height:1.5">
            Funciona melhor com listas <strong>impressas</strong> ou escritas com letra legível.<br>
            No celular, abre a câmera diretamente.
          </div>
          <label class="btn btn-primary" for="cam-file-input" style="cursor:pointer">
            📱 Abrir Câmera / Selecionar Foto
          </label>
          <input type="file" id="cam-file-input" accept="image/*" capture="environment" style="display:none" />
        </div>
        <div id="cam-preview-wrap" class="hidden" style="margin-top:16px;text-align:center">
          <img id="cam-preview-img" style="max-width:100%;max-height:260px;border-radius:8px;border:1px solid var(--border);object-fit:contain" alt="Prévia da foto" />
          <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" id="cam-btn-analyze">🔍 Analisar Imagem</button>
            <button class="btn btn-secondary" id="cam-btn-retake">↺ Trocar foto</button>
          </div>
        </div>
      </div>

      <!-- Carregando OCR -->
      <div id="cam-step-loading" class="hidden" style="text-align:center;padding:32px 0">
        <div style="font-size:40px;margin-bottom:16px">🔍</div>
        <div style="font-weight:700;margin-bottom:8px">Lendo a lista...</div>
        <div id="cam-progress-text" style="font-size:12px;color:var(--text-muted);margin-bottom:14px">Carregando leitor de texto...</div>
        <div class="cam-progress-wrap">
          <div class="cam-progress-bar" id="cam-progress-bar"></div>
        </div>
        <div style="font-size:11px;color:var(--text-light);margin-top:10px">Primeira vez pode demorar ~20s para baixar o leitor</div>
      </div>

      <!-- Passo 2: Revisão -->
      <div id="cam-step-2" class="hidden">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:10px">
          ✏️ Revise os itens detectados. Use o autocomplete para corrigir o nome e ajuste quantidade/unidade.
        </div>
        <div id="cam-review-wrap"></div>
      </div>

    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="cam-btn-cancel">Cancelar</button>
      <button class="btn btn-primary hidden" id="cam-btn-import">✅ Adicionar ao Formulário</button>
    </div>
  </div>`;
}

function renderAudioModal() {
  return `
  <div class="modal" style="max-width:560px">
    <div class="modal-header">
      <div class="modal-title">🎙️ Ditar Lista de Materiais</div>
      <button class="modal-close" id="aud-close" aria-label="Fechar">×</button>
    </div>
    <div class="modal-body">

      <!-- Estado: gravando -->
      <div id="aud-recording-state">
        <div style="text-align:center;padding:8px 0 12px">
          <div class="mic-wave-wrap" id="aud-wave">
            <div class="mic-wave-bar"></div>
            <div class="mic-wave-bar"></div>
            <div class="mic-wave-bar"></div>
            <div class="mic-wave-bar"></div>
            <div class="mic-wave-bar"></div>
          </div>
          <div style="font-weight:700;font-size:14px;color:var(--danger);margin-bottom:4px">🔴 Gravando...</div>
          <div style="font-size:12px;color:var(--text-muted)">Fale um item por vez. Pausa natural separa os itens.</div>
        </div>
        <div class="audio-interim" id="aud-interim">Aguardando sua voz...</div>
        <div style="text-align:center">
          <button class="btn btn-danger" id="aud-btn-stop">⏹ Parar Gravação</button>
        </div>
      </div>

      <!-- Estado: revisão -->
      <div id="aud-review-state" class="hidden">
        <details style="margin-bottom:12px">
          <summary style="font-size:12px;color:var(--text-muted);cursor:pointer;user-select:none">Ver transcrição bruta</summary>
          <div id="aud-raw-transcript" style="margin-top:8px;background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px;font-size:12px;font-family:monospace;line-height:1.6;max-height:120px;overflow-y:auto;white-space:pre-wrap;color:var(--text-muted)"></div>
        </details>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:10px">
          ✏️ Revise os itens detectados. Use o autocomplete para corrigir o nome e ajuste quantidade/unidade.
        </div>
        <div id="aud-review-wrap"></div>
        <div style="margin-top:12px;text-align:center">
          <button class="btn btn-secondary btn-sm" id="aud-btn-restart">🎙️ Gravar novamente</button>
        </div>
      </div>

    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="aud-btn-cancel">Cancelar</button>
      <button class="btn btn-primary hidden" id="aud-btn-import">✅ Adicionar ao Formulário</button>
    </div>
  </div>`;
}

