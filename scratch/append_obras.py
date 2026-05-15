obras_code = """
// ── OBRAS PANEL ─────────────────────────────────────────────
function renderObrasPanel(user) {
  const obras = getObras();
  return `
  <div id="obras-view">
    <div class="toolbar" style="margin-bottom:16px">
      <button class="btn btn-secondary btn-sm" id="btn-back-obras">← Voltar</button>
      <button class="btn btn-primary" id="btn-open-add-obra">+ Nova Obra</button>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🏗 Gerenciar Obras</div><span class="text-muted" style="font-size:12px">${obras.length} obras cadastradas</span></div>
      <div class="card-body">
        ${obras.map(o=>`
          <div class="material-row ${o.active?'':'material-inactive'}">
            <div style="flex:1;font-size:13px;font-weight:500">${o.name}</div>
            <span class="badge" style="background:${o.active?'#ECFDF5':'#FEF2F2'};color:${o.active?'#10B981':'#EF4444'};border-color:${o.active?'#A7F3D0':'#FECACA'}">${o.active?'Ativa':'Inativa'}</span>
            <button class="btn btn-secondary btn-sm obra-edit" data-id="${o.id}">✏ Editar</button>
            <button class="btn btn-secondary btn-sm obra-toggle" data-id="${o.id}">${o.active?'Desativar':'Ativar'}</button>
            <button class="btn btn-danger btn-sm obra-delete" data-id="${o.id}">🗑 Excluir</button>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderAddObraModal(obra=null) {
  return `
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">${obra ? 'Editar Obra' : '+ Nova Obra'}</div>
      <button class="modal-close" id="modal-close-obra">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="margin-bottom:12px">
        <div>
          <label class="field-label">Nome da Obra *</label>
          <input id="obra-name" class="input" placeholder="Ex: Subestação Centro" value="${obra?obra.name:''}" />
          <input type="hidden" id="obra-id" value="${obra?obra.id:''}" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-cancel-obra">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-obra">Salvar Obra</button>
    </div>
  </div>`;
}

function bindObrasPanel() {
  document.getElementById('btn-back-obras')?.addEventListener('click',()=>{ state.view='list'; render(); });

  document.getElementById('btn-open-add-obra')?.addEventListener('click',()=>{
    overlay.innerHTML = renderAddObraModal();
    overlay.classList.remove('hidden');
    bindObraModal();
  });

  document.querySelectorAll('.obra-edit').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id);
      const obra=getObras().find(o=>o.id===id);
      if(obra){
        overlay.innerHTML = renderAddObraModal(obra);
        overlay.classList.remove('hidden');
        bindObraModal();
      }
    });
  });

  document.querySelectorAll('.obra-toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id);
      const obra=getObras().find(o=>o.id===id);
      if(obra){ updateObra(id,{active:!obra.active}); render(); }
    });
  });

  document.querySelectorAll('.obra-delete').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(confirm('Tem certeza que deseja excluir esta obra? Isso não afeta as requisições passadas, mas remove a obra da lista de opções.')){ 
        deleteObra(parseInt(btn.dataset.id)); 
        showToast('Obra excluída.'); 
        render(); 
      }
    });
  });
}

function bindObraModal() {
  const closeModal = ()=>{ overlay.classList.add('hidden'); overlay.innerHTML=''; };
  document.getElementById('modal-close-obra')?.addEventListener('click', closeModal);
  document.getElementById('modal-cancel-obra')?.addEventListener('click', closeModal);

  document.getElementById('btn-save-obra')?.addEventListener('click', ()=>{
    const name = document.getElementById('obra-name').value.trim();
    const idStr = document.getElementById('obra-id').value;
    
    if (!name) { showToast('Informe o nome da obra.','error'); return; }
    
    if (idStr) {
      const id = parseInt(idStr);
      const oldObra = getObras().find(o=>o.id===id);
      updateObra(id, { name });
      
      if (oldObra && oldObra.name !== name) {
        const reqs = getRequisitions();
        let changed = false;
        reqs.forEach(r => {
          if (r.obra === oldObra.name) { r.obra = name; changed = true; }
        });
        if (changed) saveRequisitions(reqs);
        
        const users = getUsers();
        changed = false;
        users.forEach(u => {
          if (u.obra === oldObra.name) { u.obra = name; changed = true; }
        });
        if (changed) saveUsers(users);
      }
      showToast('Obra atualizada!');
    } else {
      addObra(name);
      showToast('Obra cadastrada!');
    }
    closeModal(); render();
  });
}
"""

with open('c:/Users/MARSER-16/OneDrive/Desktop/projeto aspem/views2.js', 'a', encoding='utf-8') as f:
    f.write(obras_code)
