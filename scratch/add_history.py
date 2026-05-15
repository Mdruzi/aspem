path = 'c:/Users/MARSER-16/OneDrive/Desktop/projeto aspem/views2.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the closing brace of bindObrasPanel  
marker = "showToast('Obra exclu\u00edda.');"
idx = content.find(marker)
if idx < 0:
    print("ERROR: marker not found")
    exit(1)

# Find the closing } of bindObrasPanel after the marker
closing = content.find('\n}\n', idx)
if closing < 0:
    closing = content.find('\n}\r\n', idx)
if closing < 0:
    print("ERROR: closing brace not found")
    exit(1)

# The history code to insert before the closing }
history_code = '''

  // ── Obra History ──
  const historyFilter = document.getElementById('obra-history-filter');
  const exportBtn = document.getElementById('btn-export-obra-history');
  let currentObraData = [];

  function renderObraHistory(obraName) {
    const container = document.getElementById('obra-history-container');
    const reqs = getRequisitions().filter(r => r.obra === obraName);
    currentObraData = [];
    if (reqs.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:24px"><div class="empty-state-desc">Nenhuma requisicao encontrada para esta obra.</div></div>';
      exportBtn.disabled = true;
      return;
    }
    reqs.forEach(r => {
      const owner = getUserById(r.userId);
      r.items.forEach(it => {
        currentObraData.push({ reqId:r.id, date:r.createdAt, requester:owner.name, os:r.osNumber||'', category:it.category, material:it.name||'', qty:it.qty, unit:it.unit, status:STATUS[r.status].label, deliveryDate:r.deliveredAt||r.estimatedDelivery||'', approver:r.approvedByName||'' });
      });
    });
    container.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Req.</th><th>Data Solic.</th><th>Solicitante</th><th>OS</th><th>Categoria</th><th>Material</th><th>Qtd</th><th>Un.</th><th>Status</th><th>Aprovador</th><th>Entrega</th></tr></thead>
      <tbody>${currentObraData.map(d=>`<tr>
        <td class="font-mono fw-bold" style="font-size:11px">${d.reqId}</td>
        <td>${fmtDate(d.date)}</td>
        <td>${d.requester}</td>
        <td style="color:var(--text-muted);font-size:11px">${d.os||'\\u2014'}</td>
        <td><span class="cat-badge" style="font-size:10px">${d.category}</span></td>
        <td>${d.material}</td>
        <td style="text-align:center;font-weight:700">${d.qty}</td>
        <td style="text-align:center">${d.unit}</td>
        <td style="font-size:11px">${d.status}</td>
        <td>${d.approver||'\\u2014'}</td>
        <td>${fmtDate(d.deliveryDate)}</td>
      </tr>`).join('')}</tbody></table></div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:8px">${currentObraData.length} materiais em ${reqs.length} requisicoes</div>`;
    exportBtn.disabled = false;
  }

  historyFilter?.addEventListener('change', e => {
    if (e.target.value) renderObraHistory(e.target.value);
    else {
      document.getElementById('obra-history-container').innerHTML = '<div class="empty-state" style="padding:24px"><div class="empty-state-desc">Selecione uma obra acima para ver o historico.</div></div>';
      exportBtn.disabled = true;
    }
  });

  exportBtn?.addEventListener('click', () => {
    if (currentObraData.length === 0) return;
    const obraName = historyFilter.value;
    const sep = '\\t';
    const hdr = ['Requisicao','Data Solicitacao','Solicitante','OS','Categoria','Material','Qtd','Un.','Status','Aprovador','Entrega'];
    const rows = currentObraData.map(d => [d.reqId,fmtDate(d.date),d.requester,d.os,d.category,d.material,d.qty,d.unit,d.status,d.approver||'',fmtDate(d.deliveryDate)].join(sep));
    const csv = '\\uFEFF' + [hdr.join(sep), ...rows].join('\\n');
    const blob = new Blob([csv], {type:'application/vnd.ms-excel;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'historico_' + obraName.replace(/\\s+/g,'_') + '.xls';
    a.click(); URL.revokeObjectURL(url);
    showToast('Historico exportado em Excel!');
  });'''

# Insert the history code before the closing }
new_content = content[:closing] + history_code + content[closing:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("OK - History code added successfully!")
