import sys

with open("app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_code = """
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
}
"""

# Append to the end of the file or before the last function if needed
# Actually, I'll just append it to the end and make sure the last line of the file is correct.

# Remove the line 410 which I tried to target if it's there
# It was `  });\n}` inside `bindMaterialModal`.

with open("app.js", "w", encoding="utf-8") as f:
    for line in lines:
        f.write(line)
    f.write(new_code)

print("app.js updated")
